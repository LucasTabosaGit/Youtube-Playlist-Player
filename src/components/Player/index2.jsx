import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import YouTube, { PlayerState } from 'youtube-player';
import PlaySvg, { MutedSvg, NextSvg, PauseSvg, PrevSvg, Volume100Svg, Volume50Svg, VolumeSvg } from '../Svgs';

const AudioPlayer = () => {
  const [songs, setSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);
  const playerRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/playing');
        const songsList = response.data.songsList[0].songs || response.data.songsList;
        setSongs(songsList);
      } catch (error) {
        console.error('Error fetching songs:', error);
      }
    };
  
    fetchSongs();
  }, []);
  

  useEffect(() => {
    if (!songs.length) return;

    const player = YouTube('player', {
      videoId: songs[currentSongIndex].link.split('v=')[1],
      playerVars: {
        autoplay: isPlaying ? 1 : 0,
        controls: 0,
      },
    });

    player.on('stateChange', event => {
      setIsPlaying(event.data === PlayerState.PLAYING);
    });

    player.on('ready', event => {
      setDuration(event.target.getDuration());
    });

    playerRef.current = player;

    return () => {
      player.destroy();
    };
  }, [currentSongIndex, isPlaying, songs]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        playerRef.current.getCurrentTime().then(time => {
          setCurrentTime(time);
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPlaying]);

  useEffect(() => {
    if (songs[currentSongIndex] && songs[currentSongIndex].duration) {
      const [minutes, seconds] = songs[currentSongIndex].duration.split(':').map(num => parseInt(num));
      setDuration(minutes * 60 + seconds);
    }
  }, [currentSongIndex, songs]);

  const playNextSong = () => {
    const newIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(newIndex);
    setIsPlaying(true);
  };

  const playPreviousSong = () => {
    const newIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    setCurrentSongIndex(newIndex);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(prevState => !prevState);
  };

  const handleVolumeChange = event => {
    const newVolume = parseInt(event.target.value);
    setVolume(newVolume);
    playerRef.current.setVolume(newVolume);
  };

  const handleProgressBarChange = event => {
    const newTime = parseFloat(event.target.value);
    setCurrentTime(newTime);
    playerRef.current.seekTo(newTime);
  };

  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const truncateText = (text, maxLength) => {
    if (text && text.length > maxLength) {
      return text.substring(0, maxLength - 3) + '...';
    }
    return text;
  };
  

  return (
    <>
      <div id="player" style={{ width: '1px', height: '1px' }} className="video-player"></div>

      <div className="footer-player relative">
        <div className='flex align-items-center mx-3 absolute top-0 left-0 mt-3'>
          <div style={{
            width: '130px',
            height: '70px',
            borderRadius: '10%',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end'
          }}>
            <img
              src={songs[currentSongIndex]?.thumbnail}
              style={{
                width: '150px',
                height: '150px',
                objectFit: 'cover',
                transform: 'translateY(25%)'
              }}
              alt="Cover"
            />
          </div>

          <div className="flex flex-col mx-3 mt-3">
            <div className="song-name font-bold">{truncateText(songs[currentSongIndex]?.name, 38)}</div>
            <div className="artist-name text-left">{truncateText(songs[currentSongIndex]?.artist, 20)}</div>
          </div>
        </div>

        <div className="flex justify-center mt-2 mb-2">
          <div className="flex items-center space-x-4 ">
            <div className="hover:cursor-pointer" onClick={playPreviousSong}>
              <PrevSvg />
            </div>
            <div className="hover:cursor-pointer" onClick={togglePlay}>
              {isPlaying ? <span><PauseSvg /></span> : <span><PlaySvg /></span>}
            </div>
            <div className="hover:cursor-pointer" onClick={playNextSong}>
              <NextSvg />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center mt-2 mb-2">
          <span className='mr-2'>{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            className="w-80 mx-2 range-input hover:cursor-pointer"
            onChange={handleProgressBarChange}
          />
          <span className='mx-2'>{formatTime(duration)}</span>
        </div>

        <div className="flex items-center mr-7 mt-9 absolute top-0 right-0 hover:cursor-pointer">
          <div className="ml-auto mx-2">
            {volume >= 80 ? <Volume100Svg /> : volume >= 1 ? <Volume50Svg /> : <MutedSvg />}
          </div>

          <div className="flex items-center ">
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="range-input w-24 hover:cursor-pointer"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default AudioPlayer;
