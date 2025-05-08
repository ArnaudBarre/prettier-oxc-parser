import { writeFileSync } from "node:fs";
import { format } from "prettier";
import * as plugin from "../src/index.ts";
import { oxcParse } from "../src/oxcParse.ts";
import { compareAst } from "./compare-ast.ts";
import { defaultPlugin } from "./defaultPlugin.ts";
import { readJson, saveJson } from "./json.ts";
import { execSync } from "node:child_process";

export const compareCode = async (
  code: string,
  filename: string,
  shouldSkip?: (node: any) => string | false,
): Promise<boolean | string> => {
  let withDefaultPlugin: string;
  try {
    withDefaultPlugin = await format(code, {
      filepath: filename,
      plugins: [defaultPlugin],
    });
    if (shouldSkip) {
      const skipReason = shouldSkip(readJson("default-ast"));
      if (skipReason) return skipReason;
    }
  } catch {
    return "TS can't parse code";
  }

  let withOxcPlugin: string;
  try {
    withOxcPlugin = await format(code, {
      filepath: filename,
      plugins: [plugin],
    });
  } catch {
    return "Oxc can't parse code";
  }

  const eq = withOxcPlugin === withDefaultPlugin;
  if (eq && shouldSkip) return true;

  writeFileSync("tmp/default-plugin.ts", withDefaultPlugin);
  writeFileSync("tmp/oxc-plugin.ts", withOxcPlugin);

  if (!eq) {
    console.log("❌");
    try {
      execSync(
        `git diff --no-index --word-diff tmp/oxc-plugin.ts tmp/default-plugin.ts`,
        { stdio: "inherit" },
      );
    } catch {}
  }
  saveJson(
    "oxc-ast-updated",
    // Internally prettier does remove \r, so we need to remove them to compare ast locations
    // https://github.com/prettier/prettier/blob/529095ac88a1e741f7542b6215cb653b93eda462/src/main/core.js#L284
    oxcParse(code.replaceAll("\r", ""), filename),
    (k, v) => {
      if (k === "loc") return undefined;
      return v;
    },
  );
  compareAst(readJson("oxc-ast-updated"), readJson("default-ast"));

  return eq;
};
