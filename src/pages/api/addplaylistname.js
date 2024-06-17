// pages/api/addplaylistname.js

import fs from 'fs';
import path from 'path';

const playlistFilePath = path.join(process.cwd(), 'public', 'songs', 'playlistname.json');

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { playlist } = req.body;

        try {
            // Ler o arquivo JSON atual
            const fileContent = fs.readFileSync(playlistFilePath, 'utf-8');
            let playlists = JSON.parse(fileContent);

            // Verificar se a playlist já existe
            const playlistExists = playlists.some(item => item.playlist === playlist);

            if (!playlistExists) {
                // Adicionar a nova playlist ao JSON
                playlists.push({ playlist });

                // Escrever de volta ao arquivo JSON
                fs.writeFileSync(playlistFilePath, JSON.stringify(playlists, null, 2));

                res.status(200).json({ message: 'Playlist adicionada com sucesso.', playlists });
            } else {
                res.status(400).json({ message: 'A playlist já existe.' });
            }
        } catch (error) {
            console.error('Erro ao adicionar a playlist:', error);
            res.status(500).json({ message: 'Erro ao adicionar a playlist.' });
        }
    } else {
        res.status(405).json({ message: 'Método não permitido.' });
    }
}
