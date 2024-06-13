import React, { useState, useEffect } from 'react';

export default function AddSongsButton({ songs, fetchSongs }) {
    const [showForm, setShowForm] = useState(false);
    const [url, setUrl] = useState('');
    const [response, setResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState('');
    const [newPlaylist, setNewPlaylist] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const res = await fetch('/api/playlistname');
                const data = await res.json();
                setPlaylists(data || []);
            } catch (error) {
                console.error('Error fetching playlists:', error);
            }
        };

        fetchPlaylists();
    }, []);

    const handleSubmitApi = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        let cleanedUrl = url;

        if (url.includes("list=")) {
            const playlistUrl = new URL(url);
            const listId = playlistUrl.searchParams.get('list');
            cleanedUrl = `https://www.youtube.com/playlist?list=${listId}`;
        } else if (url.includes("?v=")) {
            const videoId = url.match(/(?<=v=)[^&]+/)[0];
            cleanedUrl = `https://www.youtube.com/watch?v=${videoId}`;
        }

        const route = url.includes("list=") ? '/api/scrapeplaylist' : '/api/scrape';
        try {
            const res = await fetch(route, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url: cleanedUrl, playlist: selectedPlaylist === 'new' ? newPlaylist : selectedPlaylist })
            });
            const data = await res.json();
            setResponse(data);
            fetchSongs();
        } catch (error) {
            setError('Error submitting the URL');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveApi = async () => {
        setError(null);
        try {
            const playlistToSave = newPlaylist || selectedPlaylist;
            const res = await fetch('/api/updateSongs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ playlist: playlistToSave })
            });
            const data = await res.json();
            setResponse(data);
            fetchSongs();
        } catch (error) {
            setError('Error saving the songs');
        }
    };

    const handleClearApi = async () => {
        setError(null);
        try {
            const res = await fetch('/api/clearSongs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();
            setResponse(data);
            fetchSongs();
        } catch (error) {
            setError('Error clearing the songs');
        }
    };

    const isAddButtonDisabled = !url || (selectedPlaylist === 'new' && !newPlaylist);

    return (
        <div style={{ backgroundColor: '#171717', display: 'flex', flexWrap: 'wrap' }}>
            <button
                style={{ height: '40px' }}
                className='text-white rounded-md bg-[#2F2F2F] px-2 py-1 font ml-6 mt-3 mb-2 hover:cursor-pointer hover:bg-[#14843B]'
                onClick={() => setShowForm(!showForm)}
            >
                {showForm ? 'Cancelar' : 'Adicionar Música'}
            </button>
            {showForm && (
                <form onSubmit={handleSubmitApi} style={{ display: 'flex' }}>
                    <div className='mx-3'>
                        <label className='mx-1' htmlFor="url">Link </label>
                        <input
                            type="text"
                            id="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required
                            style={{ height: '40px' }}
                            className='text-white rounded-md w-40 bg-[#2F2F2F] px-2 py-1 mt-3 mb-2 hover:bg-[#3F3F3F]'
                        />
                    </div>


                    <div className='mx-1'>
                        <label htmlFor="url">Playlist </label>
                        <select
                    
                        value={selectedPlaylist}
                        onChange={(e) => setSelectedPlaylist(e.target.value)}
                        className='text-white rounded-md bg-[#2F2F2F] px-2 py-1 font mx-2 mt-3 mb-2'
                        style={{ height: '40px' }}
                    >
                        <option value="none" disabled>Selecione uma playlist</option>
                        <option value="">Nenhuma</option>
                        {playlists.map((playlist, index) => (
                            <option key={index} value={playlist.playlist}>{playlist.playlist}</option>
                        ))}
                        <option value="new">Nova playlist</option>
                    </select>

                        
                    </div>

                    {selectedPlaylist === 'new' && (
                        <input
                            type="text"
                            placeholder="Digite o nome da nova playlist"
                            value={newPlaylist}
                            onChange={(e) => setNewPlaylist(e.target.value)}
                            required
                            className='text-white rounded-md bg-[#2F2F2F] px-2 py-1 font mx-2 mt-3 mb-2'
                            style={{ height: '40px' }}
                        />
                    )}
                    <button
                        style={{ maxHeight: '40px' }}
                        className={`mt-3 mb-2 text-white rounded-md bg-[#2F2F2F] px-2 py-1 font mx-3 hover:cursor-pointer ${isAddButtonDisabled ? 'bg-gray-500' : 'hover:bg-[#14843B]'}`}
                        type="submit"
                        disabled={isAddButtonDisabled}
                    >
                        {isLoading ? 'Carregando...' : 'Adicionar'}
                    </button>
                </form>
            )}
            {songs.length > 0 && (
                <>
                    <button
                        style={{ height: '40px' }}
                        className='text-white rounded-md bg-[#2F2F2F] px-2 py-1 font mx-2 mt-3 mb-2 hover:cursor-pointer hover:bg-[#14843B]'
                        onClick={handleSaveApi}
                    >
                        Salvar
                    </button>
                    <button
                        style={{ height: '40px' }}
                        className='text-white rounded-md bg-[#2F2F2F] px-2 py-1 font mt-3 mb-2 hover:cursor-pointer hover:bg-[#C11925]'
                        onClick={handleClearApi}
                    >
                        Limpar Lista
                    </button>
                </>
            )}
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
}
