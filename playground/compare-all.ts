#!/usr/bin/env node
import { globSync, statSync } from "node:fs";
import { existsSync, readFileSync } from "node:fs";
import { compareCode } from "./compare-code.ts";
import { saveJson } from "./json.ts";

const currentState: {
  skipped: Record<string, number | undefined>;
  done: string[];
  remaining: string[];
} = existsSync("tmp/files.json")
  ? JSON.parse(readFileSync("tmp/files.json", "utf-8"))
  : (() => {
      const nodeModules = new Set<string>();
      const remaining: string[] = [];
      for (const file of globSync("../**/*.{ts,tsx}")) {
        const isNodeModule = file.includes("node_modules/");
        const nodeModulePath = file.split("node_modules/").at(-1)!;
        if (isNodeModule) {
          if (nodeModules.has(nodeModulePath)) continue;
          nodeModules.add(nodeModulePath);
          remaining.push(file);
        } else {
          remaining.push(file);
        }
      }
      return { skipped: {}, done: [], remaining };
    })();

const initialCount = currentState.done.length;

const save = () => {
  saveJson("files", currentState);
};

const shouldSkip = (node: any): string | false => {
  if (!node) return false;

  if (
    node.type === "TSModuleDeclaration" &&
    node.id?.type === "TSQualifiedName"
  ) {
    // declare namespace firebase.app {}
    return "TSModuleDeclaration.TSQualifiedName";
  }
  if (
    node.type === "TSModuleDeclaration" &&
    node.body?.type === "TSModuleDeclaration"
  ) {
    // declare module abc.def.ghi {}
    return "TSModuleDeclaration.TSModuleDeclaration";
  }
  if (node.type === "AccessorProperty" && (node.declare || node.readonly)) {
    // https://github.com/oxc-project/oxc/issues/10837
    // class Foo { declare accessor foo; }
    return "declare accessor";
  }
  if (
    node.type === "BinaryExpression" &&
    node.operator === "in" &&
    node.left.type === "PrivateIdentifier"
  ) {
    // https://github.com/oxc-project/oxc/issues/10839
    // #name in other && true
    return "PrivateIdentifier in";
  }
  if (
    node.type === "CallExpression" &&
    node.callee.type === "Identifier" &&
    node.callee.name === "await"
  ) {
    // https://github.com/oxc-project/oxc/issues/10840
    // await(0)
    return "await as call expression";
  }

  for (const key in node) {
    if (typeof node[key] !== "object") continue;
    if (Array.isArray(node[key])) {
      for (const item of node[key]) {
        if (shouldSkip(item)) return shouldSkip(item);
      }
    } else if (shouldSkip(node[key])) {
      return shouldSkip(node[key]);
    }
  }
  return false;
};

for (const file of currentState.remaining.slice()) {
  console.log(file);
  try {
    if (statSync(file).isFile()) {
      const eq = await compareCode(
        readFileSync(file, "utf-8"),
        file,
        shouldSkip,
      );
      if (eq === false) throw new Error("Not equal");
      if (typeof eq === "string") {
        currentState.skipped[eq] ??= 0;
        currentState.skipped[eq]++;
      } else {
        currentState.done.push(file);
      }
    }
    currentState.remaining.splice(0, 1);
  } catch (error) {
    console.error(error);
    save();
    process.exit(1);
  }
}

save();
const newCount = currentState.done.length;
console.log(`Checked ${newCount} files (${newCount - initialCount} new)`);
