#!/usr/bin/env bun
import { Glob } from "bun";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { format } from "prettier";
import { oxcParse } from "../src/oxcParse.ts";
import { compareAst } from "./compare-ast.ts";
import { defaultPlugin } from "./defaultPlugin.ts";
import { readJson, saveJson } from "./json.ts";

const glob = new Glob(process.argv[2] ?? "**/*.{ts,tsx}");

const currentState = existsSync("tmp/files.json")
  ? JSON.parse(readFileSync("tmp/files.json", "utf-8"))
  : { nodeModules: [], otherFiles: [], skipFiles: {} };

const nodeModules = new Set<string>(currentState.nodeModules);
const otherFiles = new Set<string>(currentState.otherFiles);
const skipFiles = currentState.skipFiles;
const initialCount = nodeModules.size + otherFiles.size;

const save = () => {
  saveJson("files", {
    nodeModules: [...nodeModules],
    otherFiles: [...otherFiles],
    skipFiles,
  });
};

const shouldSkip = (node: any) => {
  if (!node) return false;

  if (node.type === "TSEnumMember" && node.computed)
    return "TSEnumMember computed";
  if (node.type === "TSImportType") return "TSImportType"; // https://github.com/oxc-project/oxc/issues/9663
  if (node.type === "AssignmentPattern" && node.decorators?.length)
    return "AssignmentPattern decorators"; // https://github.com/typescript-eslint/typescript-eslint/issues/10937
  if (
    node.type === "JSXExpressionContainer" &&
    node.expression.type === "SequenceExpression"
  ) {
    // Invalid for OXC because invalid for TS https://github.com/microsoft/TypeScript/issues/5991#issuecomment-162960046
    return "JSXExpressionContainer SequenceExpression";
  }
  if (
    node.type === "ExportNamedDeclaration" &&
    node.declaration?.type === "ClassDeclaration" &&
    node.declaration.decorators?.length
  ) {
    // https://github.com/estree/estree/issues/315
    return "ExportNamedDeclaration ClassDeclaration decorators";
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

const folder = "..";
let count = 0;
for await (const file of glob.scan(folder)) {
  const nodeModulePath = file.split("node_modules/").at(-1);
  if (nodeModulePath) {
    if (nodeModules.has(nodeModulePath)) continue;
  } else {
    if (otherFiles.has(file)) continue;
  }
  const add = (file: string) => {
    if (nodeModulePath) {
      nodeModules.add(nodeModulePath);
    } else {
      otherFiles.delete(file);
    }
  };
  console.log(file);
  let code = readFileSync(`${folder}/${file}`, "utf-8");
  if (code.charAt(0) === "\uFEFF") code = code.slice(1); // Remove BOM
  if (code.includes("\r")) {
    // Internally prettier does remove \r, it's simpler to compare the code without them
    // https://github.com/prettier/prettier/blob/529095ac88a1e741f7542b6215cb653b93eda462/src/main/core.js#L284
    code = code.replaceAll("\r", "");
  }
  if (
    code.trim() === "" || // Prettier skip plugin call on empty file
    file.includes("fail/oxc")
  ) {
    add(file);
    continue;
  }

  try {
    writeFileSync("tmp/code.ts", code);
    try {
      await format(code, { filepath: file, plugins: [defaultPlugin] });
    } catch (e) {
      // Ignore file with syntax error
      add(file);
      continue;
    }
    const defaultAST = readJson("default-ast");
    const skip = shouldSkip(defaultAST);
    if (skip) {
      console.log(`skip ${file} ${skip}`);
      skipFiles[file] = skip;
      continue;
    }
    const ast = oxcParse(code, file, true);
    saveJson("ast-updated", ast);
    compareAst(readJson("ast-updated"), defaultAST);
    add(file);
    count++;
  } catch (e) {
    console.log(e);
    save();
    process.exit(1);
  }
}

save();
console.log(`Checked ${initialCount + count} files (${count} new)`);
