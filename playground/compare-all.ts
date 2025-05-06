#!/usr/bin/env node
import { globSync } from "node:fs";
import { existsSync, readFileSync } from "node:fs";
import { compareCode } from "./compare-code.ts";
import { saveJson } from "./json.ts";

const currentState = existsSync("tmp/files.json")
  ? JSON.parse(readFileSync("tmp/files.json", "utf-8"))
  : { nodeModules: [], otherFiles: [] };

const nodeModules = new Set<string>(currentState.nodeModules);
const initialCount = nodeModules.size + currentState.otherFiles.length;

const save = () => {
  saveJson("files", {
    nodeModules: [...nodeModules],
    otherFiles: currentState.otherFiles,
  });
};

let count = 0;
for (const file of globSync("../**/*.{js,jsx,ts,tsx}")) {
  const isNodeModule = file.includes("node_modules/");
  const nodeModulePath = file.split("node_modules/").at(-1)!;
  if (isNodeModule && nodeModules.has(nodeModulePath)) continue;
  console.log(file);
  const eq = await compareCode(readFileSync(file, "utf-8"), file);
  if (eq) {
    count++;
    if (isNodeModule) {
      nodeModules.add(nodeModulePath);
    } else {
      currentState.otherFiles.push(file);
    }
  } else {
    save();
    process.exit(1);
  }
}

save();
console.log(`Checked ${initialCount + count} files (${count} new)`);
