"use client";
import React, { useState } from 'react';
import Template from '../Template';
import Playlist from '../Playlist';
import { useMusicContext } from '../context';
import ListPage from '../ListPage';
import AddSongsPage from '../AddSongsPage';

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
        return <><ListPage onSongSelect={handleSongSelect} /></>;
      case 'adicionar':
        return <><AddSongsPage onSongSelect={handleSongSelect} /></>;
      default:
        return null;
    }
  };

  return (
    <>
      <Template>

        <div>
          <button onClick={() => handleMenuClick('playlist')}>Playlist</button>
          <button className='mx-3' onClick={() => handleMenuClick('favorites')}>Gêneros</button>
          <button className='mx-3' onClick={() => handleMenuClick('adicionar')}>Adicionar Músicas</button>
        </div>
        {renderContent()}
      </Template>
    </>
  );
};

export default HomePage;
