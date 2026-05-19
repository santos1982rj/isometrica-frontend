type LessonPlayerProps = {
  videoUrl: string | null;
  title: string;
};

function getYouTubeEmbedUrl(url: string) {
  if (url.includes('youtube.com/watch?v=')) {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  return url;
}

export function LessonPlayer({ videoUrl, title }: LessonPlayerProps) {
  if (!videoUrl) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-3xl border border-white/10 bg-black/30 text-slate-400">
        Vídeo ainda não disponível.
      </div>
    );
  }

  const isYouTube =
    videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');

  if (isYouTube) {
    return (
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-black">
        <iframe
          title={title}
          src={getYouTubeEmbedUrl(videoUrl)}
          className="aspect-video w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <video
      src={videoUrl}
      controls
      className="aspect-video w-full rounded-3xl border border-white/10 bg-black"
    />
  );
}