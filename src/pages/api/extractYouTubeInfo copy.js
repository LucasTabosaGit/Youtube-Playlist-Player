// pages/api/extractYouTubeInfo.js

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

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

        const browser = await puppeteer.launch({ headless: true }); // Launch Puppeteer in headless mode
        const page = await browser.newPage();

        for (const song of songsData) {
            const searchUrl = song.youtubeLink;

            await page.goto(searchUrl, { waitUntil: 'networkidle2' });

            await page.waitForSelector('div#contents ytd-video-renderer');

            const videoLink = await page.$eval('div#contents ytd-video-renderer #video-title', element => element.href);
            const videoId = new URL(videoLink).searchParams.get('v');
            const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

            const videoData = {
                title: song.title,
                link: videoLink,
                thumbnail: thumbnail,
                artist: song.artists, 
                duration: 'Unknown', 
                genre: '', 
                extractedAt: new Date().toISOString(),
                playlist: '',
            };

            youtubeLinks.push(videoData);
        }

        await browser.close();

        const outputFilePath = path.join(process.cwd(), 'public', 'songs', 'extractedyoutube.json');
        fs.writeFileSync(outputFilePath, JSON.stringify(youtubeLinks, null, 2));

        console.log('YouTube links extracted and saved successfully.');

        res.status(200).json({ message: 'YouTube links extracted and saved successfully.', data: youtubeLinks });

    } catch (error) {
        console.error('Error while extracting YouTube links:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
}
