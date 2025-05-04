import { writeFileSync } from "node:fs";
import { format } from "prettier";
import * as plugin from "../src/index.ts";
import { oxcParse } from "../src/oxcParse.ts";
import { compareAst } from "./compare-ast.ts";
import { defaultPlugin } from "./defaultPlugin.ts";
import { readJson, saveJson } from "./json.ts";
import { execSync } from "node:child_process";

export const compareCode = async (code: string, filename: string) => {
  let withDefaultPlugin: string;
  try {
    withDefaultPlugin = await format(code, {
      filepath: filename,
      plugins: [defaultPlugin],
    });
  } catch {
    console.log("Can't parse code");
    // If the code is not parsable, we can't compare it
    return true;
  }
  writeFileSync("tmp/default-plugin.ts", withDefaultPlugin);

  const withOxcPlugin = await format(code, {
    filepath: filename,
    plugins: [plugin],
  });
  writeFileSync("tmp/oxc-plugin.ts", withOxcPlugin);

  if (withOxcPlugin === withDefaultPlugin) return true;

  console.log("❌");
  try {
    execSync(
      `git diff --no-index --word-diff tmp/oxc-plugin.ts tmp/default-plugin.ts`,
      { stdio: "inherit" },
    );
  } catch {}
  saveJson("oxc-ast-updated", oxcParse(code, filename));
  compareAst(readJson("oxc-ast-updated"), readJson("default-ast"));

  return false;
};
