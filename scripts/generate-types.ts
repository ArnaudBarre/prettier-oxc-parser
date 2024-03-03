#!/usr/bin/env bun
import { readFileSync, writeFileSync } from "node:fs";
import { format } from "prettier";
import { oxcParse, oxcToESTree } from "../src/utils.ts";
import type {
  Program,
  Statement,
  TSArrayType,
  TSType,
  TSTypeReference,
  TSUnionType,
} from "../src/oxc-types.ts";

const content = readFileSync(
  import.meta.dir + "/../../oxc/npm/parser-wasm/oxc_parser_wasm.d.ts",
  "utf-8",
);
const ast = oxcParse(content, "oxc_parser_wasm.d.ts");
const exports: Statement[] = [];
const nodes: string[] = [];
const visited = new Map<string, TSType | null>();

const visitNode = (name: string): TSType | null => {
  const cached = visited.get(name);
  if (cached !== undefined) return cached;

  const type = getType(name);
  if (type) {
    if (
      type.decl.type === "TSUnionType" &&
      type.decl.types.every((t) => t.type === "TSTypeReference")
    ) {
      exports.push(type.exp);
      visited.set(name, null);
      for (const t of type.decl.types) handleReference(t as TSTypeReference);
    } else {
      console.log(`Inline ${name}`);
      visited.set(name, type.decl);
      return type.decl;
    }
  } else {
    const int = getInt(name);
    if (!int) throw new Error(`Could not find interface ${name}`);
    exports.push(int.exp);
    visited.set(name, null);
    for (const sig of int.decl.body.body) {
      if (sig.type !== "TSPropertySignature") {
        throw new Error(`Unexpected signature type ${sig.type}`);
      }
      if (
        !sig.typeAnnotation ||
        sig.typeAnnotation.type !== "TSTypeAnnotation"
      ) {
        throw new Error(
          `Unexpected typeAnnotation type ${sig.typeAnnotation?.type}`,
        );
      }
      if (sig.key.type === "IdentifierName" && sig.key.name === "type") {
        nodes.push(name);
      }
      switch (sig.typeAnnotation.typeAnnotation.type) {
        case "TSTypeReference":
          const inlineType = handleReference(sig.typeAnnotation.typeAnnotation);
          if (inlineType) {
            sig.typeAnnotation.typeAnnotation = inlineType;
            if (inlineType.type === "TSUnionType") handleUnionType(inlineType);
          }
          break;
        case "TSUnionType":
          handleUnionType(sig.typeAnnotation.typeAnnotation);
          break;
        case "TSArrayType":
          handleArrayType(sig.typeAnnotation.typeAnnotation);
          break;
      }
    }
  }
  return null;
};

const handleUnionType = ({ types }: TSUnionType) => {
  for (const [i, t] of types.entries()) {
    if (t.type === "TSTypeReference") {
      const inlineType = handleReference(t);
      if (inlineType) types[i] = inlineType;
    } else if (t.type === "TSArrayType") {
      handleArrayType(t);
    }
  }
};

const handleArrayType = (arrayType: TSArrayType) => {
  if (arrayType.elementType.type === "TSTypeReference") {
    const inlineType = handleReference(arrayType.elementType);
    if (inlineType) arrayType.elementType = inlineType;
  }
};

const handleReference = ({ typeName }: TSTypeReference): TSType | null => {
  if (typeName.type !== "IdentifierReference") {
    throw new Error(`Unexpected typeName type ${typeName.type}`);
  }
  return visitNode(typeName.name);
};

const getInt = (name: string) => {
  for (const node of ast.body) {
    if (
      node.type === "ExportNamedDeclaration" &&
      node.declaration?.type === "TSInterfaceDeclaration" &&
      node.declaration.id.name === name
    ) {
      return { exp: node, decl: node.declaration };
    }
  }
};

const getType = (name: string) => {
  for (const node of ast.body) {
    if (
      node.type === "ExportNamedDeclaration" &&
      node.declaration?.type === "TSTypeAliasDeclaration" &&
      node.declaration.id.name === name
    ) {
      return { exp: node, decl: node.declaration.typeAnnotation };
    }
  }
};

visitNode("Program");

const nodeUnion = `export type Node = ${nodes.join(" | ")};`;
const nodeAst = oxcParse(nodeUnion, "node.d.ts");
exports.push(nodeAst.body[0]);

writeFileSync(
  import.meta.dir + "/../src/oxc-types.ts",
  await format("--", {
    filepath: "oxc-types.ts",
    printWidth: 120,
    plugins: [
      {
        parsers: {
          typescript: {
            astFormat: "estree",
            parse: () => {
              const newAst = {
                type: "Program",
                start: 0,
                end: 5000,
                body: exports,
              } as Program;
              oxcToESTree(newAst);
              return newAst;
            },
            locStart: (node) => node.start,
            locEnd: (node) => node.end,
          },
        },
      },
    ],
  }),
);
