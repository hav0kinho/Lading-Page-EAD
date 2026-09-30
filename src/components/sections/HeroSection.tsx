"use client";

import React from "react";
import dynamic from "next/dynamic";
import { SITE_CONTENT } from "@/config/content";
import { Button } from "@/components/ui/Button";
import { Play, Sparkles } from "lucide-react";

const GitCommitGraph3D = dynamic(() => import("@/components/3d/GitCommitGraph3D"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-background/50" />,
});

export const HeroSection: React.FC = () => {
  const { hero } = SITE_CONTENT;

  return (
    <header className="relative min-h-[92vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 pt-20 pb-16">
      {/* Elemento 3D interativo ao fundo */}
      <GitCommitGraph3D />

      {/* Gradientes decorativos para atmosfera tech */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-primary/20 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-10 w-[300px] h-[200px] bg-accent-cyan/15 blur-[120px] pointer-events-none rounded-full" />

      {/* Conteúdo Central do Hero */}
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Badge superior */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-purple-300 text-xs sm:text-sm font-medium mb-6 shadow-sm backdrop-blur-sm animate-fade-in">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>{hero.badge}</span>
        </div>

        {/* Título Principal com destaque */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-heading tracking-tight text-text-main leading-tight sm:leading-tight mb-6">
          GitHub para Educadores:{" "}
          <span className="bg-gradient-to-r from-purple-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
            Como Acompanhar a Evolução de Projetos de Alunos
          </span>
        </h1>

        {/* Subtítulo */}
        <p className="text-base sm:text-xl text-text-muted max-w-2xl mx-auto font-body mb-10 leading-relaxed">
          {hero.subtitle}
        </p>

        {/* Botão Call to Action com âncora nativa para rolagem suave */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button
            size="lg"
            href={`#${hero.ctaTargetId}`}
            aria-label={hero.ctaText}
            className="group"
          >
            <Play className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
            <span>{hero.ctaText}</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default HeroSection;
