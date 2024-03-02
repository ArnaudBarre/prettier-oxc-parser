#!/usr/bin/env bun
import { Glob } from "bun";
import { readFileSync } from "node:fs";
import { compareCode } from "./compare-code";

const glob = new Glob("**/*.ts");

for await (const file of glob.scan(".")) {
  if (file === "node_modules/typescript/lib/lib.dom.d.ts") continue;
  if (file === "node_modules/typescript/lib/lib.webworker.d.ts") continue;
  console.log(file);
  const code = readFileSync(file, "utf-8");
  const eq = await compareCode(code, file);
  if (!eq) break;
}
