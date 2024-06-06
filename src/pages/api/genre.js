// API endpoint
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'songs', 'genre.json');
    const fileData = fs.readFileSync(filePath, 'utf-8');
    const genre = JSON.parse(fileData);
    return res.status(200).json(genre); // Enviar os gêneros lidos de volta para o cliente sem um nome específico
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
}
