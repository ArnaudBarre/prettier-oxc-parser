import type { Parser, Plugin } from "prettier";
import { oxcParse } from "./oxcParse.ts";

const parser = (defaultFile: string): Parser => ({
  astFormat: "estree",
  parse: (text, options) => oxcParse(text, options.filepath ?? defaultFile),
  locStart: (node) => node.start,
  locEnd: (node) => node.end,
  // The default plugins do a lot of work based on parsing through jest-docblock that does quite
  // a lot of regexes. Not sure if it's worth it to do that here
  hasPragma: (text) => text.includes("@format") || text.includes("@prettier"),
});

export const parsers: Plugin["parsers"] = {
  babel: parser("file.js"),
  typescript: parser("file.ts"),
};
