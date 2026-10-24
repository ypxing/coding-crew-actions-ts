/** Word and character statistics for a string of text. */

/** The text's words: runs of letters, digits and apostrophes, lowercased. */
export function words(text: string): string[] {
  return text.toLowerCase().match(/[\p{L}\p{N}']+/gu) ?? [];
}

export function wordCount(text: string): number {
  return words(text).length;
}

export function charCount(text: string, includeSpaces = true): number {
  return includeSpaces ? text.length : text.replace(/\s/g, "").length;
}

/** The `n` most frequent words as [word, count], by count descending, then alphabetically. */
export function topWords(text: string, n = 3): [string, number][] {
  if (n < 0) throw new RangeError("n must be >= 0");
  const counts = new Map<string, number>();
  for (const w of words(text)) counts.set(w, (counts.get(w) ?? 0) + 1);
  return [...counts]
    .sort(([a, x], [b, y]) => y - x || (a < b ? -1 : a > b ? 1 : 0))
    .slice(0, n);
}
