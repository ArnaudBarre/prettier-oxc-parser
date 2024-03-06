#!/usr/bin/env bun
import { compareCode } from "./compare-code";

await compareCode(
  `
type C = T extends (...args: infer A1) => unknown ? A1 : never;
`,
  "file.d.ts",
  true,
);
