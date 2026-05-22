import {
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';

import { updateLessonWatchTime } from '../../progress/progress.service';

declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string,
        options: {
          videoId: string;
          playerVars?: Record<string, number | string>;
          events?: {
            onReady?: (event: YouTubePlayerEvent) => void;
            onStateChange?: (event: YouTubePlayerStateEvent) => void;
          };
        },
      ) => YouTubePlayerInstance;
      PlayerState: {
        PLAYING: number;
        ENDED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

type YouTubePlayerInstance = {
  destroy: () => void;
  getCurrentTime: () => number;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
};

type YouTubePlayerEvent = {
  target: YouTubePlayerInstance;
};

type YouTubePlayerStateEvent = YouTubePlayerEvent & {
  data: number;
};

type YouTubePlayerProps = {
  lessonId: string;
  videoId: string;
  title: string;
  initialTime: number;
  trackProgress?: boolean;
};

let youtubeApiPromise: Promise<void> | null = null;

function loadYouTubeApi() {
  if (window.YT?.Player) {
    return Promise.resolve();
  }

  if (!youtubeApiPromise) {
    youtubeApiPromise = new Promise((resolve) => {
      const previousCallback = window.onYouTubeIframeAPIReady;

      window.onYouTubeIframeAPIReady = () => {
        previousCallback?.();
        resolve();
      };

      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;
        document.body.appendChild(script);
      }
    });
  }

  return youtubeApiPromise;
}

export function YouTubePlayer({
  lessonId,
  videoId,
  title,
  initialTime,
  trackProgress = true,
}: YouTubePlayerProps) {
  const reactId = useId();
  const containerId = `youtube-player-${reactId.replace(/:/g, '')}`;
  const playerRef = useRef<YouTubePlayerInstance | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let isMounted = true;

    loadYouTubeApi().then(() => {
      if (!isMounted || !window.YT?.Player) {
        return;
      }

      playerRef.current = new window.YT.Player(containerId, {
        videoId,
        playerVars: {
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
        },
        events: {
          onReady: (event) => {
            if (initialTime > 0) {
              event.target.seekTo(initialTime, true);
            }
          },
          onStateChange: (event) => {
            if (event.data === window.YT?.PlayerState.ENDED) {
              setIsFinished(true);

              if (trackProgress) {
                updateLessonWatchTime(
                  lessonId,
                  Math.floor(event.target.getCurrentTime()),
                );
              }
            }
          },
        },
      });
    });

    return () => {
      isMounted = false;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [containerId, initialTime, lessonId, trackProgress, videoId]);

  useEffect(() => {
    if (!trackProgress) {
      return;
    }

    const interval = window.setInterval(() => {
      const player = playerRef.current;

      if (!player || !window.YT?.PlayerState) {
        return;
      }

      const currentTime = Math.floor(player.getCurrentTime());

      if (currentTime > 0) {
        updateLessonWatchTime(lessonId, currentTime);
      }
    }, 10000);

    return () => {
      window.clearInterval(interval);
    };
  }, [lessonId, trackProgress]);

  return (
    <div className="relative aspect-video w-full bg-black">
      <div id={containerId} className="h-full w-full" title={title} />

      {isFinished && (
        <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-[var(--border)] bg-black/70 p-4 text-sm text-white backdrop-blur-xl">
          Aula finalizada. Use o painel lateral para marcar a conclusão e
          avançar no seu progresso.
        </div>
      )}
    </div>
  );
}
