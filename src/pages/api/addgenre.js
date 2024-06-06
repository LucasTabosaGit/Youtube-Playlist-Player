// pages/api/addgenre.js

import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { title, color } = req.body;

    // Caminho para o arquivo JSON
    const filePath = path.join(process.cwd(), 'public', 'songs', 'genre.json');

    // Lê o conteúdo do arquivo JSON atual
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro ao ler o arquivo JSON.' });
      }

      let genres = [];
      try {
        genres = JSON.parse(data);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao analisar o conteúdo do arquivo JSON.' });
      }

      // Verifica se o gênero já existe no arquivo JSON
      const existingGenreIndex = genres.findIndex(genre => genre.title === title);
      if (existingGenreIndex !== -1) {
        // Se o gênero já existir, atualiza a cor
        genres[existingGenreIndex].color = color;
      } else {
        // Se o gênero não existir, adiciona um novo
        genres.push({ title, color });
      }

      // Escreve os gêneros atualizados de volta ao arquivo JSON
      fs.writeFile(filePath, JSON.stringify(genres, null, 2), (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Erro ao escrever no arquivo JSON.' });
        }

        return res.status(200).json({ message: 'Gênero adicionado/atualizado com sucesso!' });
      });
    });
  } else {
    // Método não permitido
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} não permitido.`);
  }
}
