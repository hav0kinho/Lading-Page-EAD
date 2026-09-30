import React from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { IntroSection } from "@/components/sections/IntroSection";
import { ObjectivesSection } from "@/components/sections/ObjectivesSection";
import { VideoSection } from "@/components/sections/VideoSection";
import { QuizSection } from "@/components/sections/QuizSection";
import { FooterSection } from "@/components/sections/FooterSection";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <HeroSection />
      <IntroSection />
      <ObjectivesSection />
      <VideoSection />
      <QuizSection />
      <FooterSection />
    </main>
  );
}
