import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const MAX_CONCURRENT_PAGES = 5; 
const NAVIGATION_TIMEOUT = 1200000; 

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
        const pages = []; // Array para armazenar as páginas abertas

        // Função para abrir uma nova página e processar uma música
        const openPageAndProcess = async (song) => {
            const page = await browser.newPage();
            pages.push(page); // Adiciona a página ao array
        
            const searchUrl = song.youtubeLink;
            
            try {
                await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: NAVIGATION_TIMEOUT });
        
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
                    artist: channelName, // Usa o nome do canal como o artista
                    duration: duration, // Adiciona a duração obtida
                    genre: '',
                    extractedAt: new Date().toISOString(),
                    playlist: '',
                };
        
                youtubeLinks.push(videoData);
            } catch (error) {
                console.error('Error processing', searchUrl, ':', error);
            } finally {
                await page.close(); // Fecha a página após o processamento
                const index = pages.indexOf(page);
                if (index !== -1) {
                    pages.splice(index, 1); // Remove a página do array
                }
            }
        };
        
        

        // Processa as músicas limitando o número de páginas abertas
        await Promise.all(songsData.map(async (song) => {
            while (pages.length >= MAX_CONCURRENT_PAGES) {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Aguarda um segundo
            }
            await openPageAndProcess(song);
        }));

        await browser.close();

        const outputFilePath = path.join(process.cwd(), 'public', 'songs', 'addsongs.json');
        fs.writeFileSync(outputFilePath, JSON.stringify(youtubeLinks, null, 2));

        console.log('YouTube links extracted and saved successfully.');

        res.status(200).json({ message: 'YouTube links extracted and saved successfully.', data: youtubeLinks });

    } catch (error) {
        console.error('Error while extracting YouTube links:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
}
