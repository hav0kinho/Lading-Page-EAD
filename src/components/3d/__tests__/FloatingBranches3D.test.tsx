import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import FloatingBranches3D from "../FloatingBranches3D";

describe("FloatingBranches3D", () => {
  it("renderiza o container 3D de branches sem erros", () => {
    const { container } = render(<FloatingBranches3D />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
