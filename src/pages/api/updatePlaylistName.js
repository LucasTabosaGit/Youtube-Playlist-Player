// pages/api/updateplaylistname.js

import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { playlist } = req.body;

  // Caminho para o arquivo addsongs.json
  const addsongsFilePath = path.join(process.cwd(), 'public', 'songs', 'addsongs.json');

  // Lê os dados atuais do arquivo addsongs.json
  fs.readFile(addsongsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler arquivo addsongs.json:', err);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }

    let playlists = [];
    try {
      playlists = JSON.parse(data);
    } catch (error) {
      console.error('Erro ao analisar JSON de addsongs.json:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }

    // Atualiza todos os itens que não têm o campo 'playlist' preenchido com o valor recebido
    playlists.forEach(item => {
      if (!item.playlist) {
        item.playlist = playlist;
      }
    });

    // Escreve os dados atualizados de volta para addsongs.json
    fs.writeFile(addsongsFilePath, JSON.stringify(playlists, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Erro ao escrever arquivo addsongs.json:', err);
        return res.status(500).json({ error: 'Erro interno do servidor' });
      }

      // Retorna os dados atualizados
      res.status(200).json({ message: 'Playlist atualizada com sucesso', playlists });
    });
  });
}
