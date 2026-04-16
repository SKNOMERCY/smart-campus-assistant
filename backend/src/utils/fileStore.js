import { readFile, writeFile } from "node:fs/promises";

export async function readJsonFile(fileUrl) {
  const raw = await readFile(fileUrl, "utf-8");
  return JSON.parse(raw);
}

export async function writeJsonFile(fileUrl, value) {
  const content = `${JSON.stringify(value, null, 2)}\n`;
  await writeFile(fileUrl, content, "utf-8");
}
