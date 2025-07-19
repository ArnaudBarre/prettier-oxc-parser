# prettier-oxc-parser [![npm](https://img.shields.io/npm/v/prettier-oxc-parser)](https://www.npmjs.com/package/prettier-oxc-parser)

Use [oxc](https://github.com/oxc-project/oxc) as a [Prettier](https://prettier.io/) parser for JavaScript and TypeScript.

This was an experiment before the official [@prettier/plugin-oxc](https://www.npmjs.com/package/@prettier/plugin-oxc) was released.

In my testing, because the official plugin is not using [raw transfer](https://github.com/prettier/prettier/pull/17663), this plugin is still faster, but surprisingly, the speed difference vanishes when using [--experimental-cli](https://prettier.io/blog/2025/06/23/3.6.0#change-17151).

**Requires Prettier >= 3.6.2**

## Installation

```sh
$ npm install -D prettier-oxc-parser
$ yarn add -D prettier-oxc-parser
$ pnpm install -D prettier-oxc-parser
$ bun add -D prettier-oxc-parser
```

Add the plugin to your Prettier config:

```json
{
  "plugins": ["prettier-oxc-parser"]
}
```

## Why?

[oxc](https://github.com/oxc-project/oxc) is a fast, really fast. And with the addition of [raw transfer](https://github.com/oxc-project/oxc/pull/9516), the cost of passing the AST from Rust to JavaScript is close to 0. Raw transfer is only available in Node >= 22.

While Prettier with this plugin is far from the performances of pure native formatters like Biome, it give a significant performance improvement for large TS projects while keeping one tool to format all files types.

## Benchmark

For full benchmark results see [benchmark/report.md](benchmark/report.md) or run it yourself with `bun benchmark`.

Keep in mind that the timing are for "parse + format". When using oxc as a parser, ~90% of the time is spent of the format part.

On this benchmark, this plugin is faster than [@prettier/plugin-oxc](https://www.npmjs.com/package/@prettier/plugin-oxc) because the official one is using the async API without raw transfer. On a real world TS codebase, the timing are the same with the experimental-cli but this plugin is faster without.

An interesting thing is that you can get a part of the performance boost for TS files by using `babel-ts` via [overrides](https://prettier.io/docs/configuration#setting-the-parser-options).

Averages when running on Apple M1 Pro with node 24.3.

### JS(X)

| File size            | Small (1kb) | Medium (10kb) | Large (28kb) |
| -------------------- | ----------- | ------------- | ------------ |
| prettier-oxc-parser  | `0.9 ms`    | `3.9 ms`      | `10.4 ms`    |
| @prettier/plugin-oxc | `1.2 ms`    | `4.6 ms`      | `12.5 ms`    |
| default              | `1.0 ms`    | `3.9 ms`      | `11.0 ms`    |

### TS(X)

| File size            | Small (1kb) | Medium (7kb) | Large (40kb) | TS Compiler |
| -------------------- | ----------- | ------------ | ------------ | ----------- |
| prettier-oxc-parser  | `0.7 ms`    | `3.8 ms`     | `18.4 ms`    | `737 ms`    |
| @prettier/plugin-oxc | `0.9 ms`    | `5.3 ms`     | `31.5 ms`    | `1132 ms`   |
| babel-ts             | `0.8 ms`    | `4.3 ms`     | `20.6 ms`    | `848 ms`    |
| default              | `1.2 ms`    | `5.6 ms`     | `27.8 ms`    | `1093 ms`   |

## Caveats

Flow inside `.js` files via `@flow` pragma is not supported.
