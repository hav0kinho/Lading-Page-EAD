import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { QuizSection } from "../QuizSection";
import { SITE_CONTENT } from "@/config/content";

describe("QuizSection", () => {
  it("renderiza botão de avaliação com target blank e rel seguro", () => {
    render(<QuizSection />);
    const button = screen.getByRole("link", { name: new RegExp(SITE_CONTENT.quiz.buttonText, "i") });
    expect(button).toHaveAttribute("href", SITE_CONTENT.quiz.formUrl);
    expect(button).toHaveAttribute("target", "_blank");
    expect(button).toHaveAttribute("rel", "noopener noreferrer");
  });
});
