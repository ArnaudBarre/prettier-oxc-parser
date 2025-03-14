import { $ } from "bun";
import { writeFileSync } from "node:fs";
import { format } from "prettier";
import * as plugin from "../src/index.ts";
import { oxcParse } from "../src/oxcParse.ts";
import { compareAst } from "./compare-ast.ts";
import { defaultPlugin } from "./defaultPlugin.ts";
import { saveJson } from "./saveJSON.ts";

export const compareCode = async (
  code: string,
  filename: string,
  forceCompareAst?: boolean,
) => {
  const ast = oxcParse(code, filename, true);
  saveJson("ast-updated", ast);

  const withoutPlugin = await format(code, {
    filepath: filename,
    plugins: [defaultPlugin],
  });
  writeFileSync("tmp/without-plugin.ts", withoutPlugin);
  try {
    const withPlugin = await format(code, {
      filepath: filename,
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
      return true;
    }
  } catch (e) {
    console.log("❌");
    console.log(e);
    compareAst(ast);
    return false;
  }
};
