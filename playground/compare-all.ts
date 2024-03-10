#!/usr/bin/env bun
import { Glob } from "bun";
import { readFileSync, existsSync } from "node:fs";
import { compareCode } from "./compare-code";
import { saveJson } from "./saveJSON";

const glob = new Glob(process.argv[2] ?? "**/*.tsx");

const currentState = existsSync("tmp/files.json")
  ? JSON.parse(readFileSync("tmp/files.json", "utf-8"))
  : { nodeModules: [], otherFiles: [] };

const nodeModules = new Set<string>(currentState.nodeModules);
const otherFiles = new Set<string>(currentState.otherFiles);
const initialCount = nodeModules.size + otherFiles.size;

const folder = "../carbon-calculator";
let count = 0;
for await (const file of glob.scan(folder)) {
  const nodeModulePath = file.split("node_modules/").at(-1);
  if (nodeModulePath) {
    if (nodeModules.has(nodeModulePath)) continue;
  } else {
    if (otherFiles.has(file)) continue;
  }
  console.log(file);
  const code = readFileSync(`${folder}/${file}`, "utf-8");
  const eq = await compareCode(code, file, process.argv[2] !== undefined);
  if (eq) {
    count++;
    if (nodeModulePath) {
      nodeModules.add(nodeModulePath);
    } else {
      otherFiles.delete(file);
    }
  } else {
    saveJson("files", {
      nodeModules: [...nodeModules],
      otherFiles: [...otherFiles],
    });
    process.exit(1);
  }
}

console.log(`Checked ${initialCount + count} files (${count} new)`);
