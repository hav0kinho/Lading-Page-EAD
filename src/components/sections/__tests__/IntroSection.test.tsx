import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { IntroSection } from "../IntroSection";
import { SITE_CONTENT } from "@/config/content";

describe("IntroSection", () => {
  it("renderiza o público-alvo e conhecimentos prévios", () => {
    render(<IntroSection />);
    expect(screen.getByText(SITE_CONTENT.intro.targetAudience.title)).toBeInTheDocument();
    expect(screen.getByText(SITE_CONTENT.intro.prerequisites.title)).toBeInTheDocument();
  });
});
