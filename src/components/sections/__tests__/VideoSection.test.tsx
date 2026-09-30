import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { VideoSection } from "../VideoSection";
import { SITE_CONTENT } from "@/config/content";

describe("VideoSection", () => {
  it("renderiza o player do youtube com iframe acessível e nota de legendas", () => {
    render(<VideoSection />);
    const iframe = screen.getByTitle("Player do Minicurso");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute("src", SITE_CONTENT.video.youtubeEmbedUrl);
    expect(screen.getByText(SITE_CONTENT.video.accessibilityNote)).toBeInTheDocument();
  });
});
