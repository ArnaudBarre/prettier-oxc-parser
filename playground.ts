#!/usr/bin/env tnode
import { format } from "prettier";
import * as plugin from "./index.ts";
import { readFileSync, writeFileSync } from "node:fs";
import { oxcParse, oxcToESTree } from "./utils.ts";

const code = readFileSync(
  "node_modules/@typescript-eslint/types/dist/generated/ast-spec.d.ts",
  "utf-8",
);

const ast = oxcParse(code, { sourceFilename: "playground.ts" });
writeFileSync("tmp/ast.json", JSON.stringify(ast, null, 2));
oxcToESTree(ast);
writeFileSync("tmp/ast-updated.json", JSON.stringify(ast, null, 2));

writeFileSync(
  "tmp/with-plugin.ts",
  await format(code, { filepath: "example.ts", plugins: [plugin] }),
);
writeFileSync(
  "tmp/without-plugin.ts",
  await format(code, { filepath: "example.ts" }),
);
