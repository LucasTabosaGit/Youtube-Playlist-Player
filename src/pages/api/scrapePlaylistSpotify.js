// Importando as dependências necessárias
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

// Definindo o handler da rota API
export default async function handler(req, res) {
    // Verificando se o método HTTP é GET ou POST
    if (req.method !== 'GET' && req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Obtendo a URL da playlist do corpo da requisição ou dos parâmetros de consulta
    let playlistUrl = req.body.playlistUrl || req.query.link;

    // Para requisições GET, obtendo a URL da playlist dos parâmetros de consulta
    if (!playlistUrl && req.method === 'GET') {
        playlistUrl = req.query.link;
    }

    // Retornando um erro se a URL da playlist não for fornecida
    if (!playlistUrl) {
        return res.status(400).json({ error: 'Playlist URL is required' });
    }

    let browser;
    try {
        // Iniciando o navegador Puppeteer
        browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        // Indo para a página da playlist do Spotify
        await page.goto(playlistUrl, { waitUntil: 'networkidle2' });

        // Extraindo detalhes das músicas da página
        const songDetails = await page.evaluate(() => {
            const songs = [];
            const songElements = document.querySelectorAll('.encore-text.encore-text-body-medium.encore-internal-color-text-base.btE2c3IKaOXZ4VNAb8WQ.standalone-ellipsis-one-line');

            songElements.forEach(songElement => {
                const title = songElement.textContent.trim();

                // Procurando pelos artistas
                let artists = '';
                if (songElement.nextElementSibling.tagName === 'SPAN') {
                    const artistLinks = songElement.nextElementSibling.querySelectorAll('a');
                    artists = Array.from(artistLinks).map(link => link.textContent.trim()).join(', ');
                } else if (songElement.nextElementSibling.tagName === 'A') {
                    artists = songElement.nextElementSibling.textContent.trim();
                }

                // Montando o link do YouTube
                const query = `${title} ${artists}`.replace(/\s+/g, '+');
                const youtubeLink = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

                songs.push({ title, artists, youtubeLink });
            });

            return songs;
        });

        // Caminho para salvar o arquivo JSON
        const publicDirectory = path.join(process.cwd(), 'public', 'songs');
        const filePath = path.join(publicDirectory, 'searchyoutube.json');

        // Criando o diretório se não existir
        if (!fs.existsSync(publicDirectory)) {
            fs.mkdirSync(publicDirectory, { recursive: true });
        }

        // Salvando os detalhes das músicas em um arquivo JSON
        fs.writeFileSync(filePath, JSON.stringify(songDetails, null, 2));

        // Fechando o navegador Puppeteer
        await browser.close();

        // Enviando a resposta com sucesso e o número total de músicas capturadas
        const totalSongs = songDetails.length;
        res.status(200).json({
            message: 'Playlist information extracted and saved successfully',
            totalSongs: totalSongs,
            songs: songDetails
        });

    } catch (error) {
        // Lidando com erros
        if (browser) {
            await browser.close();
        }
        console.error('Error scraping Spotify playlist:', error.message);
        res.status(500).json({ error: 'Failed to scrape Spotify playlist', details: error.message });
    }
}
