import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Button } from "../Button";

describe("Button component", () => {
  it("renderiza o texto e lida com clique", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Clique Aqui</Button>);
    const button = screen.getByRole("button", { name: "Clique Aqui" });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renderiza como link quando fornecido href", () => {
    render(<Button href="https://exemplo.com">Link Externo</Button>);
    const link = screen.getByRole("link", { name: "Link Externo" });
    expect(link).toHaveAttribute("href", "https://exemplo.com");
  });
});
