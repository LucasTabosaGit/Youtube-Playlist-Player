import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  const { playlist } = req.body;

  if (!Array.isArray(playlist) || playlist.length === 0) {
    return res.status(400).json({ message: 'Playlist should be a non-empty array of URLs' });
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Array para armazenar os novos vídeos processados
    const processedVideos = [];

    // Iterar sobre cada URL na playlist
    for (let i = 0; i < playlist.length; i++) {
      const url = playlist[i];

      await page.goto(url, { waitUntil: 'networkidle2' });
      console.log(`Processing video ${i + 1} of ${playlist.length}, URL: ${url}`);

      // Extrair informações do vídeo
      const title = await page.$eval('#title > h1 > yt-formatted-string', (el) => el.textContent.trim());
      const channelName = await page.evaluate(() => {
        const channelElement = document.querySelector('#text > a.yt-simple-endpoint');
        return channelElement ? channelElement.textContent.trim() : null;
      });
      const duration = await page.$eval('span.ytp-time-duration', (el) => el.textContent.trim());

      if (!title || !channelName || !duration) {
        throw new Error(`Could not fetch video details for ${url}`);
      }

      const videoId = url.match(/(?<=v=)[^&]+/)[0];
      const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

      const newVideo = {
        name: title,
        link: `https://www.youtube.com/watch?v=${videoId}`,
        thumbnail: thumbnail,
        artist: channelName,
        duration: duration,
        genre: '', 
        extractedAt: new Date().toISOString(),
        playlist: url // Aqui você pode associar a URL específica da playlist se desejar
      };

      processedVideos.push(newVideo);
    }

    await browser.close();

    // Salvar os vídeos processados no arquivo JSON
    const filePath = path.join(process.cwd(), 'public', 'songs', 'addsongs.json');
    const fileData = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(fileData);

    processedVideos.forEach((newVideo) => {
      const existingVideoIndex = json.findIndex((video) => video.name === newVideo.name || video.link === newVideo.link);
      if (existingVideoIndex !== -1) {
        json[existingVideoIndex] = newVideo;
      } else {
        json.push(newVideo);
      }
    });

    fs.writeFileSync(filePath, JSON.stringify(json, null, 2));

    return res.status(200).json({ message: 'Videos details added successfully', videos: processedVideos });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
}
