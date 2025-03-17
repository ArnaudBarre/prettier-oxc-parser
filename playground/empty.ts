#!/usr/bin/env bun
import { compareCode } from "./compare-code.ts";

await compareCode(
  `
export type PositiveInfinity = 1e999;
`,
  "file.ts",
  true,
);
