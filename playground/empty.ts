#!/usr/bin/env node
import { compareCode } from "./compare-code.ts";

const result = await compareCode(
  `
type Foo = Bar
`,
  "file.ts",
);

console.log(typeof result === "string" ? result : result ? "OK" : "KO");
