import { useEffect, useMemo, useRef } from 'react';

import { updateLessonWatchTime } from '../../progress/progress.service';
import { YouTubePlayer } from './YouTubePlayer';

type LessonPlayerProps = {
  lessonId: string;
  videoUrl: string | null;
  title: string;
  initialTime?: number;
  trackProgress?: boolean;
  showHeader?: boolean;
};

type VideoSource =
  | {
      type: 'direct';
      url: string;
    }
  | {
      type: 'youtube';
      videoId: string;
    }
  | {
      type: 'vimeo';
      url: string;
    }
  | {
      type: 'empty';
      url: null;
    };

function getYoutubeVideoId(url: URL) {
  if (url.hostname.includes('youtu.be')) {
    return url.pathname.split('/').filter(Boolean)[0] ?? null;
  }

  if (url.hostname.includes('youtube.com')) {
    if (url.pathname.startsWith('/embed/')) {
      return url.pathname.split('/').filter(Boolean)[1] ?? null;
    }

    if (url.pathname.startsWith('/shorts/')) {
      return url.pathname.split('/').filter(Boolean)[1] ?? null;
    }

    return url.searchParams.get('v');
  }

  return null;
}

function getVimeoEmbedUrl(url: URL) {
  if (!url.hostname.includes('vimeo.com')) {
    return null;
  }

  const id = url.pathname.split('/').filter(Boolean).at(0);

  return id ? `https://player.vimeo.com/video/${id}` : null;
}

function resolveVideoSource(videoUrl: string | null): VideoSource {
  if (!videoUrl) {
    return {
      type: 'empty',
      url: null,
    };
  }

  try {
    const url = new URL(videoUrl);
    const youtubeVideoId = getYoutubeVideoId(url);

    if (youtubeVideoId) {
      return {
        type: 'youtube',
        videoId: youtubeVideoId,
      };
    }

    const vimeoEmbedUrl = getVimeoEmbedUrl(url);

    if (vimeoEmbedUrl) {
      return {
        type: 'vimeo',
        url: vimeoEmbedUrl,
      };
    }
  } catch {
    return {
      type: 'direct',
      url: videoUrl,
    };
  }

  return {
    type: 'direct',
    url: videoUrl,
  };
}

export function LessonPlayer({
  lessonId,
  videoUrl,
  title,
  initialTime = 0,
  trackProgress = true,
  showHeader = true,
}: LessonPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const source = useMemo(
    () => resolveVideoSource(videoUrl),
    [videoUrl],
  );

  useEffect(() => {
    if (
      source.type !== 'direct' ||
      !videoRef.current ||
      initialTime <= 0
    ) {
      return;
    }

    videoRef.current.currentTime = initialTime;
  }, [initialTime, source.type]);

  useEffect(() => {
    const video = videoRef.current;

    if (!trackProgress || source.type !== 'direct' || !video) {
      return;
    }

    const interval = window.setInterval(() => {
      if (!video.paused && video.currentTime > 0) {
        updateLessonWatchTime(
          lessonId,
          Math.floor(video.currentTime),
        );
      }
    }, 10000);

    return () => {
      window.clearInterval(interval);
    };
  }, [lessonId, source.type, trackProgress]);

  return (
    <section className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-sm shadow-black/5">
      {showHeader && (
        <div className="border-b border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 sm:px-5">
          <p className="text-xs font-semibold uppercase text-[var(--text-muted)]">
            Player da aula
          </p>

          <h2 className="mt-1 text-base font-semibold text-[var(--text)] sm:text-lg">
            {title}
          </h2>
        </div>
      )}

      {source.type === 'youtube' && (
        <YouTubePlayer
          lessonId={lessonId}
          videoId={source.videoId}
          title={title}
          initialTime={initialTime}
          trackProgress={trackProgress}
        />
      )}

      {source.type === 'direct' && (
        <video
          ref={videoRef}
          controls
          className="aspect-video w-full bg-black"
          src={source.url}
        />
      )}

      {source.type === 'vimeo' && (
        <iframe
          className="aspect-video w-full bg-black"
          src={source.url}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      )}

      {source.type === 'empty' && (
        <div className="flex aspect-video items-center justify-center bg-[var(--surface-soft)] p-8 text-center">
          <div>
            <p className="text-lg font-bold text-[var(--text)]">
              Vídeo indisponível
            </p>

            <p className="mt-2 max-w-md text-sm leading-6 text-[var(--text-soft)]">
              Esta aula ainda não possui vídeo cadastrado.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
