
"use client";
import React, { useState } from 'react';
import AudioPlayer from '../Player/index2';
import Playlist from '../Playlist';
import MenuLateral from '../Menu/MenuLateral';
import Header from '../Menu/Header';

const Template = ({ children }) => {

    const [selectedSong, setSelectedSong] = useState(null);

    const handleSongSelect = (song) => {
        setSelectedSong(song);
    };

    return (
        <>
            <Header />
            <div className='flex'>
                <MenuLateral />
                <div
                    style={{
                        maxHeight: '78.5vh',
                        overflowY: 'auto',
                        width: '100%',
                        marginTop: '5px',
                        marginLeft: '5px',
                        borderBottomLeftRadius: '10px',
                        borderBottomRightRadius: '10px'
                        
                    }}
                >
                    {children}
                </div>
            </div>
            <AudioPlayer selectedSong={selectedSong} />

        </>

    );
};

export default Template;


