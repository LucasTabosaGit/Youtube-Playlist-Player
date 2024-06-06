"use client";
import React, { useState } from 'react';
import Template from '../Template';
import Playlist from '../Playlist';
import { useMusicContext } from '../context';
import AudioPlayer from '../Player/index2';

const HomePage = () => {
  const { handleSongSelect } = useMusicContext();
  const [content, setContent] = useState('playlist'); 

  const handleMenuClick = (contentType) => {
    setContent(contentType);
  };

  const renderContent = () => {
    switch (content) {
      case 'playlist':
        return <Playlist onSongSelect={handleSongSelect} />;
      case 'favorites':
        return <>Favoritos</>;
      default:
        return null;
    }
  };

  return (
    <>
      <Template>
        {renderContent()}
        <div>
          <button onClick={() => handleMenuClick('playlist')}>Playlist</button>
          <button onClick={() => handleMenuClick('favorites')}>Favoritos</button>
        </div>
      </Template>
    </>
  );
};

export default HomePage;
