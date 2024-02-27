// import oxc from "./tmp/ast-updated.json";
import ts from "../tmp/default-ast.json";
import assert from "node:assert";
import { readFileSync, writeFileSync } from "node:fs";
import { oxcParse, oxcToESTree } from "../src/utils.ts";

const code = readFileSync("oxc-types.ts", "utf-8");
const oxc = oxcParse(code, { sourceFilename: "playground.d.ts" });
oxcToESTree(oxc);
writeFileSync("tmp/ast-updated.json", JSON.stringify(oxc, null, 2));

const check = (a: any, b: any, c?: string) => {
  assert(a === b, `${c ? `${c}: ` : ""}${a} !== ${b}`);
};

check(oxc.comments.length, ts.comments.length);
for (let i = 0; i < oxc.comments.length; i++) {
  const a = oxc.comments[i];
  const b = ts.comments[i];
  check(a.type, b.type);
  check(a.value, b.value);
  check(a.start, b.range[0]);
  check(a.end, b.range[1]);
}
const literals = [
  "StringLiteral",
  "NumericLiteral",
  "BooleanLiteral",
  "NullLiteral",
];

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
  check(literals.includes(oxc.type) ? "Literal" : oxc.type, ts.type, c);
  c += `(${oxc.type})`;
  if (oxc.type && oxc.type !== "TemplateElement") {
    // TemplateElement span in TS are contains `${}` chars
    check(oxc.start, ts.range[0], c);
    check(oxc.end, ts.range[1], c);
  }
  cleanTSNode(ts);
  const tsKeys = Object.keys(ts)
    .filter((k) => !["range", "loc", "type", "raw"].includes(k))
    .sort();
  for (const k of tsKeys) {
    let c2 = `${c}.${k}`;
    if (!oxc[k] && !ts[k]) continue; // for now don't report diff in undefined/null/false
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
