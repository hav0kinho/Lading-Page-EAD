import React from "react";
import { SITE_CONTENT } from "@/config/content";
import { Subtitles, ExternalLink } from "lucide-react";

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
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        </div>
      </div>

      {/* Ações e Nota de Acessibilidade */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-text-muted">
        <div className="flex items-center gap-2">
          <Subtitles className="w-4 h-4 text-purple-400 shrink-0" />
          <span>{video.accessibilityNote}</span>
        </div>
        {video.youtubeWatchUrl && (
          <a
            href={video.youtubeWatchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-purple-400 hover:text-purple-300 underline underline-offset-4 transition-colors"
          >
            <span>Assistir diretamente no YouTube</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </section>
  );
};

export default VideoSection;
