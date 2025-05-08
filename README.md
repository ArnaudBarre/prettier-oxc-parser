# prettier-oxc-parser [![npm](https://img.shields.io/npm/v/prettier-oxc-parser)](https://www.npmjs.com/package/prettier-oxc-parser)

WIP: Using rawTransfer is buggy (https://github.com/oxc-project/oxc/issues/10782) and not using currently gives the same speed as the default parser.

Use [oxc](https://github.com/oxc-project/oxc) as a [Prettier](https://prettier.io/) parser for JavaScript and TypeScript.

Requires Prettier >= 3.5.3

```sh
$ npm install -D prettier-oxc-parser
$ yarn add -D prettier-oxc-parser
$ pnpm install -D prettier-oxc-parser
$ bun add -D prettier-oxc-parser
```

## Caveats

Some subtitle differences have been noticed and are, IMO, bugs in Prettier:

- Line breaks for multi-assginement statements can differ for JS files (prettier#17437)[https://github.com/prettier/prettier/issues/17437]
- Comments in if/else blocks without brackets can change the output (prettier#17449)[https://github.com/prettier/prettier/issues/17449]
