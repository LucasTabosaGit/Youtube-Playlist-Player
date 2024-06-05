"Use client";
import React, { useState } from 'react';
import AudioPlayer from '../Player/index2';
import Playlist from '../Playlist';

const PlayerPage = () => {
  const [selectedSong, setSelectedSong] = useState(null);

  const handleSongSelect = (song) => {
    setSelectedSong(song);
  };

  return (
    <div>
      <Playlist onSongSelect={handleSongSelect} />
      <AudioPlayer selectedSong={selectedSong} />
    </div>
  );
};

export default PlayerPage;
