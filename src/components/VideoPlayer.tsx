
import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import type { Episode, Subtitle } from '@/lib/types';

interface VideoPlayerProps {
  episode: Episode;
  autoplay?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  onSeek?: (currentTime: number) => void;
  onVolumeChange?: (volume: number) => void;
  onRateChange?: (rate: number) => void;
  syncTime?: number;
  syncPaused?: boolean;
  syncPlaybackRate?: number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  episode, 
  autoplay = false,
  onPlay,
  onPause,
  onTimeUpdate,
  onSeek,
  onVolumeChange,
  onRateChange,
  syncTime,
  syncPaused,
  syncPlaybackRate,
}) => {
  const videoRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);
  const [isUserSeeking, setIsUserSeeking] = useState(false);
  const lastSyncTime = useRef<number | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    // Initialize video.js player
    const videoElement = document.createElement('video');
    videoElement.className = 'video-js vjs-big-play-centered vjs-fluid';
    videoRef.current.appendChild(videoElement);

    const player = playerRef.current = videojs(videoElement, {
      autoplay: autoplay,
      controls: true,
      responsive: true,
      fluid: true,
      sources: [{
        src: episode.url,
        type: 'application/x-mpegURL' // For HLS streaming
      }],
      playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
      poster: episode.thumbnail,
    }, () => {
      console.log('Player is ready');
      
      // Add subtitles if available
      if (episode.subtitles && episode.subtitles.length > 0) {
        episode.subtitles.forEach(subtitle => {
          player.addRemoteTextTrack({
            kind: 'subtitles',
            srclang: subtitle.language.substring(0, 2).toLowerCase(),
            label: subtitle.language,
            src: subtitle.url,
            default: subtitle.language === 'English'
          }, false);
        });
      }

      // Add event listeners for synchronization
      player.on('play', () => {
        if (onPlay) onPlay();
      });

      player.on('pause', () => {
        if (onPause) onPause();
      });

      player.on('timeupdate', () => {
        if (onTimeUpdate && !isUserSeeking) {
          onTimeUpdate(player.currentTime());
        }
      });

      player.on('seeking', () => {
        setIsUserSeeking(true);
      });

      player.on('seeked', () => {
        if (onSeek) {
          onSeek(player.currentTime());
        }
        setIsUserSeeking(false);
      });

      player.on('volumechange', () => {
        if (onVolumeChange) {
          onVolumeChange(player.volume());
        }
      });

      player.on('ratechange', () => {
        if (onRateChange) {
          onRateChange(player.playbackRate());
        }
      });
    });

    // Cleanup
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [episode, autoplay, onPlay, onPause, onTimeUpdate, onSeek]);

  // Sync with remote controls
  useEffect(() => {
    if (!playerRef.current || isUserSeeking) return;

    // Sync playback rate if changed
    if (syncPlaybackRate && playerRef.current.playbackRate() !== syncPlaybackRate) {
      playerRef.current.playbackRate(syncPlaybackRate);
    }

    // Sync pause/play state
    if (syncPaused !== undefined) {
      if (syncPaused && !playerRef.current.paused()) {
        playerRef.current.pause();
      } else if (!syncPaused && playerRef.current.paused()) {
        playerRef.current.play();
      }
    }

    // Sync time if it's different by more than 2 seconds
    if (syncTime !== undefined && !isUserSeeking) {
      const currentTime = playerRef.current.currentTime();
      if (Math.abs(currentTime - syncTime) > 2) {
        playerRef.current.currentTime(syncTime);
        lastSyncTime.current = syncTime;
      }
    }
  }, [syncTime, syncPaused, syncPlaybackRate, isUserSeeking]);

  return (
    <div className="w-full bg-black rounded-lg overflow-hidden">
      <div className="aspect-video" ref={videoRef}></div>
    </div>
  );
};

export default VideoPlayer;
