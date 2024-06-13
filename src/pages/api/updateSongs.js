import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const publicDirectory = path.join(process.cwd(), 'public', 'songs');
    const addSongsPath = path.join(publicDirectory, 'addsongs.json');
    const songsPath = path.join(publicDirectory, 'songs.json');

    let addSongsData = [];
    let existingSongsData = [];

    if (fs.existsSync(addSongsPath)) {
      const fileContents = fs.readFileSync(addSongsPath, 'utf8');
      addSongsData = JSON.parse(fileContents);
    } else {
      return res.status(400).json({ error: 'addsongs.json not found' });
    }

    if (fs.existsSync(songsPath)) {
      const fileContents = fs.readFileSync(songsPath, 'utf8');
      existingSongsData = JSON.parse(fileContents);
    }

    addSongsData.forEach(song => {
      const index = existingSongsData.findIndex(item => item.name === song.name);
      if (index !== -1) {
        existingSongsData[index] = song; 
      } else {
        existingSongsData.push(song); 
      }
    });

    fs.writeFileSync(songsPath, JSON.stringify(existingSongsData, null, 2));

    fs.writeFileSync(addSongsPath, JSON.stringify([], null, 2));

    res.status(200).json({ message: 'Songs added and updated successfully, addsongs.json cleared', songs: existingSongsData });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update songs', details: error.message });
  }
}
