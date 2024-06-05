"use client";
import React, { useState } from 'react';

const Scrapper = () => {
  const [url, setUrl] = useState('');
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url })
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


export async function getServerSideProps() {
    // Fetch data from external API
    const res = await fetch('http://localhost:3000/api/songs');
    const data = await res.json();
  
    // Pass data to the page via props
    return { props: { songs: data.songsList } };
  }