# prettier-oxc-parser [![npm](https://img.shields.io/npm/v/prettier-oxc-parser)](https://www.npmjs.com/package/prettier-oxc-parser)

Use [oxc](https://github.com/oxc-project/oxc) as a [Prettier](https://prettier.io/) parser for JavaScript and TypeScript.

Requires Prettier >= 3.5.3

```sh
$ npm install -D prettier-oxc-parser
$ yarn add -D prettier-oxc-parser
$ pnpm install -D prettier-oxc-parser
$ bun add -D prettier-oxc-parser
```

## Caveats

In JS, type cast comment with parenthesis like `/** @type {Foo} */ (foo).bar();` will break.

Few remaining AST issues, which will be fixed in the next release of [oxc-parser](https://www.npmjs.com/package/oxc-parser), will make updates to your code if you use `declare module a.b`, `declare namespace a.b` (oxc#10901)[https://github.com/oxc-project/oxc/issues/10901] or `#privateProp in obj` (oxc#10839)[https://github.com/oxc-project/oxc/issues/10839].

Some subtitle differences have been noticed and are, IMO, bugs in Prettier:

- Line breaks for multi-assginement statements can differ for JS files (prettier#17437)[https://github.com/prettier/prettier/issues/17437]
- Comments in if/else blocks without brackets can change the output (prettier#17449)[https://github.com/prettier/prettier/issues/17449]
- Line breaks for optional call statements can differ for JS files (prettier#17457)[https://github.com/prettier/prettier/issues/17457]
