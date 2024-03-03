import type { Plugin } from "prettier";
import { oxcParse, oxcToESTree } from "./utils.ts";

export const parsers: Plugin["parsers"] = {
  typescript: {
    astFormat: "estree",
    parse: (text, options) => {
      const ast = oxcParse(text, options.filepath);
      return oxcToESTree(ast);
    },
    locStart: (node) => node.start,
    locEnd: (node) => node.end,
    hasPragma: () => false,
  },
};
