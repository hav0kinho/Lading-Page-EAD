import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import GitCommitGraph3D from "../GitCommitGraph3D";

describe("GitCommitGraph3D", () => {
  it("renderiza o container do canvas sem disparar exceção", () => {
    const { container } = render(<GitCommitGraph3D />);
    expect(container.querySelector("canvas, div")).toBeInTheDocument();
  });
});
