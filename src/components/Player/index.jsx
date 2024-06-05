"use client";
import React, { useState, useEffect, useRef } from 'react';
import { NextSvg } from '../Svgs';

const songsList = [
    {
        name: "Jazz In Paris",
        artist: "Media Right Productions",
        src: "assets/1.mp3",
        cover: "assets/1.jpg"
    },
    {
        name: "Blue Skies",
        artist: "Silent Partner",
        src: "assets/2.mp3",
        cover: "assets/2.jpg"
    },
    {
        name: "Crimson Fly",
        artist: "Huma-Huma",
        src: "assets/3.mp3",
        cover: "assets/3.jpg"
    }
];

const MusicPlayer = () => {
    const [currentSong, setCurrentSong] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [time, setTime] = useState({ currentTime: 0, duration: 0 });
    const audioRef = useRef(new Audio());
    const fillBarRef = useRef(null);
    
    useEffect(() => {
        loadSong(currentSong);
        
        const song = audioRef.current;
        const updateProgress = () => {
            if (song.duration) {
                const pos = (song.currentTime / song.duration) * 100;
                if (fillBarRef.current) {
                    fillBarRef.current.style.width = `${pos}%`;
                }
                setTime({
                    currentTime: song.currentTime,
                    duration: song.duration
                });
            }
        };
        
        song.addEventListener('timeupdate', updateProgress);
        song.addEventListener('ended', nextSong);
        
        return () => {
            song.removeEventListener('timeupdate', updateProgress);
            song.removeEventListener('ended', nextSong);
        };
    }, [currentSong]);

    const loadSong = (index) => {
        const { name, artist, src, cover } = songsList[index];
        audioRef.current.src = src;
        setPlaying(false);
        audioRef.current.pause();
    };

    const togglePlayPause = () => {
        if (playing) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setPlaying(!playing);
    };

    const nextSong = () => {
        setCurrentSong((currentSong + 1) % songsList.length);
        setPlaying(true);
        audioRef.current.play();
    };

    const prevSong = () => {
        setCurrentSong((currentSong - 1 + songsList.length) % songsList.length);
        setPlaying(true);
        audioRef.current.play();
    };

    const seek = (e) => {
        const pos = (e.nativeEvent.offsetX / e.target.clientWidth) * audioRef.current.duration;
        audioRef.current.currentTime = pos;
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="container">
            <div className="song-info">
                <div className="artist-name">{songsList[currentSong].artist}</div>
                <div className="song-name">{songsList[currentSong].name}</div>
                <div className="progress-bar" onClick={seek}>
                    <div className="fill-bar" ref={fillBarRef}></div>
                </div>
                <div className="time">{formatTime(time.currentTime)} - {formatTime(time.duration)}</div>
            </div>
            <div className="disk">
                <div className="circle"></div>
                <div 
                    id="cover" 
                    className={`cover ${playing ? 'active' : ''}`}
                    style={{ backgroundImage: `url(${songsList[currentSong].cover})` }}
                ></div>
            </div>
            
            <div className="controls">
                <i id="prev" className="prev-btn fa-solid fa-backward" onClick={prevSong}></i>
                <i id="play" className={`play-btn fa-solid ${playing ? 'fa-pause' : 'fa-play'}`} onClick={togglePlayPause}></i>
                <i id="next" className="next-btn fa-solid fa-forward" onClick={nextSong}><NextSvg/></i>
            </div>
        </div>
    );
};

export default MusicPlayer;
