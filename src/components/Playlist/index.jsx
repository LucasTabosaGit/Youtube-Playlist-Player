import React, { useState, useEffect } from "react";
import axios from "axios";
import MenuLateral from "../Menu/MenuLateral";
import { useMusicContext } from "../context";

const Playlist = ({ onSongSelect }) => {
    const [songs, setSongs] = useState([]);
    const { handleSongSelect } = useMusicContext();

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
            <div className="playlist-title">
                <div className="mx-10 py-9 font-bold-10">Todas Músicas</div>
            </div>
            <div className="playlist-container" style={{ backgroundColor: '#171717' }}>
                <div className="playlist-header">
                    <div className="header-item song-number">#</div>
                    <div style={{ marginLeft: '3px'}} className="header-item song-thumbnail">Vídeo</div>
                    <div style={{ marginLeft: '3px'}} className="header-item song-title-header">Título</div>
                    <div className="header-item song-artist">Nome do Artista</div>
                    <div className="header-item song-playlist">Playlist</div>
                    <div className="header-item song-duration ">Duração</div>
                </div>
                {songs.length > 0 ? (
                    songs.map((song, index) => (
                        <div key={index} className={`song-item ${selectedSong === song ? 'selected' : ''}`}>
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
                            <div  className="song-playlist">{truncateText(song.playlist, 15)}</div>
                            <div onClick={() => handleSongClick(song)} className="song-duration">{song.duration}</div>
                        </div>
                    ))
                ) : (
                    <div>Carregando...</div>
                )}
            </div>


        </>
    );
};

export default Playlist;
