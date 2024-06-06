import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  const playlistUrl = new URL(url);
  const listId = playlistUrl.searchParams.get('list');
  const filteredUrl = `https://www.youtube.com/playlist?list=${listId}`;

  let browser;
  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(filteredUrl, { waitUntil: 'networkidle2' });

    // Extraindo links dos vídeos da playlist
    const videoDetails = await page.evaluate(() => {
      const videoElements = Array.from(document.querySelectorAll('ytd-playlist-video-renderer'));
      const extractedAt = new Date().toISOString(); // Adicionando a data de extração
      return videoElements.map(video => {
        const titleElement = video.querySelector('#video-title');
        const link = titleElement.href;
        const name = titleElement.textContent.trim();
        const videoId = new URL(link).searchParams.get('v');
        const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        const artist = video.querySelector('#text a').textContent.trim();
        const durationElement = video.querySelector('#overlays > ytd-thumbnail-overlay-time-status-renderer > div > badge-shape > div');
        const duration = durationElement ? durationElement.textContent.trim() : 'Unknown';

        return { name, link, thumbnail, artist, duration, extractedAt }; // Adicionando extractedAt ao objeto
      });
    });

    const publicDirectory = path.join(process.cwd(), 'public', 'songs');
    if (!fs.existsSync(publicDirectory)) {
      fs.mkdirSync(publicDirectory, { recursive: true });
    }

    fs.writeFileSync(path.join(publicDirectory, 'links.json'), JSON.stringify(videoDetails, null, 2));

    await browser.close();

    res.status(200).json({ message: 'Links extracted and saved successfully', videos: videoDetails });
  } catch (error) {
    if (browser) {
      await browser.close();
    }
    res.status(500).json({ error: 'Failed to scrape the playlist', details: error.message });
  }
}
