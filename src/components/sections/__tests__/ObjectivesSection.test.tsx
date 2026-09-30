import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ObjectivesSection } from "../ObjectivesSection";
import { SITE_CONTENT } from "@/config/content";

describe("ObjectivesSection", () => {
  it("renderiza os 4 objetivos de aprendizagem com seus títulos", () => {
    render(<ObjectivesSection />);
    expect(screen.getByRole("heading", { name: SITE_CONTENT.objectives.title })).toBeInTheDocument();
    SITE_CONTENT.objectives.items.forEach((item) => {
      expect(screen.getByText(item.title)).toBeInTheDocument();
    });
  });
});
