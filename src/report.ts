import { charCount, topWords, wordCount } from "./stats.ts";

/** A plain-text summary of `text`: counts plus its `n` most frequent words. */
export function formatReport(text: string, n = 3): string {
  const top = topWords(text, n).map(([word, count]) => `  ${word}: ${count}`);
  return [
    `words: ${wordCount(text)}`,
    `characters: ${charCount(text)}`,
    `characters (no spaces): ${charCount(text, false)}`,
    "top words:",
    ...(top.length > 0 ? top : ["  (none)"]),
  ].join("\n");
}
