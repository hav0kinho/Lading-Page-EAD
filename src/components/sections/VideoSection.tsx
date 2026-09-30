import React from "react";
import { SITE_CONTENT } from "@/config/content";
import { Subtitles } from "lucide-react";

export const VideoSection: React.FC = () => {
  const { video } = SITE_CONTENT;

  return (
    <section
      id={video.sectionId}
      className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto scroll-mt-10"
    >
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-4xl font-bold font-heading text-text-main">
          {video.title}
        </h2>
        <p className="text-text-muted mt-2 font-body max-w-xl mx-auto">
          {video.subtitle}
        </p>
        <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full" />
      </div>

      {/* Moldura do Vídeo com Proporção 16:9 */}
      <div className="relative rounded-2xl overflow-hidden border border-purple-500/30 bg-surface shadow-glow">
        <div className="relative w-full aspect-video">
          <iframe
            src={video.youtubeEmbedUrl}
            title="Player do Minicurso"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        </div>
      </div>

      {/* Nota de Acessibilidade */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs sm:text-sm text-text-muted">
        <Subtitles className="w-4 h-4 text-purple-400" />
        <span>{video.accessibilityNote}</span>
      </div>
    </section>
  );
};

export default VideoSection;
