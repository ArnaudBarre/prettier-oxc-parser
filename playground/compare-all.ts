#!/usr/bin/env bun
import { Glob } from "bun";
import { existsSync, readFileSync } from "node:fs";
import { compareCode } from "./compare-code.ts";
import { saveJson } from "./json.ts";

const glob = new Glob(process.argv[2] ?? "**/*.{ts,tsx}");

const currentState = existsSync("tmp/files.json")
  ? JSON.parse(readFileSync("tmp/files.json", "utf-8"))
  : { nodeModules: [], otherFiles: [] };

const nodeModules = new Set<string>(currentState.nodeModules);
const otherFiles = new Set<string>(currentState.otherFiles);
const initialCount = nodeModules.size + otherFiles.size;

const save = () => {
  saveJson("files", {
    nodeModules: [...nodeModules],
    otherFiles: [...otherFiles],
  });
};

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
  let eq = false;
  let hasParsingError = false;
  try {
    eq = await compareCode(code, file, process.argv[2] !== undefined);
  } catch (e) {
    console.log(e);
    hasParsingError = true;
  }
  if (hasParsingError) continue;
  if (eq) {
    count++;
    if (nodeModulePath) {
      nodeModules.add(nodeModulePath);
    } else {
      otherFiles.delete(file);
    }
  } else {
    save();
    process.exit(1);
  }
}

save();
console.log(`Checked ${initialCount + count} files (${count} new)`);
