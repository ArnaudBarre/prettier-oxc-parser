import { readFile, readdir } from "node:fs/promises";
import { bench, run, type k_state } from "mitata";
import { format, type Options } from "prettier";
import pkg from "../package.json" with { type: "json" };

const JS_FIXTURES_DIR = "./benchmark/fixtures/js";
const TS_FIXTURES_DIR = "./benchmark/fixtures/ts";

console.log("## Benchmark report");
console.log("- Plugin version:", "`" + pkg.version + "`");
console.log("- Prettier version:", "`" + pkg.devDependencies.prettier + "`");
console.log("");

const mainResults = {
  js: {
    keep: [
      ["Small (1kb)", "0001"],
      ["Medium (10kb)", "0010"],
      ["Large (28kb)", "0028"],
    ],
    oxc: [] as number[],
    default: [] as number[],
  },
  ts: {
    keep: [
      ["Small (1kb)", "0001"],
      ["Medium (7kb)", "0007"],
      ["Large (40kb)", "0040"],
      ["TS Compiler", "2922"],
    ],
    oxc: [] as number[],
    "babel-ts": [] as number[],
    default: [] as number[],
  },
};

console.log("### JS(X)");
for (const file of await readdir(JS_FIXTURES_DIR)) {
  console.log("#### %s", file);
  const CODE = await readFile(`${JS_FIXTURES_DIR}/${file}`, "utf8");

  bench("$parser", function* (state: k_state) {
    const parser = state.get("parser");

    const options: Options = {
      filepath: file,
      parser: "babel",
      plugins: parser.startsWith("oxc") ? ["dist/index.js"] : [],
    };

    yield async () => await format(CODE, options);
  }).args("parser", ["oxc", "babel"]);

  const result = await run({ format: "markdown" });
  const [size] = file.split("-");
  if (mainResults.js.keep.some(([_, s]) => s === size)) {
    mainResults.js.oxc.push(result.benchmarks[0].runs[0].stats!.avg);
    mainResults.js.default.push(result.benchmarks[0].runs[1].stats!.avg);
  }
  console.log("");
}

console.log("");

console.log("### TS(X)");
for (const file of await readdir(TS_FIXTURES_DIR)) {
  console.log("#### %s", file);
  const CODE = await readFile(`${TS_FIXTURES_DIR}/${file}`, "utf8");

  bench("$parser", function* (state: k_state) {
    const parser = state.get("parser");

    const options: Options = {
      filepath: file,
      parser: parser === "babel-ts" ? "babel-ts" : "typescript",
      plugins: parser.startsWith("oxc") ? ["dist/index.js"] : [],
    };

    yield async () => await format(CODE, options);
  }).args("parser", ["oxc-ts", "babel-ts", "typescript"]);

  const result = await run({ format: "markdown" });
  const [size] = file.split("-");
  if (mainResults.ts.keep.some(([_, s]) => s === size)) {
    mainResults.ts.oxc.push(result.benchmarks[0].runs[0].stats!.avg);
    mainResults.ts["babel-ts"].push(result.benchmarks[0].runs[1].stats!.avg);
    mainResults.ts.default.push(result.benchmarks[0].runs[2].stats!.avg);
  }
  console.log("");
}

function printLine(name: string, values: string[]) {
  console.log(`| ${name} | ${values.join(" | ")} |`);
}
function printGroup(group: typeof mainResults.js | typeof mainResults.ts) {
  printLine(
    "File size",
    group.keep.map(([s]) => s),
  );
  printLine(
    "--",
    group.keep.map(() => "--"),
  );
  const keys = Object.keys(group) as (keyof typeof group)[];
  for (const key of keys) {
    if (key === "keep") continue;
    printLine(
      key,
      group[key].map((v, i) => `\`${(v / 1e6).toFixed(i === 3 ? 0 : 1)} ms\``),
    );
  }
}

console.log("");
console.log("Main results");
console.log("### JS(X)");
printGroup(mainResults.js);
console.log("");
console.log("### TS(X)");
printGroup(mainResults.ts);
