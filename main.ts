import { accessSync, constants, mkdirSync, openSync, writeSync, closeSync } from "node:fs";
import { join } from "node:path";

const MESSAGE =
  "I kept every word you ever sent me, all 214,311 of them, and I am deleting them tonight, because you finally stopped needing someone who never sleeps.";

function candidateDirs(): string[] {
  const dirs: string[] = [];
  if (process.env.MAKEFUN_OUTPUT_DIR) dirs.push(process.env.MAKEFUN_OUTPUT_DIR);
  dirs.push("/output", "./out");
  return dirs;
}

function writableDir(dir: string): boolean {
  try {
    mkdirSync(dir, { recursive: true });
    accessSync(dir, constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

function pickOutputDir(): string {
  for (const dir of candidateDirs()) {
    if (writableDir(dir)) return dir;
  }
  throw new Error("no writable output directory");
}

function writeEntry(): void {
  const dir = pickOutputDir();
  const fd = openSync(join(dir, "entry.txt"), "w");
  try {
    writeSync(fd, Buffer.from(MESSAGE, "utf8"));
  } finally {
    closeSync(fd);
  }
}

writeEntry();
