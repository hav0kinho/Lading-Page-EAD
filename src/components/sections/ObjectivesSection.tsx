import React from "react";
import { SITE_CONTENT } from "@/config/content";
import { Card } from "@/components/ui/Card";
import { CheckCircle2, GitCommit, MessageSquareCode, Tags } from "lucide-react";

const icons = [CheckCircle2, GitCommit, MessageSquareCode, Tags];

export const ObjectivesSection: React.FC = () => {
  const { objectives } = SITE_CONTENT;

  return (
    <section id="objetivos" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <span className="text-xs uppercase tracking-wider text-purple-400 font-semibold">
          Competências Desenvolvidas
        </span>
        <h2 className="text-2xl sm:text-4xl font-bold font-heading text-text-main mt-2">
          {objectives.title}
        </h2>
        <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {objectives.items.map((item, index) => {
          const Icon = icons[index % icons.length];
          return (
            <Card
              key={item.id}
              className="group hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-purple-400 mb-5 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold font-heading text-text-main mb-2">
                  {item.title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed font-body">
                  {item.description}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-surface-border text-xs text-purple-400 font-medium">
                Módulo 0{index + 1}
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default ObjectivesSection;
