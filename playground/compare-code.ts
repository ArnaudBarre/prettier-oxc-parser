import { $ } from "bun";
import { writeFileSync } from "node:fs";
import { format } from "prettier";
import * as plugin from "../src/index";
import { oxcParse, oxcToESTree } from "../src/utils";
import { compareAst } from "./compare-ast";
import { defaultPlugin } from "./defaultPlugin";

export const compareCode = async (code: string, filename: string) => {
  const ast = oxcParse(code, { sourceFilename: filename });
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
    await $`git diff --no-index --word-diff tmp/with-plugin.ts tmp/without-plugin.ts`;
    compareAst(ast);
    return false;
  } else {
    console.log("✅");
    return true;
  }
};
