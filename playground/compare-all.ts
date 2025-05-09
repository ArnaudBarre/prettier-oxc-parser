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
  if (
    node.type === "AssignmentExpression" &&
    node.left.type === "ObjectExpression"
  ) {
    // https://github.com/oxc-project/oxc/issues/10899
    // ({}) = x
    return "Invalid left-hand side in assignment";
  }
  if (node.type === "Block" && node.value.includes("@type")) {
    // Keeping same bahaviour as Babel for would requires keeping parenthesis expressions
    // and then ommiting them expect when a comment is attached to an ansestor.
    // This could be done later on.
    return "Type cast comment";
  }
  if (node.type === "Program" && node.comments.at(0)?.value.includes("@flow")) {
    return "Flow";
  }
  if (node.type === "ClassProperty" && node.decorators?.length) {
    return "ClassProperty.decorators";
  }
  if (node.directives?.some((it: any) => it.value.value === "")) {
    return "Empty directive";
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
        : await compareCode(readFileSync(file, "utf-8"), file, shouldSkip);
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
