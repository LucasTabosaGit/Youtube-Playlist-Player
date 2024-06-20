// pages/index.js
"use client";
import { useState } from 'react';

const IndexPage = () => {
    const [link, setLink] = useState('');

    const handleSubmit = async () => {
        try {
            // Primeira API: scrapePlaylistSpotify
            const playlistData = await fetch(`/api/scrapePlaylistSpotify?link=${encodeURIComponent(link)}`);
            const playlistJson = await playlistData.json();
            console.log('Dados da playlist do Spotify:', playlistJson);

            // Segunda API: extractYouTubeInfo
            const youtubeData = await fetch(`/api/extractYouTubeInfo?playlistId=${playlistJson.playlistId}`);
            const youtubeJson = await youtubeData.json();
            console.log('Informações do YouTube:', youtubeJson);

            // Terceira API: scrapeArray
            const scrapedData = await fetch(`/api/scrapeArray`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(youtubeJson),
            });
            const scrapedJson = await scrapedData.json();
            console.log('Dados raspados:', scrapedJson);

            // Aqui você pode fazer algo com scrapedJson se necessário
        } catch (error) {
            console.error('Erro ao chamar APIs:', error);
        }
    };

    const handleChange = (event) => {
        setLink(event.target.value);
    };

    return (
        <div>
            <h1>Integração de APIs</h1>
            <input
                type="text"
                value={link}
                onChange={handleChange}
                placeholder="Insira o link..."
            />
            <button onClick={handleSubmit}>Executar APIs</button>
        </div>
    );
};

export default IndexPage;
