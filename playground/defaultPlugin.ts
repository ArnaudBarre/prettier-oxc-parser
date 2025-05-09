import type { Plugin } from "prettier";
import babelParser from "prettier/plugins/babel";
import typescriptParser from "prettier/plugins/typescript";
import { saveJson } from "./json.ts";

export const defaultPlugin: Plugin = {
  parsers: {
    babel: {
      ...babelParser.parsers.babel,
      parse: (text, options) => {
        const ast = babelParser.parsers.babel.parse(text, options);
        saveJson(
          "default-ast",
          {
            ...ast.program,
            comments: ast.comments.map((c: any) => ({
              ...c,
              type: c.type.slice(7),
            })),
          },
          (k, v) => {
            if (k === "loc") return undefined;
            if (k === "range") return undefined;
            if (!v || typeof v !== "object") return v;
            if (v.type === "BooleanLiteral") {
              // https://github.com/prettier/prettier/issues/17437
              v.type = "Literal";
            }
            if (v.loc) {
              // Remove line and column from loc because of https://github.com/prettier/prettier/issues/17449
              v.loc = { start: v.start, end: v.end };
            }
            return v;
          },
        );
        return ast;
      },
    },
    typescript: {
      ...typescriptParser.parsers.typescript,
      parse: (text, options) => {
        const ast = typescriptParser.parsers.typescript.parse(text, options);
        delete ast.tokens;
        saveJson("default-ast", ast, (k, v) => {
          if (k === "loc") return undefined;
          if (typeof v === "object" && v && v.range) {
            const start = v.range[0];
            const end = v.range[1];
            // Remove line and column from loc because of https://github.com/prettier/prettier/issues/17449
            v.loc = { start, end };
            const { type, range, loc, ...rest } = v;
            return type
              ? { type, start, end, ...rest }
              : { start, end, ...rest };
          }
          return v;
        });
        return ast;
      },
    },
  },
};
