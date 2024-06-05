// Playlist.js

import React, { useState, useEffect } from "react";
import axios from "axios";

const Playlist = ({ onSongSelect }) => {
    const [songs, setSongs] = useState([]);
    const [selectedSong, setSelectedSong] = useState(null);

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/songs');
                setSongs(response.data.songsList || []);
            } catch (error) {
                console.error('Error fetching songs:', error);
            }
        };

        fetchSongs();
    }, []);

    const truncateText = (text, maxLength) => {
        if (text && text.length > maxLength) {
            return text.substring(0, maxLength - 3) + '...';
        }
        return text;
    };

    const handleSongClick = async (song) => {
        try {
            await axios.post('/api/playing', song);
            console.log('Song sent to playing API:', song);
            setSelectedSong(song); // Atualiza a música selecionada no estado
            onSongSelect(); // Chama a função fetchSongs passada como propriedade
        } catch (error) {
            console.error('Error sending song to playing API:', error);
        }
    };

    return (
        <div>
            <div className="playlist-title">
                <div className="playlist-title mx-10 ">Minha Playlist</div>
            </div>
            <div className="playlist">
                {songs.length > 0 ? (
                    songs.map((song, index) => (
                        <div key={index} className={`song-item ${selectedSong === song ? 'selected' : ''}`} onClick={() => handleSongClick(song)}>
                            <div className="song-number  mr-3">{index + 1}</div>
                            <div style={{
                                width: '100px',
                                height: '50px',
                                borderRadius: '5px',
                                overflow: 'hidden',
                                position: 'relative',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'flex-end'
                            }}>
                                <img
                                    src={song.thumbnail}
                                    className="hover:cursor-pointer mx-2"
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        objectFit: 'cover',
                                        transform: 'translateY(25%)'
                                    }}
                                    alt="Cover"
                                />
                            </div>
                            <div className="song-title font-bold">{truncateText(song.name, 35)}</div>
                            <div className="song-artist">{truncateText(song.artist, 15)}</div>
                            <div className="song-duration">{song.duration}</div>
                        </div>
                    ))
                ) : (
                    <div>No songs available</div>
                )}
            </div>
        </div>
            
    );
};

export default Playlist;
