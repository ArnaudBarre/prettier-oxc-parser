#!/usr/bin/env bun
import { Glob } from "bun";
import { readFileSync } from "node:fs";
import { compareCode } from "./compare-code";

const glob = new Glob(process.argv[2] ?? "**/*.ts");

const folder = "../carbon-calculator";
for await (const file of glob.scan(folder)) {
  if (file.startsWith("tmp/")) continue;
  // Too big?
  if (file.endsWith("typescript/lib/lib.dom.d.ts")) continue;
  if (file.endsWith("typescript/lib/lib.webworker.d.ts")) continue;
  console.log(file);
  const code = readFileSync(`${folder}/${file}`, "utf-8");
  const eq = await compareCode(code, file);
  if (!eq) break;
}
