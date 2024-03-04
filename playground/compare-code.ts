import { $ } from "bun";
import { writeFileSync } from "node:fs";
import { format } from "prettier";
import * as plugin from "../src/index";
import { oxcParse, oxcToESTree } from "../src/utils";
import { compareAst } from "./compare-ast";
import { defaultPlugin } from "./defaultPlugin";

export const compareCode = async (
  code: string,
  filename: string,
  forceCompareAst?: boolean,
) => {
  const ast = oxcParse(code, filename);
  writeFileSync("tmp/ast.json", JSON.stringify(ast, null, 2));
  oxcToESTree(ast);
  writeFileSync("tmp/ast-updated.json", JSON.stringify(ast, null, 2));

  const withoutPlugin = await format(code, {
    filepath: "example.ts",
    plugins: [defaultPlugin],
  });
  writeFileSync("tmp/without-plugin.ts", withoutPlugin);
  try {
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
    } else if (forceCompareAst) {
      compareAst(ast);
      return true;
    } else {
      console.log("✅");
      return true;
    }
  } catch (e) {
    console.log("❌");
    console.log(e);
    compareAst(ast);
    return false;
  }
};
