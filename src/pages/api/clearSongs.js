import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const publicDirectory = path.join(process.cwd(), 'public', 'songs');
    const filePath = path.join(publicDirectory, 'addsongs.json');

    try {
        fs.writeFileSync(filePath, JSON.stringify([]));
        res.status(200).json({ message: 'Songs list cleared successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to clear the songs list', details: error.message });
    }
}
