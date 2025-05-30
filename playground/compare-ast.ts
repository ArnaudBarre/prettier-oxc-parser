import assert from "node:assert";

export const compareAst = (oxc: any, ts: any) => {
  const check = (a: any, b: any, location: string) => {
    assert(a === b, `${location}: ${a} !== ${b}`);
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
      // TemplateElement span in TS contains `${}` chars
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
      if (typeof oxc[k] === "bigint") {
        check(`(BigInt) ${oxc[k]}`, ts[k], c2);
        continue;
      }
      check(typeof oxc[k], typeof ts[k], c2);
      if (typeof oxc[k] === "object") {
        if (oxc[k] === null) {
          check(oxc[k], ts[k], c2);
        } else if (Array.isArray(oxc[k])) {
          check("array", Array.isArray(ts[k]) ? "array" : "not array", c2);
          check(oxc[k].length, ts[k].length, c2);
          for (let i = 0; i < oxc[k].length; i++) {
            if (oxc[k][i] === null || ts[k][i] === null) {
              check(oxc[k][i], ts[k][i], `${c2}[${i}]`);
            } else {
              compareNodes(oxc[k][i], ts[k][i], `${c2}[${i}]`);
            }
          }
        } else {
          compareNodes(oxc[k], ts[k], c2);
        }
      } else {
        check(oxc[k], ts[k], c2);
      }
    }
  };

  for (let i = 0; i < Math.max(oxc.body.length, ts.body.length); i++) {
    if (!oxc.body[i] || !ts.body[i]) {
      check(oxc.body[i], ts.body[i], `body[${i}]`);
    } else {
      compareNodes(oxc.body[i], ts.body[i], `body[${i}]`);
    }
  }
};

const isEmpty = (v: any) => !v || (Array.isArray(v) && v.length === 0);
