import type { Parser, Plugin } from "prettier";
import { oxcParse, oxcToESTree } from "./utils.ts";

const parse: Parser["parse"] = (text, options) => {
  const ast = oxcParse(text, { sourceFilename: options.filepath });
  return oxcToESTree(ast);
};

export const parsers: Plugin["parsers"] = {
  typescript: {
    astFormat: "estree",
    parse,
    locStart: (node) => node.start,
    locEnd: (node) => node.end,
    hasPragma: () => false,
  },
};
