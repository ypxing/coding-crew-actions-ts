import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { main } from "../src/cli.js";
import { formatReport } from "../src/index.js";

function fake() {
  const out: string[] = [];
  const err: string[] = [];
  const io = {
    stdout: { write: (s: string) => (out.push(s), true) },
    stderr: { write: (s: string) => (err.push(s), true) },
  } as unknown as Parameters<typeof main>[1];
  return { io, out: () => out.join(""), err: () => err.join("") };
}

async function tempFile(text: string): Promise<string> {
  const file = join(await mkdtemp(join(tmpdir(), "textstats-")), "in.txt");
  await writeFile(file, text, "utf8");
  return file;
}

const TEXT = "the cat the a cat the";

describe("main", () => {
  it("prints the report plus a newline and returns 0", async () => {
    const f = fake();
    expect(main([await tempFile(TEXT)], f.io)).toBe(0);
    expect(f.out()).toBe(formatReport(TEXT) + "\n");
    expect(f.err()).toBe("");
  });

  it("--top 2 limits the top words", async () => {
    const f = fake();
    expect(main([await tempFile(TEXT), "--top", "2"], f.io)).toBe(0);
    expect(f.out()).toBe(formatReport(TEXT, 2) + "\n");
    expect(f.out()).not.toContain("a: 1");
  });

  it("reports a missing file on stderr and returns 1", () => {
    const f = fake();
    expect(main(["/nonexistent/file.txt"], f.io)).toBe(1);
    expect(f.err()).toMatch(/^textstats: error: .+\n$/);
    expect(f.out()).toBe("");
  });

  it.each([["-1"], ["x"], ["1.5"]])("--top %s is a usage error, file unread", (top) => {
    const f = fake();
    expect(main(["/nonexistent/file.txt", "--top", top], f.io)).toBe(2);
    expect(f.err()).toMatch(/usage/i);
    expect(f.err()).not.toContain("error: ENOENT");
    expect(f.out()).toBe("");
  });

  it("returns 2 on a missing FILE or unknown option", () => {
    expect(main([], fake().io)).toBe(2);
    expect(main(["--bogus"], fake().io)).toBe(2);
  });
});

describe("npm run report", () => {
  it("prints the report", async () => {
    const file = await tempFile(TEXT);
    const out = execFileSync("npm", ["run", "--silent", "report", "--", file], { encoding: "utf8" });
    expect(out).toBe(formatReport(TEXT) + "\n");
  });
});
