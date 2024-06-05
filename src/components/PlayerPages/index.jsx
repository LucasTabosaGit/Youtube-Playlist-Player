import AudioPlayer from '../Player/index2';
import { useState } from 'react';
import Playlist from '../Playlist';
const PlayerPage = ({ songs }) => {


  return (
    <div>
      <AudioPlayer songs={songs} />
      <Playlist  />
    </div>
  );
};

export default PlayerPage;
