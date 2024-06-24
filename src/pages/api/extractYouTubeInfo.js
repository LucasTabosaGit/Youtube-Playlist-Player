import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const MAX_CONCURRENT_PAGES = 10; // Define o número máximo de abas que serão abertas simultaneamente

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed', message: 'Only GET requests are allowed' });
    }

    try {
        const playlistId = req.query.playlistId; // Assuming you pass playlistId as a query parameter

        // Read the existing searchyoutube.json file
        const songsFilePath = path.join(process.cwd(), 'public', 'songs', 'searchyoutube.json');
        const songsData = JSON.parse(fs.readFileSync(songsFilePath, 'utf-8'));

        const youtubeLinks = [];
        const browser = await puppeteer.launch({ headless: true });

        const outputFilePath = path.join(process.cwd(), 'public', 'songs', 'addsongs.json');

        // Função para abrir uma nova página e processar uma música
        const openPageAndProcess = async (song) => {
            const page = await browser.newPage();
            const searchUrl = song.youtubeLink;
            
            try {
                await page.goto(searchUrl, { waitUntil: 'networkidle2' });
        
                await page.waitForSelector('ytd-video-renderer #video-title');
                const videoLink = await page.$eval('ytd-video-renderer #video-title', element => element.href.split('&')[0]);
                const videoId = new URL(videoLink).searchParams.get('v');
                const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        
                const channelNameSelector = 'yt-formatted-string.ytd-channel-name a';
                await page.waitForSelector(channelNameSelector);
                const channelName = await page.$eval(channelNameSelector, element => element.textContent.trim());
        
                const durationSelector = 'ytd-video-renderer #text.style-scope.ytd-thumbnail-overlay-time-status-renderer';
                await page.waitForSelector(durationSelector);
                const duration = await page.$eval(durationSelector, element => element.textContent.trim());
        
                const videoData = {
                    name: song.title,
                    link: videoLink,
                    thumbnail: thumbnail,
                    artist: channelName,
                    duration: duration, 
                    genre: '',
                    extractedAt: new Date().toISOString(),
                    playlist: '',
                };
        
                youtubeLinks.push(videoData);
                
                fs.writeFileSync(outputFilePath, JSON.stringify(youtubeLinks, null, 2));
            } catch (error) {
                console.error('Error processing', searchUrl, ':', error);
            } finally {
                await page.close();
            }
        };

        for (let i = 0; i < songsData.length; i += MAX_CONCURRENT_PAGES) {
            const songBatch = songsData.slice(i, i + MAX_CONCURRENT_PAGES);
            await Promise.all(songBatch.map(song => openPageAndProcess(song)));
        }

        await browser.close();

        console.log('Todas as músicas foram adicionadas a lista.');

        res.status(200).json({ message: 'Todas as músicas foram adicionadas.', data: youtubeLinks });

    } catch (error) {
        console.error('Error while extracting YouTube links:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
}
