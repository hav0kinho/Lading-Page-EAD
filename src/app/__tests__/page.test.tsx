import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Home from "../page";

describe("Home Page SPA", () => {
  it("renderiza todas as seções principais da página", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Sobre o Minicurso/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Ao final deste minicurso/i })).toBeInTheDocument();
    expect(screen.getByTitle("YouTube video player")).toBeInTheDocument();
  });
});
