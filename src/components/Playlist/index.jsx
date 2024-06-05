
import React, { useState, useEffect } from "react";
import axios from "axios";


const Playlist = () => {
    const [songs, setSongs] = useState([]);

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

    return (
        <div>
            <div className="playlist-title">
                <div className="playlist-title mx-10 ">Minha Playlist</div>

            </div>
            <div className="playlist-container">
                <div className="playlist">
                    <div className="playlist-header">
                        <div className="header-item">#</div>
                        <div className="header-item">Title</div>
                        <div className="header-item">Artist</div>
                        <div className="header-item">Duration</div>
                    </div>
                    <div className="playlist">
                        {songs.length > 0 ? (
                            songs.map((song, index) => (
                                <div key={index} className="song-item">

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

            </div>

        </div>
    );
};

export default Playlist;