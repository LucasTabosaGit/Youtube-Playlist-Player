import React, { useState } from 'react';
import Template from '../Template';
import { useMusicContext } from '../context';
import AddSongsPage from '../AddSongsPage';
import AllSongsPage from '../AllSongsPage';
import PlaylistPage from '../PlaylistsPage';

const CONTENT_OPTIONS = {
    INICIO: 'inicio',
    PLAYLIST: 'playlist',
    ADICIONAR: 'adicionar'
};

const HomePage = () => {
    const { handleSongSelect } = useMusicContext();
    const [history, setHistory] = useState([CONTENT_OPTIONS.PLAYLIST]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const setContent = (newContent) => {
        const newHistory = [...history.slice(0, currentIndex + 1), newContent];
        setHistory(newHistory);
        setCurrentIndex(newHistory.length - 1);
    };

    const goBack = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const goForward = () => {
        if (currentIndex < history.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const currentContent = history[currentIndex];

    return (
        <Template
            content={currentContent}
            setContent={setContent}
            goBack={goBack}
            goForward={goForward}
            canGoBack={currentIndex > 0}
            canGoForward={currentIndex < history.length - 1}
        >
            {currentContent === CONTENT_OPTIONS.INICIO && (
                <AllSongsPage onSongSelect={handleSongSelect} />
            )}
            {currentContent === CONTENT_OPTIONS.PLAYLIST && (
                <PlaylistPage onSongSelect={handleSongSelect} />
            )}
            {currentContent === CONTENT_OPTIONS.ADICIONAR && (
                <AddSongsPage onSongSelect={handleSongSelect} />
            )}
        </Template>
    );
};

export default HomePage;
