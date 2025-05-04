#!/usr/bin/env bun
import { rmSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";

import packageJSON from "../package.json";

rmSync("dist", { force: true, recursive: true });

await Bun.build({
  entrypoints: ["src/index.ts"],
  outdir: "dist",
  target: "node",
  format: "esm",
  external: [
    ...Object.keys(packageJSON.peerDependencies),
    ...Object.keys(packageJSON.dependencies),
  ],
});

execSync("cp LICENSE README.md dist/");

writeFileSync(
  "dist/index.d.ts",
  `import type { Plugin } from "prettier";
export declare const parsers: Plugin["parsers"];
`,
);

writeFileSync(
  "dist/package.json",
  JSON.stringify(
    {
      name: packageJSON.name,
      description:
        "Use oxc as a Prettier parser for JavaScript and TypeScript.",
      version: packageJSON.version,
      type: "module",
      author: "Arnaud Barré (https://github.com/ArnaudBarre)",
      license: "MIT",
      repository: "github:ArnaudBarre/prettier-oxc-parser",
      exports: {
        ".": "./index.js",
      },
      peerDependencies: packageJSON.peerDependencies,
      dependencies: packageJSON.dependencies,
      keywords: ["prettier", "parser", "javascript", "typescript", "oxc"],
    },
    null,
    2,
  ),
);
