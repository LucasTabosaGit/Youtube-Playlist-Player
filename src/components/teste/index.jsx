import React, { useState } from 'react';
import Template from '../Template';
import Playlist from '../AllSongsPage';
import { useMusicContext } from '../context';

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
          <div className='mx-3'>
            <button onClick={() => handleMenuClick('favorites')}></button>
          </div>
        </div>
      </Template >
    </>
  );
};

export default HomePage;
