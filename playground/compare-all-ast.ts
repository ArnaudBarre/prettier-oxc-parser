#!/usr/bin/env bun
import { Glob } from "bun";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { format } from "prettier";
import { oxcParse } from "../src/oxcParse.ts";
import { compareAst } from "./compare-ast.ts";
import { defaultPlugin } from "./defaultPlugin.ts";
import { saveJson } from "./saveJSON.ts";

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
  const code = readFileSync(`${folder}/${file}`, "utf-8");
  if (
    // https://github.com/oxc-project/oxc/issues/9619
    code.includes("\r") ||
    // https://github.com/estree/estree/issues/315
    file.endsWith("JSHandle.ts") ||
    file.endsWith("oxc-2562.ts") ||
    // Syntax error in the file
    file.endsWith("protocol-tests-proxy-api.d.ts") ||
    // Invlaid comma expression in JSXContainer
    file.endsWith("jsx-tag-evaluation-order.tsx") ||
    // https://github.com/typescript-eslint/typescript-eslint/issues/10937
    file.endsWith("decorators/parameter.ts") ||
    file.endsWith("decorators/parameter-property.ts") ||
    // https://github.com/oxc-project/oxc/issues/9663
    file.endsWith("oxc-2394.ts") ||
    // Prettier skip default plugin call
    code.trim() === ""
  ) {
    add(file);
    continue;
  }

  try {
    writeFileSync("tmp/code.ts", code);
    await format(code, { filepath: file, plugins: [defaultPlugin] });
    const ast = oxcParse(code, file, true);
    saveJson("ast-updated", ast);
    compareAst(ast);
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
