#!/usr/bin/env node
import { compareCode } from "./compare-code.ts";

const result = await compareCode(
  `
type Foo = Bar
`,
  "file.ts",
);

if (typeof result === "string") console.log(result);
