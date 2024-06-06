/* "use client";
import React, { useState } from 'react';
import AudioPlayer from '../Player/index2';
import Playlist from '../Playlist';
import Template from '../Template';

const PlayListRealPage = () => {
  const [selectedSong, setSelectedSong] = useState(null);

  const handleSongSelect = (song) => {
    setSelectedSong(song);
  };

  return (
    <>
      <Template>
        <Playlist onSongSelect={handleSongSelect} />
      </Template>
        <AudioPlayer selectedSong={selectedSong} />

    </>
  );
};

export default PlayListRealPage; */



/* import React, { useState } from 'react';

function Teste() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div>
            <h1>Home Page</h1>
            <button onClick={() => setCurrentPage('about')}>About</button>
            <button onClick={() => setCurrentPage('contact')}>Contact</button>
          </div>
        );
      case 'about':
        return (
          <div>
            <h1>About Page</h1>
            <button onClick={() => setCurrentPage('home')}>Home</button>
            <button onClick={() => setCurrentPage('contact')}>Contact</button>
          </div>
        );
      case 'contact':
        return (
          <div>
            <h1>Contact Page</h1>
            <button onClick={() => setCurrentPage('home')}>Home</button>
            <button onClick={() => setCurrentPage('about')}>About</button>
          </div>
        );
      default:
        return (
          <div>
            <h1>Page Not Found</h1>
            <button onClick={() => setCurrentPage('home')}>Home</button>
          </div>
        );
    }
  };

  return (
    <div>
      <header>
        <nav>
          <button onClick={() => setCurrentPage('home')}>Home</button>
          <button onClick={() => setCurrentPage('about')}>About</button>
          <button onClick={() => setCurrentPage('contact')}>Contact</button>
        </nav>
      </header>
      <main>{renderPage()}</main>
    </div>
  );
}

export default Teste;
 */