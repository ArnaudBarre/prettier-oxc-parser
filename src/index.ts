import { type Parser } from "prettier";
import typescriptParser from "prettier/plugins/typescript";
import { oxcParse, oxcToESTree } from "./utils.ts";

const parse: Parser["parse"] = (text, options) => {
  const ast = oxcParse(text, { sourceFilename: options.filepath });
  return oxcToESTree(ast);
};

export const parsers = {
  typescript: {
    ...typescriptParser.parsers.typescript,
    parse,
  },
};
