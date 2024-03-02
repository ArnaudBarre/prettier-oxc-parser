#!/usr/bin/env bun
import { compareCode } from "./compare-code";

await compareCode(`type SameShape = { [Key in A]: never };`, "esbuild.d.ts");
