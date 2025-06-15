'use client'
import React, { useState, useEffect, useRef } from 'react';
import Lyrics from '@/components/Lyrics';
import { Play, Pause, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

const YouTubeLyricsPlayer = ({ params }) => {
  const unwrappedParams = React.use(params);
  const [songData, setSongData] = useState(null);
  const [videoId, setVideoId] = useState('');
  const [lyrics, setLyrics] = useState([]);
  const [currentLyric, setCurrentLyric] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef(null);
  const intervalRef = useRef(null);

  // Load YouTube API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
      
      window.onYouTubeIframeAPIReady = () => {
        console.log('YouTube API loaded');
      };

      // Add error handling for YouTube API
      window.addEventListener('error', (event) => {
        // Suppress YouTube analytics errors
        if (event.message && event.message.includes('youtubei/v1/log_event')) {
          event.preventDefault();
          event.stopPropagation();
        }
      }, true);
    }
  }, []);

  // Fetch song data from LRC Lib
  useEffect(() => {
    const fetchSongData = async () => {
      try {
        const response = await fetch(`https://lrclib.net/api/get/${unwrappedParams.id}`);
        const data = await response.json();
        setSongData(data);
        
        if (data.syncedLyrics) {
          const parsedLyrics = parseLRC(data.syncedLyrics);
          setLyrics(parsedLyrics);
        }
        
        // Search YouTube for the song
        const query = `${data.trackName} ${data.artistName}`;
        const ytResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}&maxResults=1`
        );
        const ytData = await ytResponse.json();
        
        if (ytData.items && ytData.items.length > 0) {
          setVideoId(ytData.items[0].id.videoId);
        }
      } catch (err) {
        setError(`Error: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSongData();
  }, [unwrappedParams.id]);

  const parseLRC = (lrcText) => {
    const lines = lrcText.split('\n');
    const parsedLyrics = [];
    
    lines.forEach(line => {
      const match = line.match(/\[(\d+):(\d+)\.(\d+)\](.*)/);
      if (match) {
        const minutes = parseInt(match[1]);
        const seconds = parseInt(match[2]);
        const milliseconds = parseInt(match[3]);
        const text = match[4].trim();
        
        if (text) {
          parsedLyrics.push({
            time: (minutes * 60 + seconds) * 1000 + milliseconds * 10,
            text: text
          });
        }
      }
    });
    
    return parsedLyrics.sort((a, b) => a.time - b.time);
  };

  // Initialize YouTube player
  useEffect(() => {
    if (videoId && window.YT && window.YT.Player) {
      if (player) {
        player.destroy();
      }

      const newPlayer = new window.YT.Player(playerRef.current, {
        height: '0',
        width: '0',
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
        },
        events: {
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
              startLyricSync(newPlayer);
            } else {
              setIsPlaying(false);
              stopLyricSync();
            }
          }
        }
      });

      setPlayer(newPlayer);
    }
  }, [videoId]);

  // Start lyric synchronization
  const startLyricSync = (playerInstance) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (playerInstance && lyrics.length > 0) {
        const currentTime = playerInstance.getCurrentTime() * 1000;
        
        // Find current lyric
        let activeLyric = '';
        for (let i = 0; i < lyrics.length; i++) {
          if (lyrics[i].time <= currentTime) {
            activeLyric = lyrics[i].text;
          } else {
            break;
          }
        }
        
        if (activeLyric !== currentLyric) {
          setCurrentLyric(activeLyric);
        }
      }
    }, 100);
  };

  // Stop lyric synchronization
  const stopLyricSync = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const togglePlayPause = () => {
    if (player) {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    }
  };

  if (isLoading) {
    return (
      <div className="h-full  text-white p-8 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full text-white p-8 flex items-center justify-center">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className=" relative text-white">
      {/* Hidden YouTube Player */}
      <div ref={playerRef} className="hidden"></div>

      {/* Song Info and Controls */}
      <div className="absolute top-0 left-0 right-0 z-10 backdrop-blur-sm p-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </Button>
            </Link>
            {songData && (
              <div className="text-center md:text-left">
                <h1 className="text-xl md:text-2xl font-bold">{songData.trackName}</h1>
                <p className="text-gray-400 text-sm md:text-base">{songData.artistName}</p>
              </div>
            )}
          </div>
          <Button
            onClick={togglePlayPause}
            variant="ghost"
            size="icon"
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 md:w-6 md:h-6 text-white" />
            ) : (
              <Play className="w-5 h-5 md:w-6 md:h-6 text-white" />
            )}
          </Button>
        </div>
      </div>

      {/* Lyrics Display */}
      <div className="">
        {currentLyric && (
          <Lyrics
            lyricLine={currentLyric} 
            animationDurationMs={2000}
          />
        )}
      </div>
    </div>
  );
};

export default YouTubeLyricsPlayer;