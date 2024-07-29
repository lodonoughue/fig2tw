import { describe, it } from "vitest";
import { gridSystemOf } from "./grid.js";
import { expect } from "vitest";

describe("gridSystemOf", () => {
  it("should return undefined when nothing is configured", () => {
    const result = gridSystemOf();
    expect(result).toBeUndefined();
  });

  it("should provide defaults based on Tailwind CSS default design system", () => {
    const result = gridSystemOf({});
    expect(result).toStrictEqual({
      unitPx: 4,
      maxUnit: expect.any(Number),
    });
  });
});
