import assert from "node:assert";
import { readFileSync } from "node:fs";
import type { oxcParse } from "../src/utils.ts";

export const compareAst = (oxc: ReturnType<typeof oxcParse>) => {
  const ts = JSON.parse(readFileSync("tmp/default-ast.json", "utf-8"));
  const check = (a: any, b: any, c?: string) => {
    assert(a === b, `${c ? `${c}: ` : ""}${a} !== ${b}`);
  };

  check(oxc.comments.length, ts.comments.length, "comments.length");
  for (let i = 0; i < oxc.comments.length; i++) {
    const a = oxc.comments[i];
    const b = ts.comments[i];
    check(a.type, b.type, `comments[${i}].type`);
    check(a.value, b.value, `comments[${i}].value`);
    check(a.start, b.start, `comments[${i}].start`);
    check(a.end, b.end, `comments[${i}].end`);
  }

  const cleanTSNode = (node: any) => {
    if (node.type === "Identifier" || node.type === "ObjectPattern") {
      delete node.decorators;
    }
    if (node.type === "ImportSpecifier") {
      delete node.imported.optional;
      delete node.imported.typeAnnotation;
      delete node.local.optional;
      delete node.local.typeAnnotation;
    }
  };

  const compareNodes = (oxc: any, ts: any, c: string) => {
    check(oxc.type, ts.type, c);
    c += `(${oxc.type})`;
    if (oxc.type && oxc.type !== "TemplateElement") {
      // TemplateElement span in TS are contains `${}` chars
      check(oxc.start, ts.start, `${c}.start`);
      check(oxc.end, ts.end, `${c}.end`);
    }
    cleanTSNode(ts);
    const tsKeys = Object.keys(ts)
      .filter((k) => !["type", "start", "end"].includes(k))
      .sort();
    for (const k of tsKeys) {
      let c2 = `${c}.${k}`;
      if (isEmpty(oxc[k]) && isEmpty(ts[k])) continue; // for now don't report diff in undefined/null/false/[]
      check(typeof oxc[k], typeof ts[k], c2);
      if (typeof oxc[k] === "object") {
        if (oxc[k] === null) {
          check(oxc[k], ts[k], c2);
        } else if (Array.isArray(oxc[k])) {
          check("array", Array.isArray(ts[k]) ? "array" : "not array", c2);
          check(oxc[k].length, ts[k].length, c2);
          for (let i = 0; i < oxc[k].length; i++) {
            compareNodes(oxc[k][i], ts[k][i], `${c2}[${i}]`);
          }
        } else {
          compareNodes(oxc[k], ts[k], c2);
        }
      }
    }
  };

  for (let i = 0; i < oxc.body.length; i++) {
    compareNodes(oxc.body[i], ts.body[i], `body[${i}]`);
  }
};

const isEmpty = (v: any) => !v || (Array.isArray(v) && v.length === 0);
