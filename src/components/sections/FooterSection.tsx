import React from "react";
import { SITE_CONTENT } from "@/config/content";
import { Card } from "@/components/ui/Card";
import { BookOpen, ExternalLink, UserCheck } from "lucide-react";

export const FooterSection: React.FC = () => {
  const { author, references } = SITE_CONTENT;

  return (
    <footer id="creditos" className="border-t border-surface-border bg-surface/50 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-12">
        {/* Bloco do Autor */}
        <Card className="border-purple-500/30 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-purple-300 shrink-0 shadow-glow">
            <UserCheck className="w-8 h-8" />
          </div>
          <div className="text-center sm:text-left">
            <span className="text-xs uppercase tracking-wider text-purple-400 font-semibold">
              Desenvolvimento e Autoria
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-text-main mt-1">
              {author.name}
            </h3>
            <p className="text-purple-300 text-sm font-medium mt-0.5">
              Projeto desenvolvido para a disciplina: <span className="text-text-main font-semibold">{author.course}</span>
            </p>
            <p className="text-text-muted text-sm mt-3 leading-relaxed font-body">
              {author.bio}
            </p>
          </div>
        </Card>

        {/* Referências Recomendadas */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="w-5 h-5 text-purple-400" />
            <h3 className="text-xl font-bold font-heading text-text-main">
              {references.title}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {references.items.map((ref) => (
              <a
                key={ref.id}
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-5 rounded-xl bg-surface border border-surface-border hover:border-purple-500/50 transition-all duration-300 flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-text-main group-hover:text-purple-300 transition-colors text-sm">
                      {ref.title}
                    </h4>
                    <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-purple-300 shrink-0" />
                  </div>
                  <p className="text-xs text-purple-400 mt-1 font-mono">
                    {ref.author} ({ref.year})
                  </p>
                  <p className="text-xs text-text-muted mt-3 leading-relaxed">
                    {ref.description}
                  </p>
                  <span className="sr-only">(abre em nova aba)</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-surface-border pt-8 text-center text-xs text-text-muted">
          <p>© {new Date().getFullYear()} {author.name}. Minicurso EaD - Avaliação Formativa com GitHub.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
