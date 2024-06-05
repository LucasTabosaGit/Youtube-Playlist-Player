import React, { useState, useEffect } from "react";
import axios from "axios";
import MenuLateral from "../Menu/MenuLateral";

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
            await axios.post('/api/Writeplaying', { songs: songs });
            console.log('Playlist sent to playing API');
            setSelectedSong(song); // Atualiza a música selecionada no estado
            onSongSelect(song); // Chama a função onSongSelect passada como propriedade com a música selecionada
        } catch (error) {
            console.error('Error sending playlist to playing API:', error);
        }
    };

    return (
        
        <div style={{
            maxHeight: '78.5vh',
            overflowY: 'auto',
            width: '100%',
            marginTop: '5px',
            marginLeft: '5px',
            borderBottomLeftRadius: '10px',
            borderBottomRightRadius: '10px'
        }}>
            <div className="playlist-title">
                <div className="mx-10 py-9 font-bold-10">Minha Playlist</div>
            </div>
            <div className="playlist-container" style={{ backgroundColor: '#171717' }}>
                <div className="playlist-header">
                    <div className="header-item song-number">#</div>
                    <div className="header-item song-thumbnail">Título</div>
                    <div className="header-item song-title"></div>
                    <div style={{ marginLeft: '20px'}}className="header-item song-artist">Nome do Artista</div>
                    <div style={{ marginRight: '10px'}} className="header-item song-duration ">Duração</div>
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
                            <div className="song-duration">{song.duration}</div>
                        </div>
                    ))
                ) : (
                    <div>Carregando...</div>
                )}
            </div>


        </div>
    );
};

export default Playlist;
