#!/usr/bin/env bun
import { compareCode } from "./compare-code";

await compareCode(
  `
export declare class ByteBuffer {
  finishSizePrefixed(this: Builder, root_table: Offset, opt_file_identifier?: string): void;
}
`,
  "file.d.ts",
);
