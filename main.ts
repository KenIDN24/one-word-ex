import * as fs from "node:fs";
import * as path from "node:path";

const WORD = "Houseguest";

const outDir = process.env.OUTPUT_DIR ?? "/output";
const entry = WORD;

if (entry.length < 1 || entry.length > 24) {
  throw new Error(`entry length ${entry.length} outside gate 1-24`);
}
if (entry.trim() !== entry) throw new Error("entry has leading/trailing whitespace");
if (/\s/.test(entry)) throw new Error("entry must be exactly one word (no whitespace)");
if (!/^[A-Za-z]+$/.test(entry)) throw new Error("entry must be ASCII letters only");
// A real word needs a vowel: reject consonant-only blobs.
if (!/[aeiouAEIOU]/.test(entry)) throw new Error("entry must contain a vowel");
// One-word entries are capitalised: reject a lower-case first letter.
if (entry[0] !== entry[0].toUpperCase()) throw new Error("entry must start with a capital letter");

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "entry.txt"), entry, "utf8");

// Round-trip check: the file must read back byte-identical to the word.
const back = fs.readFileSync(path.join(outDir, "entry.txt"), "utf8");
if (back !== entry) throw new Error("round-trip mismatch");
console.log(`entry ok: ${entry.length} chars`);
