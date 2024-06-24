import React, { useState, useEffect } from 'react';

const AddSongsButton = ({ songs, fetchSongs }) => {
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
                if (!res.ok) {
                    throw new Error('Erro ao buscar playlists');
                }
                const data = await res.json();
                setPlaylists(data || []);
            } catch (error) {
                console.error('Error fetching playlists:', error);
            }
        };

        fetchPlaylists();
    }, []);

    const updatePlaylistName = async () => {
        try {
            const res = await fetch('/api/updatePlaylistName', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ playlist: selectedPlaylist === 'new' ? newPlaylist : selectedPlaylist }),
            });

            if (!res.ok) {
                throw new Error('Erro ao atualizar o nome da playlist');
            }

            const data = await res.json();
            return data.playlist; // Retorna o nome da playlist atualizada
        } catch (error) {
            console.error('Erro ao chamar API updateplaylistname:', error);
            throw error; // Propaga o erro para ser tratado no componente
        }
    };

    const handleSubmitApi = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (url.includes('start_radio=')) {
            alert('Links com "start_radio=" não são aceitos. Por favor, use links de playlists sem o rádio ou links de músicas do YouTube.');
            setIsLoading(false);
            return;
        }

        let cleanedUrl = url;

        if (url.includes("spotify.com")) {
            try {
                const playlistData = await fetch(`/api/scrapePlaylistSpotify?link=${encodeURIComponent(url)}`);
                if (!playlistData.ok) {
                    throw new Error('Erro ao buscar dados da playlist do Spotify');
                }
                const playlistJson = await playlistData.json();
                console.log('Dados da playlist do Spotify:', playlistJson);

                const youtubeData = await fetch(`/api/extractYouTubeInfo?playlistId=${playlistJson.playlistId}`);
                if (!youtubeData.ok) {
                    throw new Error('Erro ao buscar informações do YouTube');
                }
                const youtubeJson = await youtubeData.json();
                console.log('Informações do YouTube:', youtubeJson);

                setResponse(youtubeJson);
                fetchSongs();
                setIsLoading(false);
                return; // Termina a execução aqui se o link for do Spotify
            } catch (error) {
                setError('Erro ao chamar APIs do Spotify');
                setIsLoading(false);
                return;
            }
        } else if (url.includes("list=")) {
            const playlistUrl = new URL(url);
            const listId = playlistUrl.searchParams.get('list');
            cleanedUrl = `https://www.youtube.com/playlist?list=${listId}`;
        } else if (url.includes("?v=")) {
            const videoId = url.match(/(?<=v=)[^&]+/)[0];
            cleanedUrl = `https://www.youtube.com/watch?v=${videoId}`;
        } else {
            alert('Somente links de músicas e playlists do YouTube ou Spotify são aceitos.');
            setIsLoading(false);
            return;
        }

        const route = url.includes("list=") ? '/api/scrapeplaylist' : '/api/scrape';
        try {
            const res = await fetch(route, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: cleanedUrl, playlist: selectedPlaylist === 'new' ? newPlaylist : selectedPlaylist }),
            });
            if (!res.ok) {
                throw new Error('Erro ao submeter o URL');
            }
            const data = await res.json();
            setResponse(data);
            fetchSongs();
        } catch (error) {
            setError('Erro ao submeter o URL');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveApi = async () => {
        setError(null);
        try {
            const updatedPlaylist = await updatePlaylistName();

            const res = await fetch('/api/updateSongs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ playlist: updatedPlaylist }),
            });

            if (!res.ok) {
                throw new Error('Erro ao salvar as músicas');
            }

            const data = await res.json();
            setResponse(data);
            await fetchSongs();

        } catch (error) {
            setError('Erro ao salvar as músicas');
            console.error('Erro durante a requisição:', error);
        }
    };

    const handleClearApi = async () => {
        setError(null);
        try {
            const res = await fetch('/api/clearSongs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!res.ok) {
                throw new Error('Erro ao limpar as músicas');
            }
            const data = await res.json();
            setResponse(data);
            fetchSongs();
        } catch (error) {
            setError('Erro ao limpar as músicas');
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
                <div className='mx-1'>
                    <label htmlFor="playlist">Playlist </label>
                    <select
                        value={selectedPlaylist}
                        onChange={(e) => setSelectedPlaylist(e.target.value)}
                        className='text-white rounded-md bg-[#2F2F2F] px-2 py-1 font mx-2 mt-3 mb-2'
                        style={{ height: '40px' }}
                    >
                        <option value="none" disabled>Selecione uma playlist</option>
                        <option value="new">Nova playlist</option>
                        <option value="">Nenhuma</option>
                        {playlists.map((playlist, index) => (
                            <option key={index} value={playlist.playlist}>{playlist.playlist}</option>
                        ))}
                    </select>
                </div>
            )}

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

            {songs.length > 0 && (
                <>
                    <button
                        style={{ height: '40px' }}
                        className='text-white rounded-md bg-[#14843B] px-2 py-1 font mx-2 mt-3 mb-2 hover:cursor-pointer hover:bg-[#14843B]'
                        onClick={handleSaveApi}
                    >
                        Salvar Músicas
                    </button>
                    <button
                        style={{ height: '40px' }}
                        className='text-white rounded-md bg-[#C11925] px-2 py-1 font mt-3 mb-2 hover:cursor-pointer hover:bg-[#C11925]'
                        onClick={handleClearApi}
                    >
                        Limpar Lista
                    </button>
                </>
            )}

            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
};

export default AddSongsButton;
