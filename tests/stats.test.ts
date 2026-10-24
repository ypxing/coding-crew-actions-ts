import { describe, expect, it } from "vitest";
import { charCount, topWords, wordCount, words } from "../src/index.js";

describe("stats", () => {
  it("splits and lowercases words", () => {
    expect(words("The cat, the HAT!")).toEqual(["the", "cat", "the", "hat"]);
  });

  it("counts words", () => {
    expect(wordCount("one two  three")).toBe(3);
    expect(wordCount("")).toBe(0);
  });

  it("counts characters with and without whitespace", () => {
    expect(charCount("a b\tc")).toBe(5);
    expect(charCount("a b\tc", false)).toBe(3);
  });

  it("orders top words by count, then alphabetically", () => {
    expect(topWords("b a b c a b", 2)).toEqual([["b", 3], ["a", 2]]);
    expect(topWords("c a b", 2)).toEqual([["a", 1], ["b", 1]]);
  });

  it("rejects a negative n", () => {
    expect(() => topWords("a", -1)).toThrow(RangeError);
  });
});
