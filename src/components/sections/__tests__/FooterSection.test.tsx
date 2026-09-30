import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FooterSection } from "../FooterSection";
import { SITE_CONTENT } from "@/config/content";

describe("FooterSection", () => {
  it("renderiza o nome do autor, disciplina e lista de referências", () => {
    render(<FooterSection />);
    expect(screen.getByRole("heading", { name: SITE_CONTENT.author.name })).toBeInTheDocument();
    expect(screen.getByText(new RegExp(SITE_CONTENT.author.course, "i"))).toBeInTheDocument();

    SITE_CONTENT.references.items.forEach((ref) => {
      expect(screen.getByText(ref.title)).toBeInTheDocument();
    });
  });
});
