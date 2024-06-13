import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ButtonGenre from './buttonGenre';
import { useMusicContext } from '../context';

export default function ListPage() {
    const [generos, setGeneros] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(null); // Estado para armazenar o gênero selecionado
    const [allSongs, setAllSongs] = useState([]);
    const [filteredSongs, setFilteredSongs] = useState([]);
    const [selectedSong, setSelectedSong] = useState(null);

    const { handleSongSelect } = useMusicContext();

    useEffect(() => {
        async function fetchGenres() {
            try {
                const response = await axios.get('/api/genre');
                setGeneros(response.data || []);
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        }

        fetchGenres();
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
        setFilteredSongs(selectedGenre ? allSongs.filter(song => song.genre === selectedGenre) : allSongs);
    }, [selectedGenre, allSongs]);


    const truncateText = (text, maxLength) => {
        if (text && text.length > maxLength) {
            return text.substring(0, maxLength - 3) + '...';
        }
        return text;
    };

    const handleSongClick = async (song) => {
        console.log('Selected song:', song);
        try {
            await axios.post('/api/Writeplaying', { selectedSong: song });
            console.log('Selected song sent to playing API');
            setSelectedSong(song);
            handleSongSelect(song); // Calling the handleSongSelect function from the context
        } catch (error) {
            console.error('Error sending selected song to playing API:', error);
        }
    };

    return (
        <div>
            <div style={{
                    background: 'linear-gradient(180deg, #5C2D92, rgb(24, 24, 24))'
                }} className="playlist-title">
                <div className="mx-10 py-9 font-bold-10">Gêneros Musicais</div>
            </div>
            <div style={{ backgroundColor: '#171717', display: 'flex', flexWrap: 'wrap' }}>
                <div className='mx-4 flex'>
                <div key="todos" className={`mb-4 rounded-md mx-2 mt-2 mb-2 hover:cursor-pointer  ${selectedGenre === null ? 'selected-genre' : ''}`} style={{ backgroundColor: "#333" }} onClick={() => setSelectedGenre(null)}>
                    <div className="categories-box rounded-md" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <span className="text-white font-bold">Todos</span>
                    </div>
                </div>
                {generos.map((genero, index) => (
                    <div key={index} className={`mb-4 rounded-md mx-2 mt-2 mb-2 hover:cursor-pointer ${selectedGenre === genero.title ? 'selected-genre' : ''}`} style={{ backgroundColor: genero.color }} onClick={() => setSelectedGenre(genero.title)}>
                        <div className="categories-box rounded-md" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <span className="text-white font-bold">{genero.title}</span>
                        </div>
                    </div>
                ))}
                </div>
            </div>
            <ButtonGenre />
            <div style={{ backgroundColor: '#171717', display: 'none' }} className="">
                <h1 className="font-bold mx-3 ">{selectedGenre || 'Todos'}</h1>
            </div>
            <div className="playlist-container" style={{ backgroundColor: '#171717' }}>
                <div className="playlist-header">
                    <div className="header-item song-number">#</div>
                    <div className="header-item song-thumbnail">Título</div>
                    <div className="header-item song-title"></div>
                    <div style={{ marginLeft: '20px' }} className="header-item song-artist">Nome do Artista</div>
                    <div style={{ marginRight: '10px' }} className="header-item song-duration ">Duração</div>
                </div>
                {filteredSongs.length > 0 ? (
                    filteredSongs.map((song, index) => (
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
                    <div>Nenhuma música encontrada nesse gênero 😞 ...</div>
                )}
            </div>
        </div>
    );
}
