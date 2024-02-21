#!/usr/bin/env bun
import { Glob } from "bun";
import { readFileSync, writeFileSync } from "node:fs";
import { format } from "prettier";
import * as plugin from "./index.ts";
import { oxcParse, oxcToESTree } from "./utils.ts";

const glob = new Glob("**/*.ts");

for await (const file of glob.scan(".")) {
  console.log(file);

  const code = readFileSync(file, "utf-8");

  const ast = oxcParse(code, { sourceFilename: "playground.ts" });
  writeFileSync("tmp/ast.json", JSON.stringify(ast, null, 2));
  oxcToESTree(ast);
  writeFileSync("tmp/ast-updated.json", JSON.stringify(ast, null, 2));

  writeFileSync(
    "tmp/without-plugin.ts",
    await format(code, { filepath: "example.ts" }),
  );
  writeFileSync(
    "tmp/with-plugin.ts",
    await format(code, { filepath: "example.ts", plugins: [plugin] }),
  );
}
