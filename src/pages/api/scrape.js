import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: 'URL is required' });
  }

  // Extrai apenas o ID do vídeo da URL do YouTube
  const videoId = url.match(/(?<=v=)[^&]+/)[0];
  if (!videoId) {
    return res.status(400).json({ message: 'Invalid YouTube URL' });
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle2' });
    console.log("Waiting for title element...");
    await page.waitForSelector('#title > h1 > yt-formatted-string');
    console.log("Title element found, extracting title...");
    const title = await page.$eval('#title > h1 > yt-formatted-string', (el) => {
      console.log("Extracting title...");
      return el.textContent.trim();
    });
    console.log("Title extracted:", title);

    // Extrai o nome do canal do YouTube
    const channelName = await page.evaluate(() => {
      const channelElement = document.querySelector('#text > a.yt-simple-endpoint');
      return channelElement ? channelElement.textContent.trim() : null;
    });

    // Extrai a duração do vídeo
    const duration = await page.$eval('span.ytp-time-duration', (el) => {
      return el.textContent.trim();
    });

    if (!title || !channelName || !duration) {
      throw new Error('Could not fetch video details');
    }

    const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    await browser.close();

    const newVideo = {
      name: title,
      link: `https://www.youtube.com/watch?v=${videoId}`,
      thumbnail: thumbnail,
      artist: channelName,
      duration: duration
    };

    const filePath = path.join(process.cwd(), 'public', 'songs', 'songs.json');
    const fileData = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(fileData);

    // Verifica se já existe um vídeo com o mesmo título ou URL
    const existingVideoIndex = json.findIndex((video) => video.name === title || video.link === newVideo.link);
    if (existingVideoIndex !== -1) {
      // Substitui os dados do vídeo existente pelos novos
      json[existingVideoIndex] = newVideo;
    } else {
      // Adiciona o novo vídeo à lista
      json.push(newVideo);
    }

    fs.writeFileSync(filePath, JSON.stringify(json, null, 2));

    return res.status(200).json({ message: 'Video details added successfully', video: newVideo });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
}
