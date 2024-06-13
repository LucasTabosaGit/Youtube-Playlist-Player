import React, { useState, useEffect } from "react";
import axios from "axios";
import { useMusicContext } from "../context";

const Playlist = ({ onSongSelect }) => {
    const { handleSongSelect } = useMusicContext();
    const [songs, setSongs] = useState([]);
    const [filteredSongs, setFilteredSongs] = useState([]);
    const [selectedSong, setSelectedSong] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/songs');
                setSongs(response.data.songsList || []);
                setFilteredSongs(response.data.songsList || []);
            } catch (error) {
                console.error('Error fetching songs:', error);
            }
        };

        fetchSongs();
    }, []);

    useEffect(() => {
        setFilteredSongs(
            songs.filter(song =>
                song.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                song.artist.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, songs]);

    const truncateText = (text, maxLength) => {
        if (text && text.length > maxLength) {
            return text.substring(0, maxLength - 3) + '...';
        }
        return text;
    };

    const handleSongClick = async (song) => {
        console.log('Selected song sent to player:', song);
        try {
            await axios.post('/api/Writeplaying', { songs: songs });
            console.log('Playlist sent to playing API');
            setSelectedSong(song);
            handleSongSelect(song);
            onSongSelect(song);
        } catch (error) {
            console.error('Error sending playlist to playing API:', error);
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <>
            <div className="playlist-title">
                <div className="mx-10 py-9 font-bold-10">Todas Músicas</div>
            </div>

            <div className="search-bar-container" style={{ backgroundColor: '#171717' }}>
                <div className="relative ml-3">
                    <span className="absolute inset-y-0 left-3 flex items-center pl-3">
                        <i className="fas fa-search text-gray-300"></i>
                    </span>
                    <input
                        type="text"
                        placeholder="Pesquisar..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="pl-10 w-1/5 py-2 mx-3 px-3 text-white bg-gray-800 rounded"
                        style={{ backgroundColor: '#2b2b2b' }}
                    />
                </div>
            </div>


            <div className="playlist-container" style={{ backgroundColor: '#171717' }}>
                <div className="playlist-header">
                    <div className="header-item song-number">#</div>
                    <div style={{ marginLeft: '3px' }} className="header-item song-thumbnail">Vídeo</div>
                    <div style={{ marginLeft: '3px' }} className="header-item song-title-header">Título</div>
                    <div className="header-item song-artist">Nome do Artista</div>
                    <div className="header-item song-playlist">Playlist</div>
                    <div className="header-item song-duration ">Duração</div>
                </div>

                {searchTerm === "" ? (
                    songs.map((song, index) => (
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

                            <div onClick={() => handleSongClick(song)} className="song-title font-bold">{truncateText(song.name, 35)}</div>
                            <div onClick={() => handleSongClick(song)} className="song-artist">{truncateText(song.artist, 15)}</div>
                            <div className="song-playlist">{truncateText(song.playlist, 15)}</div>
                            <div onClick={() => handleSongClick(song)} className="song-duration">{song.duration}</div>
                        </div>
                    ))
                ) : (
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

                            <div onClick={() => handleSongClick(song)} className="song-title font-bold">{truncateText(song.name, 35)}</div>
                            <div onClick={() => handleSongClick(song)} className="song-artist">{truncateText(song.artist, 15)}</div>
                            <div className="song-playlist">{truncateText(song.playlist, 15)}</div>
                            <div onClick={() => handleSongClick(song)} className="song-duration">{song.duration}</div>
                        </div>
                    ))
                )}
            </div>
        </>
    );
};

export default Playlist;
