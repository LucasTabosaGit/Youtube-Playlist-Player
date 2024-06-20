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

        // Your existing extraction logic goes here
        const songsFilePath = path.join(process.cwd(), 'public', 'songs', 'searchyoutube.json');
        const songsData = JSON.parse(fs.readFileSync(songsFilePath, 'utf-8'));

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        const youtubeLinks = [];

        for (const song of songsData) {
            const query = `${song.title} ${song.artists}`.replace(/\s+/g, '+');
            const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

            await page.goto(searchUrl, { waitUntil: 'networkidle2' });

            await page.waitForSelector('div#contents ytd-video-renderer');

            const videoLink = await page.$eval('div#contents ytd-video-renderer #video-title', element => element.href);

            const videoData = {
                title: song.title,
                link: videoLink,
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
