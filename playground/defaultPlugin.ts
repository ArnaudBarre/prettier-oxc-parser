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
        saveJson("default-ast", {
          ...ast.program,
          comments: ast.comments,
        }, (k, v) => {
          if (k === "loc") return undefined;
          if (k === "range") return undefined;
          return v;
        });
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
            const { type, range, ...rest } = v;
            return type
              ? { type, start: range[0], end: range[1], ...rest }
              : { start: range[0], end: range[1], ...rest };
          }
          return v;
        });
        return ast;
      },
    },
  },
};
