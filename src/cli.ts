import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { formatReport } from "./report.ts";

type Writer = { write(chunk: string): unknown };

const USAGE = "usage: report FILE [--top N]";

export function main(
  argv: string[],
  io: { stdout: Writer; stderr: Writer } = { stdout: process.stdout, stderr: process.stderr },
): number {
  let parsed;
  try {
    parsed = parseArgs({
      args: argv,
      options: { top: { type: "string", default: "3" } },
      allowPositionals: true,
    });
  } catch (e) {
    io.stderr.write(`textstats: ${(e as Error).message}\n${USAGE}\n`);
    return 2;
  }
  const [file, ...extra] = parsed.positionals;
  const top = parsed.values.top as string;
  if (file === undefined || extra.length > 0 || !/^\d+$/.test(top)) {
    io.stderr.write(`textstats: ${USAGE}\n`);
    return 2;
  }
  let text: string;
  try {
    text = readFileSync(file, "utf8");
  } catch (e) {
    io.stderr.write(`textstats: error: ${(e as Error).message}\n`);
    return 1;
  }
  io.stdout.write(formatReport(text, Number(top)) + "\n");
  return 0;
}

// Only when run directly, not when imported by tests.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
