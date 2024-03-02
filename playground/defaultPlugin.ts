import type { Plugin } from "prettier";
import typescriptParser from "prettier/plugins/typescript";
import { writeFileSync } from "node:fs";

export const defaultPlugin: Plugin = {
  parsers: {
    typescript: {
      ...typescriptParser.parsers.typescript,
      parse: (text, options) => {
        const ast = typescriptParser.parsers.typescript.parse(text, options);
        delete ast.tokens;
        writeFileSync("tmp/default-ast.json", JSON.stringify(ast, null, 2));
        return ast;
      },
    },
  },
};
