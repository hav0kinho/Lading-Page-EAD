import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { HeroSection } from "../HeroSection";
import { SITE_CONTENT } from "@/config/content";

describe("HeroSection", () => {
  it("renderiza título, subtítulo e botão CTA com conteúdo correto", () => {
    render(<HeroSection />);
    expect(screen.getByText(SITE_CONTENT.hero.badge)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(SITE_CONTENT.hero.title);
    expect(screen.getByText(SITE_CONTENT.hero.subtitle)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: SITE_CONTENT.hero.ctaText })).toBeInTheDocument();
  });

  it("renderiza o botão CTA com link âncora para navegação suave", () => {
    render(<HeroSection />);
    const ctaLink = screen.getByRole("link", { name: SITE_CONTENT.hero.ctaText });
    expect(ctaLink).toHaveAttribute("href", `#${SITE_CONTENT.hero.ctaTargetId}`);
  });
});
