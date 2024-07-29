import { fixtures } from "@fig2tw/shared";
import { describe, it, vi } from "vitest";
import { configure } from "./configure.js";
import { configOf } from "./config.js";
import { formattersOf } from "./formatters.js";
import { expect } from "vitest";

const options = {
  config: configOf(),
  formatters: formattersOf(),
  buildCssBundle: vi.fn(),
  buildTwConfig: vi.fn(),
};

describe("configure", () => {
  it("should return empty configs when selector is undefined", () => {
    const result = configure("unknown", fixtures.variables, undefined, options);
    expect(result).toStrictEqual({ cssBundle: {}, twConfig: {} });
  });

  it("should build twConfig based on selected object", () => {
    options.buildTwConfig.mockReturnValue({ result: "foo" });

    const result = configure(
      "unknown",
      fixtures.variables,
      it => it.types,
      options,
    );

    expect(result.twConfig).toStrictEqual({ result: "foo" });
    expect(options.buildTwConfig).toHaveBeenCalledWith(
      "unknown",
      fixtures.variables.types,
      expect.anything(),
    );
  });

  it("should build cssBundle based on selected object", () => {
    options.buildCssBundle.mockReturnValue({ result: "foo" });

    const result = configure(
      "unknown",
      fixtures.variables,
      it => it.types,
      options,
    );

    expect(result.cssBundle).toStrictEqual({ result: "foo" });
    expect(options.buildCssBundle).toHaveBeenCalledWith(
      "unknown",
      fixtures.variables,
      fixtures.variables.types,
      expect.anything(),
    );
  });
});
