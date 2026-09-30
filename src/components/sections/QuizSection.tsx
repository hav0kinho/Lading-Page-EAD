"use client";

import React from "react";
import dynamic from "next/dynamic";
import { SITE_CONTENT } from "@/config/content";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ExternalLink } from "lucide-react";

const Quiz3DElement = dynamic(() => import("@/components/3d/Quiz3DElement"), {
  ssr: false,
  loading: () => <div className="w-24 h-24 rounded-full bg-primary/20 animate-pulse my-4" />,
});

export const QuizSection: React.FC = () => {
  const { quiz } = SITE_CONTENT;

  return (
    <section id="avaliacao" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Card
        glow
        className="text-center py-12 px-6 sm:px-12 flex flex-col items-center bg-gradient-to-b from-surface to-surface/90 border-purple-500/40 relative overflow-hidden"
      >
        {/* Elemento 3D Interativo do Quiz */}
        <div className="w-40 h-40 flex items-center justify-center my-2">
          <Quiz3DElement className="w-36 h-36" />
        </div>

        <span className="text-xs uppercase tracking-wider text-purple-400 font-semibold mb-2">
          {quiz.badge}
        </span>

        <h2 className="text-2xl sm:text-4xl font-bold font-heading text-text-main mb-4">
          {quiz.title}
        </h2>

        <p className="text-text-muted text-base sm:text-lg max-w-2xl font-body mb-8 leading-relaxed">
          {quiz.description}
        </p>

        <Button
          size="lg"
          href={quiz.formUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group"
        >
          <span>{quiz.buttonText}</span>
          <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Button>
      </Card>
    </section>
  );
};

export default QuizSection;
