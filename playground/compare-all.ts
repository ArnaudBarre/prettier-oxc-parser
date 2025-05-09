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

const shouldSkip = (node: any, isJS: boolean): string | false => {
  if (!node) return false;

  if (
    node.type === "TSModuleDeclaration" &&
    node.id?.type === "TSQualifiedName"
  ) {
    // https://github.com/oxc-project/oxc/issues/10901
    // declare namespace firebase.app {}
    return "TSModuleDeclaration.TSQualifiedName";
  }
  if (
    node.type === "TSModuleDeclaration" &&
    node.body?.type === "TSModuleDeclaration"
  ) {
    // https://github.com/oxc-project/oxc/issues/10901
    // But bundled TS-ESLint still outputs TSModuleDeclaration instead of TSQualifiedName
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

  if (isJS) {
    if (
      node.type === "Program" &&
      node.comments.some(
        (c: any) => c.value.includes("@flow") || c.value.includes("@noflow"),
      )
    ) {
      // Babel does some redirect to the flow parser that I'm not sure we can do as a plugin
      return "Flow";
    }
    if (node.decorators?.length) {
      // https://github.com/oxc-project/oxc/issues/10921
      return "decorators";
    }
    if (node.directives?.some((it: any) => it.value.value === "")) {
      // https://github.com/prettier/prettier/issues/17458
      return "Empty directive";
    }
    if (
      (node.type === "ImportDeclaration" || node.type === "ImportExpression") &&
      node.phase === "source"
    ) {
      // Stage 2.7
      return "Defered import evaluataion";
    }
  }

  for (const key in node) {
    if (typeof node[key] !== "object") continue;
    if (Array.isArray(node[key])) {
      for (const item of node[key]) {
        if (shouldSkip(item, isJS)) return shouldSkip(item, isJS);
      }
    } else if (shouldSkip(node[key], isJS)) {
      return shouldSkip(node[key], isJS);
    }
  }
  return false;
};
const skipFiles = [
  // https://github.com/prettier/prettier/issues/17457
  "monaco-editor/min/vs/editor/editor.main.js",
  // Weird comment handling around class method, not reported to Prettier
  // Minimal repro: class Foo {bar(/* Comment */\n) {}}
  "markdown-it/dist/markdown-it.js",
];

for (const file of currentState.remaining.slice()) {
  console.log(file);
  try {
    if (statSync(file).isFile()) {
      const eq = skipFiles.some((p) => file.endsWith(p))
        ? "Block list"
        : await compareCode(readFileSync(file, "utf-8"), file, (node) =>
            shouldSkip(node, file.endsWith(".js") || file.endsWith(".jsx")),
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
