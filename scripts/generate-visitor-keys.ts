#!/usr/bin/env bun
import { readFileSync, writeFileSync } from "node:fs";
import { visitorKeys } from "@typescript-eslint/visitor-keys";

const path = "./src/visitor-keys.ts";
const content = `/*!*
 * This file is generated by scripts/generate-visitor-keys.ts using
 * - @typescript-eslint/visitor-keys under @license MIT https://github.com/typescript-eslint/typescript-eslint/blob/main/LICENSE
 * - eslint-visitor-keys under @license Apache 2.0 https://github.com/eslint/eslint-visitor-keys/blob/main/LICENSE
 */
// prettier-ignore
export const visitorKeys: Record<string, string[] | undefined> = {
${Object.entries(visitorKeys)
  .filter(([, v]) => v?.length)
  .concat([["ParenthesizedExpression", ["expression"]]])
  .map(([k, v]) => `  ${k}: [${v!.map((v) => `"${v}"`).join(", ")}],`)
  .join("\n")}
};
`;

if (process.argv.includes("--check")) {
  const current = readFileSync(path, "utf-8");
  if (current !== content) {
    console.error("visitor-keys.ts is out of date");
    process.exit(1);
  }
} else {
  writeFileSync(path, content);
}
