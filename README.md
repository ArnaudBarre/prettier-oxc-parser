# prettier-oxc-parser [![npm](https://img.shields.io/npm/v/prettier-oxc-parser)](https://www.npmjs.com/package/prettier-oxc-parser)

Use [oxc](https://github.com/oxc-project/oxc) as a [Prettier](https://prettier.io/) parser for JavaScript and TypeScript.

**Requires Prettier >= 3.5.3**

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

An interesting thing is that you can get a part of the performance boost for TS files by using `babel-ts` via [overrides](https://prettier.io/docs/configuration#setting-the-parser-options).

Averages when running on Apple M1 Pro with node 23.11.

### JS(X)

| File size | Small (1kb) | Medium (10kb) | Large (28kb) |
| --------- | ----------- | ------------- | ------------ |
| oxc       | `0.8 ms`    | `3.7 ms`      | `10.6 ms`    |
| default   | `0.9 ms`    | `4.3 ms`      | `12.5 ms`    |

### TS(X)

| File size | Small (1kb) | Medium (7kb) | Large (40kb) | TS Compiler |
| --------- | ----------- | ------------ | ------------ | ----------- |
| oxc       | `0.6 ms`    | `3.5 ms`     | `17.6 ms`    | ` 727 ms`   |
| babel-ts  | `0.8 ms`    | `4.9 ms`     | `23.6 ms`    | ` 965 ms`   |
| default   | `1.1 ms`    | `5.8 ms`     | `30.6 ms`    | `1237 ms`   |

## Caveats

Flow inside `.js` files via `@flow` pragma is not supported.

Few remaining AST issues, which will be fixed in the next release of [oxc-parser](https://www.npmjs.com/package/oxc-parser), will make updates to your code if you use `declare module a.b`, `declare namespace a.b` [oxc#10901](https://github.com/oxc-project/oxc/issues/10901), decorators in JS files [oxc#10921](https://github.com/oxc-project/oxc/issues/10921) or `/** @type {number} */ (parent[prop]) = 1` [oxc#10929](https://github.com/oxc-project/oxc/issues/10929).

Some subtitle differences can appear in JS files and are, IMO, bugs in Prettier:

- Line breaks for multi-assginement statements [prettier#17437](https://github.com/prettier/prettier/issues/17437)
- Comments in if/else blocks without brackets [prettier#17449](https://github.com/prettier/prettier/issues/17449)
- Line breaks for optional call statements [prettier#17457](https://github.com/prettier/prettier/issues/17457)
- Empty directives [prettier#17458](https://github.com/prettier/prettier/issues/17458)
