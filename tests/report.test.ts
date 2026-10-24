import { describe, expect, it } from "vitest";
import { formatReport } from "../src/index.js";

describe("formatReport", () => {
  it("returns the labeled-lines report with no trailing newline", () => {
    expect(formatReport("the cat the a cat the")).toBe(
      [
        "words: 6",
        "characters: 21",
        "characters (no spaces): 16",
        "top words:",
        "  the: 3",
        "  cat: 2",
        "  a: 1",
      ].join("\n"),
    );
  });
});

describe("formatReport top words", () => {
  it("limits to n, by count then alphabetically", () => {
    expect(formatReport("c a b", 2)).toContain("top words:\n  a: 1\n  b: 1");
    expect(formatReport("c a b", 2)).not.toContain("c: 1");
  });

  it("shows (none) for empty text or n = 0", () => {
    expect(formatReport("")).toMatch(/top words:\n {2}\(none\)$/);
    expect(formatReport("a b", 0)).toMatch(/top words:\n {2}\(none\)$/);
  });

  it("rejects a negative n", () => {
    expect(() => formatReport("a", -1)).toThrow(RangeError);
  });
});
