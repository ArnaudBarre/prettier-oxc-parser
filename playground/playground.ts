#!/usr/bin/env bun
import { Glob } from "bun";
import { readFileSync, writeFileSync } from "node:fs";
import { format, type Plugin } from "prettier";
import typescriptParser from "prettier/parser-typescript";
import * as plugin from "../src/index.ts";
import { oxcParse, oxcToESTree } from "../src/utils.ts";

const glob = new Glob("**/*.ts");

const defaultPlugin: Plugin = {
  parsers: {
    typescript: {
      ...typescriptParser.parsers.typescript,
      parse: (text, options) => {
        const ast = typescriptParser.parsers.typescript.parse(text, options);
        delete ast.tokens;
        writeFileSync("tmp/default-ast.json", JSON.stringify(ast, null, 2));
        return ast;
      },
    },
  },
};

for await (const file of glob.scan("..")) {
  if (file === "node_modules/typescript/lib/lib.dom.d.ts") continue;
  if (file === "node_modules/typescript/lib/lib.webworker.d.ts") continue;
  console.log(file);

  const code = readFileSync(file, "utf-8");

  const ast = oxcParse(code, { sourceFilename: file });
  writeFileSync("tmp/ast.json", JSON.stringify(ast, null, 2));
  oxcToESTree(ast);
  writeFileSync("tmp/ast-updated.json", JSON.stringify(ast, null, 2));

  const withoutPlugin = await format(code, {
    filepath: "example.ts",
    plugins: [defaultPlugin],
  });
  writeFileSync("tmp/without-plugin.ts", withoutPlugin);
  const withPlugin = await format(code, {
    filepath: "example.ts",
    plugins: [plugin],
  });
  writeFileSync("tmp/with-plugin.ts", withPlugin);
  if (withPlugin !== withoutPlugin) {
    console.log("❌");
    break;
  } else {
    console.log("✅");
  }
}
