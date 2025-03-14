import type { Plugin } from "prettier";
import { oxcParse } from "./oxcParse.ts";

export const parsers: Plugin["parsers"] = {
  typescript: {
    astFormat: "estree",
    parse: (text, options) => oxcParse(text, options.filepath),
    locStart: (node) => node.start,
    locEnd: (node) => node.end,
    hasPragma: () => false,
  },
};
