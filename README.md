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

On my work codebase, time to format ~800 TS(X) files went from 5.8s to 4.4s without raw transfer and 3.8s with raw transfer (50% faster). On that 3.8s, only 0.2s is spent on the parsing.

## Caveats

Flow inside `.js` files via `@flow` pragma is not supported.

Non stage 4 syntax proposal like [defer import evaluation](https://github.com/tc39/proposal-defer-import-eval/) are not supported. For decorators see [oxc#10921](https://github.com/oxc-project/oxc/issues/10921).

Few remaining AST issues, which will be fixed in the next release of [oxc-parser](https://www.npmjs.com/package/oxc-parser), will make updates to your code if you use `declare module a.b`, `declare namespace a.b` [oxc#10901](https://github.com/oxc-project/oxc/issues/10901) or `/** @type {number} */ (parent[prop]) = 1` [oxc#10929](https://github.com/oxc-project/oxc/issues/10929).

Some subtitle differences can appear in JS files and are, IMO, bugs in Prettier:

- Line breaks for multi-assginement statements [prettier#17437](https://github.com/prettier/prettier/issues/17437)
- Comments in if/else blocks without brackets [prettier#17449](https://github.com/prettier/prettier/issues/17449)
- Line breaks for optional call statements [prettier#17457](https://github.com/prettier/prettier/issues/17457)
- Empty directives [prettier#17458](https://github.com/prettier/prettier/issues/17458)
