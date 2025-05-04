#!/usr/bin/env node
import { compareCode } from "./compare-code.ts";

await compareCode(
  `
type Foo = Bar
`,
  "file.ts",
);
