"use client";
import { useState } from 'react';
import Head from 'next/head';

const Teste = () => {
    const [playlistUrl, setPlaylistUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [songDetails, setSongDetails] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');

        try {
            const response = await fetch('/api/scrapePlaylistSpotify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ playlistUrl }),
            });

            if (response.ok) {
                const data = await response.json();
                setSongDetails(data.songs || []);
            } else {
                throw new Error('Erro ao enviar o link da playlist');
            }
        } catch (error) {
            console.error('Erro:', error.message);
            setErrorMessage('Falha ao enviar o link da playlist');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <Head>
                <title>Scrape de Playlist do Spotify</title>
                <meta name="description" content="Scrape de Playlist do Spotify usando Next.js e Puppeteer" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <h1>Scrape de Playlist do Spotify</h1>

                <form onSubmit={handleSubmit}>
                    <label>
                        Insira o link da playlist do Spotify:
                        <input
                            type="text"
                            value={playlistUrl}
                            onChange={(e) => setPlaylistUrl(e.target.value)}
                            required
                        />
                    </label>
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Enviando...' : 'Enviar'}
                    </button>
                </form>

                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

                {songDetails.length > 0 && (
                    <div>
                        <h2>Detalhes das Músicas</h2>
                        <ul>
                            {songDetails.map((song, index) => (
                                <li key={index}>
                                    <strong>Título:</strong> {song.title}, <strong>Artista:</strong> {song.artists}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </main>

            <footer>
                {/* Rodapé */}
            </footer>
        </div>
    );
};

export default Teste;