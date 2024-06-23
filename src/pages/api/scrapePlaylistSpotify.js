import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    if (req.method !== 'GET' && req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    let playlistUrl = req.body.playlistUrl || req.query.link;

    if (!playlistUrl && req.method === 'GET') {
        playlistUrl = req.query.link;
    }

    if (!playlistUrl) {
        return res.status(400).json({ error: 'Playlist URL is required' });
    }

    let browser;
    try {
        browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.setViewport({ width: 800, height: 30000 });

        await page.goto(playlistUrl, { waitUntil: 'networkidle2' });

        await page.waitForSelector('.encore-text.encore-text-body-medium.encore-internal-color-text-base.btE2c3IKaOXZ4VNAb8WQ.standalone-ellipsis-one-line');

        const songDetails = await page.evaluate(() => {
            const songs = [];
            const songElements = document.querySelectorAll('.encore-text.encore-text-body-medium.encore-internal-color-text-base.btE2c3IKaOXZ4VNAb8WQ.standalone-ellipsis-one-line');

            songElements.forEach(songElement => {
                const title = songElement.textContent.trim();
                let artists = '';

                if (songElement.nextElementSibling && songElement.nextElementSibling.tagName === 'SPAN') {
                    const artistLinks = songElement.nextElementSibling.querySelectorAll('a');
                    artists = Array.from(artistLinks).map(link => link.textContent.trim()).join(', ');
                } else if (songElement.nextElementSibling && songElement.nextElementSibling.tagName === 'A') {
                    artists = songElement.nextElementSibling.textContent.trim();
                }

                const query = `${title} ${artists} música`.replace(/\s+/g, '+');
                const youtubeLink = `https://www.youtube.com/results?search_query=${query}`;


                songs.push({ title, artists, youtubeLink });
            });

            return songs;
        });

        if (songDetails.length === 0) {
            throw new Error('No songs found on the playlist page. The structure of the page might have changed.');
        }

        const publicDirectory = path.join(process.cwd(), 'public', 'songs');
        const filePath = path.join(publicDirectory, 'searchyoutube.json');

        if (!fs.existsSync(publicDirectory)) {
            fs.mkdirSync(publicDirectory, { recursive: true });
        }

        // Escrever no arquivo JSON com feedback no console
        console.log(`Foram encontradas ${songDetails.length} músicas na playlist`);
        fs.writeFileSync(filePath, JSON.stringify(songDetails, null, 2));

        await browser.close();

        const totalSongs = songDetails.length;
        res.status(200).json({
            message: 'Playlist information extracted and saved successfully',
            totalSongs: totalSongs,
            songs: songDetails
        });

    } catch (error) {
        if (browser) {
            await browser.close();
        }
        console.error('Error scraping Spotify playlist:', error.message);
        res.status(500).json({ error: 'Failed to scrape Spotify playlist', details: error.message });
    }
}
