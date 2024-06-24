import React, { useState, useEffect } from "react";
import axios from "axios";
import { useMusicContext } from "../context";
import AddSongsButton from "./buttonAddSongs";

const Playlist = ({ onSongSelect }) => {
    const [songs, setSongs] = useState([]);
    const { handleSongSelect } = useMusicContext();

    const [selectedSong, setSelectedSong] = useState(null);

    const fetchSongs = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/addsongs');
            setSongs(response.data.songsList || []);
        } catch (error) {
            console.error('Error fetching songs:', error);
        }
    };

    useEffect(() => {
        fetchSongs();
    }, []);

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

    return (
        <>
            <div style={{
                background: 'linear-gradient(180deg, #2C6BB3, rgb(24, 24, 24))'
            }} className="playlist-title">
                <div className="mx-10 py-9 font-bold-10">Adicione Músicas</div>
            </div>

            <AddSongsButton songs={songs} fetchSongs={fetchSongs} />

            <div className="playlist-container" style={{ backgroundColor: '#171717' }}>

                <div className="playlist-header">
                    <div className="header-item song-number">#</div>
                    <div style={{ marginLeft: '-2px' }} className="header-item song-thumbnail">Vídeo</div>
                    <div style={{ marginLeft: '-2px' }} className="header-item song-title-header">Título</div>
                    <div className="header-item song-artist">Nome do Artista</div>
                    <div style={{ marginLeft: '-6px' }} className="header-item song-playlist"></div>
                    <div className="header-item song-duration ">Duração</div>
                </div>

                {songs.length > 0 ? (
                    songs.map((song, index) => (
                        <div key={index} className={`song-item ${selectedSong === song ? 'selected' : ''}`} onClick={() => handleSongClick(song)}>
                            <div className="song-number mr-3">{index + 1}</div>
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
                                    className="hover:cursor-pointer mx-3"
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
                            <div className="song-playlist">{truncateText(song.playlist, 15)}</div>
                            <div className="song-duration">{song.duration}</div>
                        </div>
                    ))
                ) : (
                    <div></div>
                )}
            </div>
        </>
    );
};

export default Playlist;
