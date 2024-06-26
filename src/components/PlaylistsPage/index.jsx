import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useMusicContext } from '../context';

const PlaylistPage = ({ onSongSelect }) => {
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [allSongs, setAllSongs] = useState([]);
    const { handleSongSelect } = useMusicContext();
    const [filteredSongs, setFilteredSongs] = useState([]);
    const [selectedSong, setSelectedSong] = useState(null);

    useEffect(() => {
        async function fetchPlaylists() {
            try {
                const response = await axios.get('/api/playlistname');
                setPlaylists(response.data || []);
            } catch (error) {
                console.error('Error fetching playlists:', error);
            }
        }

        fetchPlaylists();
    }, []);

    useEffect(() => {
        async function fetchSongs() {
            try {
                const response = await axios.get('/api/songs');
                setAllSongs(response.data.songsList || []);
            } catch (error) {
                console.error('Error fetching songs:', error);
            }
        }

        fetchSongs();
    }, []);

    useEffect(() => {
        setFilteredSongs(selectedPlaylist ? allSongs.filter(song => song.playlist === selectedPlaylist) : allSongs);
    }, [selectedPlaylist, allSongs]);

    const truncateText = (text, maxLength) => {
        if (text && text.length > maxLength) {
            return text.substring(0, maxLength - 3) + '...';
        }
        return text;
    };

    const handleSongClick = async (song) => {
        console.log('Selected song sent to player:', song);
        try {
            await axios.post('/api/Writeplaying', { songs: filteredSongs });
            console.log('Playlist sent to playing API');
            setSelectedSong(song);
            handleSongSelect(song);
            onSongSelect(song);
        } catch (error) {
            console.error('Error sending playlist to playing API:', error);
        }
    };

    return (
        <div>
            <div style={{ background: 'linear-gradient(180deg, #E8911C, rgb(24, 24, 24))' }} className="playlist-title flex">
                
                <div className="mx-10 py-9 font-bold-10">Playlists</div>

            </div>
            <div style={{ backgroundColor: '#171717', display: 'flex', flexWrap: 'wrap' }}>
                <div className='mx-4 flex'>
                    <div
                        key="todos"
                        className={`mb-4 rounded-md mx-2 mt-2 mb-2 hover:cursor-pointer ${selectedPlaylist === null ? 'selected-genre' : ''}`}
                        onClick={() => setSelectedPlaylist(null)}
                    >
                        <div className="categories-box rounded-md" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <span className="text-white font-bold">Todos</span>
                        </div>
                    </div>
                    {playlists.map((playlist, index) => (
                        <div
                            key={index}
                            className={`mb-4 rounded-md mx-2 mt-2 mb-2 hover:cursor-pointer ${selectedPlaylist === playlist.playlist ? 'selected-genre' : ''}`}
                            style={{ backgroundColor: playlist.color }}
                            onClick={() => setSelectedPlaylist(playlist.playlist)}
                        >
                            <div className="categories-box rounded-md" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <span className="text-white font-bold">
                                    {playlist.playlist.length > 15 ? `${playlist.playlist.substring(0, 10)}...` : playlist.playlist}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div style={{ backgroundColor: '#171717', display: 'none' }} className="">
                <h1 className="font-bold mx-3 ">{selectedPlaylist || 'Todos'}</h1>
            </div>
            <div className="playlist-container" style={{ backgroundColor: '#171717' }}>
                <div className="playlist-header">
                    <div className="header-item song-number">#</div>
                    <div style={{ marginLeft: '-2px' }} className="header-item song-thumbnail">Vídeo</div>
                    <div style={{ marginLeft: '-2px' }} className="header-item song-title-header">Título</div>
                    <div className="header-item song-artist">Nome do Artista</div>
                    <div style={{ marginLeft: '-6px' }} className="header-item song-playlist">Playlist</div>
                    <div className="header-item song-duration ">Duração</div>
                </div>
                {filteredSongs.length > 0 ? (
                    filteredSongs.map((song, index) => (
                        <div
                            key={index}
                            className={`song-item ${selectedSong === song ? 'selected' : ''}`}
                            onClick={() => handleSongClick(song)}
                        >
                            <div className="song-number mr-3">{index + 1}</div>

                            <div className="song-thumbnail w-24 h-12 rounded-lg overflow-hidden flex justify-center items-end">
                                <img
                                    src={song.thumbnail}
                                    className="mx-3 w-24 h-24 object-cover transform translate-y-1/4"
                                    alt="Cover"
                                />
                            </div>

                            <div className="song-title font-bold">{truncateText(song.name, 35)}</div>
                            <div className="song-artist">{truncateText(song.artist, 15)}</div>
                            <div className="song-playlist">{truncateText(song.playlist, 15)}</div>
                            <div className="song-duration">{song.duration}</div>
                        </div>
                    ))
                ) : (
                    <div>Nenhuma música encontrada nessa playlist 😞 ...</div>
                )}
            </div>
        </div>
    );
}

export default PlaylistPage;
