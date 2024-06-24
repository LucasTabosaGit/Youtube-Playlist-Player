import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { url, playlist } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    let browser;
    try {
        // Lança o navegador Puppeteer
        browser = await puppeteer.launch();

        // Cria uma nova página
        const page = await browser.newPage();

        // Carrega a URL da playlist do YouTube
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Verifica se a URL é uma playlist válida do YouTube
        const isPlaylist = await page.evaluate(() => {
            return document.querySelector('ytd-playlist-video-renderer') !== null;
        });

        if (!isPlaylist) {
            throw new Error('Invalid YouTube playlist URL');
        }

        // Extrai detalhes dos vídeos da playlist
        const videoDetails = await page.evaluate(() => {
            const videoElements = Array.from(document.querySelectorAll('ytd-playlist-video-renderer'));
            const extractedAt = new Date().toISOString();
            return videoElements.map(video => {
                const titleElement = video.querySelector('#video-title');
                const link = titleElement.href;
                const name = titleElement.textContent.trim();
                const videoId = new URL(link).searchParams.get('v');
                const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                const artistElement = video.querySelector('#text a');
                const artist = artistElement ? artistElement.textContent.trim() : 'Unknown';
                const durationElement = video.querySelector('#overlays > ytd-thumbnail-overlay-time-status-renderer > div > badge-shape > div');
                const duration = durationElement ? durationElement.textContent.trim() : 'Unknown';
                const genre = ''; // Adicione lógica para obter gênero, se necessário
                const playlist = '';

                return { name, link, thumbnail, artist, duration, genre, extractedAt, playlist };
            });
        });

        // Diretório público onde será salvo o arquivo JSON
        const publicDirectory = path.join(process.cwd(), 'public', 'songs');
        if (!fs.existsSync(publicDirectory)) {
            fs.mkdirSync(publicDirectory, { recursive: true });
        }

        // Salva os detalhes dos vídeos em um arquivo JSON
        fs.writeFileSync(path.join(publicDirectory, 'addsongs.json'), JSON.stringify(videoDetails, null, 2));

        // Fecha o navegador Puppeteer
        await browser.close();

        // Responde com sucesso e envia os detalhes dos vídeos extraídos
        res.status(200).json({ message: 'Links extracted and saved successfully', videos: videoDetails });
    } catch (error) {
        // Em caso de erro, fecha o navegador se estiver aberto
        if (browser) {
            await browser.close();
        }
        res.status(500).json({ error: 'Failed to scrape the playlist', details: error.message });
    }
}
