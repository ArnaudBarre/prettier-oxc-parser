#!/usr/bin/env bun
import { compareCode } from "./compare-code.ts";

await compareCode(
  `
<Tag>{((foo = 1), props.value)}</Tag>
`,
  "file.tsx",
  true,
);
