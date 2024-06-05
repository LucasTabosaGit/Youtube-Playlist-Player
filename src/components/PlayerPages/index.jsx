"Use client";
import React, { useState } from 'react';
import AudioPlayer from '../Player/index2';
import Playlist from '../Playlist';
import Scrapper from '../Scrapper';

const PlayerPage = () => {
  const [selectedSong, setSelectedSong] = useState(null);

  const handleSongSelect = (song) => {
    setSelectedSong(song);
  };

  return (
    <div>
      {/* <Scrapper/> */}
      <Playlist onSongSelect={handleSongSelect} />
      <AudioPlayer selectedSong={selectedSong} />
    </div>
  );
};

export default PlayerPage;
