"use client";
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import YouTube from 'youtube-player';
import { useMusicContext } from '../context';
import PlaySvg, { MutedSvg, NextSvg, PauseSvg, PrevSvg, RepeatOneSvg, RepeatSvg, ShareSvg, ShuffleActiveSvg, ShuffleSvg, Volume100Svg, Volume50Svg, YoutbSvg } from '../Svgs';

const defaultVolume = typeof window !== 'undefined' ? localStorage.getItem('volume') || 50 : 50;
const defaultShuffle = typeof window !== 'undefined' ? localStorage.getItem('shuffle') === 'true' : false;
const defaultRepeat = typeof window !== 'undefined' ? localStorage.getItem('repeat') === 'true' : false;

const AudioPlayer = () => {
  const { selectedSong } = useMusicContext();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(defaultVolume);
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [songs, setSongs] = useState([]);
  const [shuffle, setShuffle] = useState(defaultShuffle);
  const [repeat, setRepeat] = useState(defaultRepeat);
  const [currentSongLink, setCurrentSongLink] = useState(''); // Novo estado para armazenar o link da música atual
  const playerRef = useRef(null);
  const intervalRef = useRef(null);
  const [thumbnail, setThumbnail] = useState('');
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);



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
  }, [selectedSong]); // Disparar novamente quando selectedSong mudar


  useEffect(() => {
    localStorage.setItem('volume', volume);
    if (playerRef.current) {
      playerRef.current.setVolume(volume);
    }
  }, [volume]);

  useEffect(() => {
    localStorage.setItem('shuffle', shuffle);
  }, [shuffle]);

  useEffect(() => {
    localStorage.setItem('repeat', repeat);
  }, [repeat]);


  const handleAudioPlayerSelect = async (song, index) => {
    try {
      setCurrentSong(song); // Atualiza a música atual
      setCurrentSongIndex(index);
      setIsPlaying(false);
      setDuration(0);
      setCurrentTime(0);

      if (playerRef.current) {
        playerRef.current.destroy();
      }

      setThumbnail('');
      setTitle('');
      setArtist('');
      setCurrentSongLink('');

      const player = YouTube('player', {
        videoId: song.link.split('v=')[1],
        playerVars: {
          autoplay: true,
          controls: 0,
        },
      });

      player.on('stateChange', event => {
        if (event && event.data) {
          setIsPlaying(event.data === 1);
        }
      });

      player.on('ready', event => {
        setDuration(event.target.getDuration());
        setIsPlaying(true);
        player.setVolume(volume);
      });

      playerRef.current = player;

      setThumbnail(song.thumbnail);
      setTitle(song.name);
      setArtist(song.artist);
      setCurrentSongLink(song.link);
    } catch (error) {
      console.error('Error handling song selection:', error);
    }
  };


  const playNextSong = () => {
    let nextIndex;
    if (shuffle) {
      // Se shuffle estiver ativado, escolhe um índice aleatório diferente do atual
      do {
        nextIndex = Math.floor(Math.random() * songs.length);
      } while (nextIndex === currentSongIndex); // Garante que não seja o mesmo índice atual
    } else {
      // Se shuffle estiver desativado, avança para o próximo na ordem
      nextIndex = (currentSongIndex + 1) % songs.length;
    }

    setCurrentTime(0);
    setIsPlaying(false);
    setDuration(0);
    axios
      .post('/api/playing', { selectedSong: songs[nextIndex] })
      .then(() => handleAudioPlayerSelect(songs[nextIndex], nextIndex))
      .catch(error => console.error('Error updating playing API:', error));
  };


  const playPreviousSong = () => {
    const previousIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    setCurrentTime(0);
    setIsPlaying(false);
    setDuration(0);
    axios
      .post('/api/playing', { selectedSong: songs[previousIndex] })
      .then(() => handleAudioPlayerSelect(songs[previousIndex], previousIndex))
      .catch(error => console.error('Error updating playing API:', error));
  };




  useEffect(() => {
    if (selectedSong) {
      const index = songs.findIndex(song => song.link === selectedSong.link);
      handleAudioPlayerSelect(selectedSong, index);
    }
  }, [selectedSong]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        playerRef.current.getCurrentTime().then(time => {
          setCurrentTime(time);
        });
        if (currentTime >= duration - 1) {
          if (repeat) {
            setCurrentTime(0);
            playerRef.current.seekTo(0);
            setIsPlaying(true);
          } else {
            if (shuffle) {
              playRandomSong(); // Chama a função para reproduzir uma música aleatória
            } else {
              playNextSong(); // Chama a função para reproduzir a próxima música
            }
          }
        }
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, currentTime, repeat, shuffle]); // Adiciona shuffle como dependência



  const playRandomSong = () => {
    const randomIndex = Math.floor(Math.random() * songs.length);
    const randomSong = songs[randomIndex];
    setCurrentTime(0);
    setIsPlaying(false);
    setCurrentSongIndex(randomIndex);
    setDuration(0);
    axios
      .post('/api/playing', { selectedSong: randomSong })
      .then(() => handleAudioPlayerSelect(randomSong, randomIndex))
      .catch(error => console.error('Error updating playing API:', error));
  };

  const togglePlay = () => {
    if (!currentSong) return; // Verificação de segurança
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
    setIsPlaying(!isPlaying);
  };
  
  
  
  const toggleMute = () => {
    if (!currentSong) return; // Verificação de segurança
    const newVolume = isMuted ? (volume === 0 ? 50 : volume) : 0;
    setVolume(newVolume);
    setIsMuted(!isMuted);
  };
  
  const handleVolumeChange = event => {
    if (!currentSong) return; // Verificação de segurança
    const newVolume = parseInt(event.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };
  
  const handleProgressBarChange = event => {
    if (!currentSong) return; // Verificação de segurança
    const newTime = parseFloat(event.target.value);
    setCurrentTime(newTime);
    playerRef.current.seekTo(newTime);
  };
  

  const toggleShuffle = () => {
    setShuffle(!shuffle);
  };

  const toggleRepeat = () => {
    setRepeat(!repeat);
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

  const openYoutubeLink = () => {
    window.open(currentSongLink, '_blank');
  };

  const progressPercentage = (currentTime / duration) * 100;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentSongLink).then(() => {
      console.log('Link copiado para o clipboard:', currentSongLink);
    }).catch(error => {
      console.error('Erro ao copiar o link:', error);
    });
  };

  const [thumbnailClicked, setThumbnailClicked] = useState(false);
  const [currentPlayingSong, setCurrentPlayingSong] = useState(null);

  const handleThumbnailClick = async () => {
    const currentTimeBeforeExpand = currentTime;
    setThumbnailClicked(true);

    if (currentSong) {
      await handleAudioPlayerSelect(currentSong, currentSongIndex);
      playerRef.current.seekTo(currentTimeBeforeExpand);
    }
  };

  const handleCloseClick = async () => {
    const currentTimeBeforeClose = currentTime;
    setThumbnailClicked(false);

    if (currentSong) {
      await handleAudioPlayerSelect(currentSong, currentSongIndex);
      playerRef.current.seekTo(currentTimeBeforeClose);
    }
  };




  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key, code } = event;

      const keyMap = {
        'MediaPlayPause': togglePlay,
        'MediaTrackNext': playNextSong,
        'MediaTrackPrevious': playPreviousSong,
        'ArrowRight': playNextSong,
        'ArrowLeft': playPreviousSong,
        'KeyM': toggleMute,
        'Space': togglePlay,
        'KeyS': toggleShuffle,
        'KeyR': toggleRepeat,
      };

      keyMap[key]?.();
      keyMap[code]?.();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [togglePlay, playNextSong, playPreviousSong, toggleMute, toggleShuffle, toggleRepeat]);





  return (
    <>
      <div
        style={{
          backgroundColor: '#000000',
          width: thumbnailClicked ? '100%' : '1px',
          height: thumbnailClicked ? '100%' : '1px',
          position: 'absolute',
          top: thumbnailClicked ? '0' : '50%',
          left: '50%',
          transform: thumbnailClicked ? 'translateX(-50%)' : 'translate(-50%, -50%)',
        }}
      >
      </div>

      <div
        id="player"
        style={{
          width: thumbnailClicked ? '100%' : '1px',
          height: thumbnailClicked ? '88%' : '1px',
          position: 'absolute',
          top: thumbnailClicked ? '0' : '50%',
          left: '50%',
          transform: thumbnailClicked ? 'translateX(-50%)' : 'translate(-50%, -50%)',
        }}
        className="video-player"
      ></div>

      <div className="footer-player relative">
        <div style={{ minWidth: '400px' }} className='flex align-items-center mx-3 absolute top-0 left-0 mt-3'>
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
            {thumbnail && (
              <img
                src={thumbnail}
                style={{
                  width: '150px',
                  height: '150px',
                  objectFit: 'cover',
                  transform: 'translateY(25%)'
                }}
                alt="Cover"
              />
            )}
          </div>
          <div className="flex flex-col mx-3">
            <div className="song-name font-bold">{truncateText(title, 38)}</div>
            <div className="artist-name text-left">{truncateText(artist, 20)}</div>

            {currentSongLink && (
              thumbnailClicked ? (
                <div style={{ width: '120px', textAlign: 'center' }}>
                  <div className="rounded-md text-small text-white cursor-pointer bg-[#262626] hover:bg-[#C11925]" onClick={handleCloseClick}>
                    Fechar Vídeo
                  </div>
                </div>
              ) : (
                <div style={{ width: '120px', textAlign: 'center' }} className="rounded-md text-small text-white cursor-pointer bg-[#262626] hover:bg-[#3db52b]" onClick={handleThumbnailClick}>
                  Abrir Vídeo
                </div>
              )
            )}
          </div>
        </div>

        <div className="flex justify-center mt-2 mb-2">
          <div className="flex items-center space-x-4 ">
            <div className="hover:cursor-pointer" onClick={toggleShuffle}>
              {shuffle ? <ShuffleActiveSvg /> : <ShuffleSvg />}
            </div>
            <div className="hover:cursor-pointer" onClick={playPreviousSong}>
              <PrevSvg />
            </div>
            <div className="hover:cursor-pointer" onClick={togglePlay}>
              {isPlaying ? <span><PauseSvg /></span> : <span><PlaySvg /></span>}
            </div>

            <div className="hover:cursor-pointer" onClick={playNextSong}>
              <NextSvg />
            </div>

            <div className="hover:cursor-pointer" onClick={toggleRepeat}>
              {repeat ? <RepeatOneSvg /> : <RepeatSvg />}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center mt-2 mb-2 ">
          <span className='mr-2'>{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            className="w-80 mx-2 range-input hover:cursor-pointer"
            onChange={handleProgressBarChange}
            style={{
              '--current-time': `${currentTime}`,
              '--duration': `${duration}`,
            }}
          />
          <span className='mx-2'>{formatTime(duration)}</span>
        </div>

        <div style={{ marginRight: '200px', marginTop: '43px' }} className="flex items-center absolute top-0 right-0 hover:cursor-pointer" onClick={openYoutubeLink}>
          <div className="ml-auto mx-2">
            <YoutbSvg />
          </div>
        </div>

        <div style={{ marginRight: '165px', marginTop: '43px' }} className="flex items-center absolute top-0 right-0 hover:cursor-pointer" onClick={copyToClipboard}>
          <div className="ml-auto mx-2">
            <ShareSvg />
          </div>
        </div>

        <div className="flex items-center mr-7 mt-9 absolute top-0 right-0 hover:cursor-pointer">
          <div className="ml-auto mx-2" onClick={toggleMute}>
            {isMuted || volume === 0 ? <MutedSvg /> : volume >= 80 ? <Volume100Svg /> : <Volume50Svg />}
          </div>

          <div className="flex items-center ">
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-input w-24 hover:cursor-pointer"
              style={{ '--volume': `${volume}` }}
            />
          </div>
        </div>
      </div>
    </>
  );
};


export default AudioPlayer;


