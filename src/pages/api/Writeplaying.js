import path from 'path';
import fs from 'fs';

export default (req, res) => {
    if (req.method === 'POST') {
        const song = req.body;

        if (!song) {
            return res.status(400).json({ error: 'No song data provided' });
        }

        const filePath = path.join(process.cwd(), 'public', 'songs', 'playing.json');

        try {
            fs.writeFileSync(filePath, JSON.stringify([song], null, 2));

            res.status(200).json({ message: 'Song saved successfully' });
        } catch (err) {
            console.error('Error writing to playing.json:', err);
            res.status(500).json({ error: 'Failed to save song' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} not allowed`);
    }
};

