import React, { useState } from 'react';

const Scrapper = () => {
  const [url, setUrl] = useState('');
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let cleanedUrl = url;

    // Verifica se o link contém "&list" ou apenas o ID do vídeo
    if (url.includes("list=")) {
      const playlistUrl = new URL(url);
      const listId = playlistUrl.searchParams.get('list');
      cleanedUrl = `https://www.youtube.com/playlist?list=${listId}`;
    } else if (url.includes("?v=")) {
      const videoId = url.match(/(?<=v=)[^&]+/)[0];
      cleanedUrl = `https://www.youtube.com/watch?v=${videoId}`;
    }

    // Envia para a rota apropriada com base no tipo de link
    const route = url.includes("list=") ? '/api/scrapeplaylist' : '/api/scrape';
    const res = await fetch(route, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: cleanedUrl })
    });
    const data = await res.json();
    setResponse(data);
  };

  return (
    <div>
      <h1>YouTube Video Scraper</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter YouTube video URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          className='text-black'
        />
        <button type="submit">Scrape Video</button>
      </form>
      {/* {response && (
        <div>
          <h2>Response</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )} */}
    </div>
  );
};

export default Scrapper;
