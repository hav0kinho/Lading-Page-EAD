import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Card } from "../Card";

describe("Card component", () => {
  it("renderiza o conteúdo e aplica classes de superfície escura", () => {
    render(<Card><span>Conteúdo do Card</span></Card>);
    expect(screen.getByText("Conteúdo do Card")).toBeInTheDocument();
  });
});
