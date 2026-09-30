"use client";

import React from "react";
import dynamic from "next/dynamic";
import { SITE_CONTENT } from "@/config/content";
import { Card } from "@/components/ui/Card";
import { Users, GraduationCap } from "lucide-react";

const FloatingBranches3D = dynamic(() => import("@/components/3d/FloatingBranches3D"), {
  ssr: false,
  loading: () => <div className="absolute inset-0" />,
});

export const IntroSection: React.FC = () => {
  const { intro } = SITE_CONTENT;

  return (
    <section id="sobre" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto overflow-hidden">
      {/* Elemento 3D de fundo sutil */}
      <FloatingBranches3D />

      <div className="relative z-10">
        <div className="text-center mb-14">
          <h2 className="text-2xl sm:text-4xl font-bold font-heading text-text-main">
            {intro.title}
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="flex flex-col gap-4 border-purple-500/20 hover:border-purple-500/50">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-purple-300">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold font-heading text-text-main">
              {intro.targetAudience.title}
            </h3>
            <p className="text-text-muted leading-relaxed font-body">
              {intro.targetAudience.description}
            </p>
          </Card>

          <Card className="flex flex-col gap-4 border-purple-500/20 hover:border-purple-500/50">
            <div className="w-12 h-12 rounded-xl bg-accent-cyan/15 flex items-center justify-center text-cyan-300">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold font-heading text-text-main">
              {intro.prerequisites.title}
            </h3>
            <p className="text-text-muted leading-relaxed font-body">
              {intro.prerequisites.description}
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
