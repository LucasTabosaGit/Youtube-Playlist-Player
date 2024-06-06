"use client";
import React, { createContext, useContext, useState } from 'react';

// Create the MusicContext
const MusicContext = createContext();

// Create a provider component
export const MusicProvider = ({ children }) => {
  const [selectedSong, setSelectedSong] = useState(null);

  // Method to update the selected song
  const handleSongSelect = (song) => {
    setSelectedSong(song);
  };

  return (
    <MusicContext.Provider value={{ selectedSong, handleSongSelect }}>
      {children}
    </MusicContext.Provider>
  );
};

// Custom hook to use the MusicContext
export const useMusicContext = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusicContext must be used within a MusicProvider');
  }
  return context;
};
