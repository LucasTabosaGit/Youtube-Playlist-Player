import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    // Ler o arquivo extractedyoutube.json que contém a lista de vídeos
    const filePath = path.join(process.cwd(), 'public', 'songs', 'extractedyoutube.json');
    const fileData = fs.readFileSync(filePath, 'utf-8');
    const playlist = JSON.parse(fileData);

    // Array para armazenar os novos vídeos processados
    const processedVideos = [];

    // Iniciar o navegador Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Iterar sobre cada vídeo na playlist
    for (let i = 0; i < playlist.length; i++) {
      const { title, artists, link } = playlist[i];

      // Navegar até a página do vídeo
      await page.goto(link, { waitUntil: 'networkidle2' });
      console.log(`Processing video ${i + 1} of ${playlist.length}, Link: ${link}`);

      // Extrair informações do vídeo
      const videoId = link.match(/(?<=v=)[^&]+/)[0];
      
      const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      const channelName = await page.evaluate(() => {
        const channelElement = document.querySelector('#text > a.yt-simple-endpoint');
        return channelElement ? channelElement.textContent.trim() : null;
      });
      const duration = await page.$eval('span.ytp-time-duration', (el) => el.textContent.trim());


      const extractedVideo = {
        name: title,
        link: `https://www.youtube.com/watch?v=${videoId}`,
        thumbnail: thumbnail,
        artist: channelName,
        duration: duration,
        genre: '', // Adicione o gênero se necessário
        extractedAt: new Date().toISOString(),
        playlist: ''
      };

      processedVideos.push(extractedVideo);
    }

    // Fechar o navegador Puppeteer após processar todos os vídeos
    await browser.close();

    // Salvar os vídeos processados no arquivo addsongs.json
    const addsongsFilePath = path.join(process.cwd(), 'public', 'songs', 'addsongs.json');
    const existingFileData = fs.readFileSync(addsongsFilePath, 'utf-8');
    const existingVideos = JSON.parse(existingFileData);

    // Adicionar ou atualizar os vídeos processados no arquivo addsongs.json
    processedVideos.forEach((newVideo) => {
      const existingVideoIndex = existingVideos.findIndex((video) => video.name === newVideo.name || video.link === newVideo.link);
      if (existingVideoIndex !== -1) {
        existingVideos[existingVideoIndex] = newVideo;
      } else {
        existingVideos.push(newVideo);
      }
    });

    fs.writeFileSync(addsongsFilePath, JSON.stringify(existingVideos, null, 2));

    // Retornar uma resposta de sucesso com os vídeos processados
    return res.status(200).json({ message: 'Videos processed and added successfully', videos: processedVideos });
  } catch (error) {
    console.error('Error processing videos:', error);
    return res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
}
