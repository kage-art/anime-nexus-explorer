
import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import type { Episode, Subtitle } from '@/lib/types';

interface VideoPlayerProps {
  episode: Episode;
  autoplay?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ episode, autoplay = false }) => {
  const videoRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);

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
      playbackRates: [0.5, 1, 1.5, 2],
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
    });

    // Cleanup
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [episode, autoplay]);

  return (
    <div className="w-full bg-black rounded-lg overflow-hidden">
      <div className="aspect-video" ref={videoRef}></div>
    </div>
  );
};

export default VideoPlayer;
