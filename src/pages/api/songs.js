// API endpoint
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'songs', 'songs.json');
    const fileData = fs.readFileSync(filePath, 'utf-8');
    const songsList = JSON.parse(fileData);
    return res.status(200).json({ songsList });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
}
