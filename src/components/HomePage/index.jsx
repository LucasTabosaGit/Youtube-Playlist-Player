import React, { useState } from 'react';
import Template from '../Template';
import { useMusicContext } from '../context';
import AddSongsPage from '../AddSongsPage';
import AllSongsPage from '../AllSongsPage';
import PlaylistPage from '../PlaylistsPage';

const HomePage = () => {
    const { handleSongSelect } = useMusicContext();
    const [content, setContent] = useState('playlist');

    return (
        <Template content={content} setContent={setContent}>
            {content === 'inicio' && <AllSongsPage onSongSelect={handleSongSelect} />}
            {content === 'playlist' && <PlaylistPage onSongSelect={handleSongSelect} />}
            {content === 'adicionar' && <AddSongsPage onSongSelect={handleSongSelect} />}
        </Template>
    );
};

export default HomePage;
