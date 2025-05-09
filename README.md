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

Flow inside `.js` files via `@flow` pgrama is not supported.

Non stage 4 syntax proposal like (defer import evaluation)[https://github.com/tc39/proposal-defer-import-eval/] are not supported. For decorators see (oxc#10921)[https://github.com/oxc-project/oxc/issues/10921].

Few remaining AST issues, which will be fixed in the next release of [oxc-parser](https://www.npmjs.com/package/oxc-parser), will make updates to your code if you use `declare module a.b`, `declare namespace a.b` (oxc#10901)[https://github.com/oxc-project/oxc/issues/10901] or `#privateProp in obj` (oxc#10839)[https://github.com/oxc-project/oxc/issues/10839].

Some subtitle differences can appear in JS files and are, IMO, bugs in Prettier:

- Line breaks for multi-assginement statements (prettier#17437)[https://github.com/prettier/prettier/issues/17437]
- Comments in if/else blocks without brackets (prettier#17449)[https://github.com/prettier/prettier/issues/17449]
- Line breaks for optional call statements (prettier#17457)[https://github.com/prettier/prettier/issues/17457]
- Empty directives (prettier#17458)[https://github.com/prettier/prettier/issues/17458]
