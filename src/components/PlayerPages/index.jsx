/* "Use client";
import React, { useState } from 'react';
import AudioPlayer from '../Player/index2';
import Playlist from '../Playlist';
import Scrapper from '../Scrapper';
import MenuLateral from '../Menu/MenuLateral';
import Header from '../Menu/Header';

const PlayerPage = () => {
  const [selectedSong, setSelectedSong] = useState(null);

  const handleSongSelect = (song) => {
    setSelectedSong(song);
  };

  return (
    <>
      <Scrapper />
      <Header />

      <div className='flex'>
        <MenuLateral />
        < Playlist onSongSelect={handleSongSelect} />
      </div>

      <AudioPlayer selectedSong={selectedSong} />
    </>
  );
};

export default PlayerPage;
 */