'use client';

import { useEffect, useRef, useState } from 'react';

interface VideoPlayerProps {
  videoId: string;
  onProgress?: (progress: number, currentTime: number, duration: number) => void;
  onStateChange?: (state: number) => void;
  onReady?: () => void;
  startTime?: number; // Start time in seconds
  className?: string;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function VideoPlayer({
  videoId,
  onProgress,
  onStateChange,
  onReady,
  startTime = 0,
  className = '',
}: VideoPlayerProps) {
  const playerRef = useRef<HTMLDivElement>(null);
  const playerInstanceRef = useRef<any>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load YouTube iframe API if not already loaded
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        initializePlayer();
      };
    } else {
      initializePlayer();
    }

    return () => {
      // Cleanup
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (playerInstanceRef.current) {
        try {
          playerInstanceRef.current.destroy();
        } catch (e) {
          console.error('Error destroying player:', e);
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  const initializePlayer = () => {
    if (!playerRef.current || !window.YT) return;

    try {
      // Note: rel=0 disables related videos to keep users on the site
      // For full privacy-enhanced mode, we'd need a custom iframe implementation
      playerInstanceRef.current = new window.YT.Player(playerRef.current, {
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 1,
          modestbranding: 1,
          rel: 0, // Disable related videos
          showinfo: 0,
          fs: 1, // Allow fullscreen
          enablejsapi: 1,
          origin: typeof window !== 'undefined' ? window.location.origin : '',
          start: startTime,
        },
        events: {
          onReady: (event: any) => {
            setIsReady(true);
            setError(null);
            if (onReady) onReady();
            
            // Start progress tracking
            startProgressTracking(event.target);
          },
          onStateChange: (event: any) => {
            if (onStateChange) {
              onStateChange(event.data);
            }
            
            // Stop progress tracking when paused or ended
            if (event.data === window.YT.PlayerState.PAUSED || 
                event.data === window.YT.PlayerState.ENDED) {
              if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
                progressIntervalRef.current = null;
              }
              
              // Save progress on pause/end
              if (event.target && onProgress) {
                try {
                  const currentTime = event.target.getCurrentTime();
                  const duration = event.target.getDuration();
                  if (duration > 0) {
                    const progress = (currentTime / duration) * 100;
                    onProgress(progress, currentTime, duration);
                  }
                } catch (e) {
                  console.error('Error getting video progress:', e);
                }
              }
            }
            
            // Resume progress tracking when playing
            if (event.data === window.YT.PlayerState.PLAYING) {
              startProgressTracking(event.target);
            }
          },
          onError: (event: any) => {
            console.error('YouTube player error:', event.data);
            setError('Failed to load video. Please check if the video is available.');
          },
        },
      });
    } catch (error) {
      console.error('Error initializing YouTube player:', error);
      setError('Failed to initialize video player.');
    }
  };

  const startProgressTracking = (player: any) => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    progressIntervalRef.current = setInterval(() => {
      if (player && onProgress) {
        try {
          const currentTime = player.getCurrentTime();
          const duration = player.getDuration();
          
          if (duration > 0 && currentTime >= 0) {
            const progress = (currentTime / duration) * 100;
            onProgress(progress, currentTime, duration);
          }
        } catch (e) {
          console.error('Error tracking progress:', e);
        }
      }
    }, 10000); // Update every 10 seconds
  };

  return (
    <div className={`relative w-full ${className}`}>
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white p-4 rounded-lg">
          <p className="text-center">{error}</p>
        </div>
      )}
      {!isReady && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
          <p>Loading video...</p>
        </div>
      )}
      <div
        ref={playerRef}
        className="w-full h-full"
      />
    </div>
  );
}

