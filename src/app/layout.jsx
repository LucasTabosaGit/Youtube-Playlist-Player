// RootLayout.js
import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import AudioPlayer from '@/components/Player/index2';
import { MusicProvider } from '@/components/context';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Player Playlist',
  /* description: 'Generated by create next app', */
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
        />
      </head>
      <body className={inter.className}>
        <MusicProvider>
          {children}
        </MusicProvider>
      </body>
    </html>
  );
}
