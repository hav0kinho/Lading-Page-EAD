import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { VideoSection } from "../VideoSection";
import { SITE_CONTENT } from "@/config/content";

describe("VideoSection", () => {
  it("renderiza o player do youtube com iframe acessível e nota de legendas", () => {
    render(<VideoSection />);
    const iframe = screen.getByTitle("YouTube video player");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute("src", SITE_CONTENT.video.youtubeEmbedUrl);
    expect(iframe).toHaveAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    expect(screen.getByText(SITE_CONTENT.video.accessibilityNote)).toBeInTheDocument();

    const directLink = screen.getByRole("link", { name: /Assistir diretamente no YouTube/i });
    expect(directLink).toHaveAttribute("href", SITE_CONTENT.video.youtubeWatchUrl);
  });
});
