import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Quiz3DElement from "../Quiz3DElement";

describe("Quiz3DElement", () => {
  it("renderiza o container 3D do quiz sem erros", () => {
    const { container } = render(<Quiz3DElement />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
