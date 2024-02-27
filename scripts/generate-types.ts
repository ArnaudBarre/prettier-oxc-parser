#!/usr/bin/env bun
import { readFileSync, writeFileSync } from "node:fs";
import { format } from "prettier";
import { oxcParse, oxcToESTree } from "../src/utils.ts";
import type {
  ExportNamedDeclaration,
  Program,
  TSType,
  TSTypeReference,
} from "../src/oxc-types.ts";

const content = readFileSync(
  import.meta.dir + "/../../oxc/crates/oxc_wasm/pkg/oxc_wasm.d.ts",
  "utf-8",
);

const inlineTypes = [
  "Atom",
  "ReferenceId",
  "EmptyObject",
  "TSTypeOperatorOperator",
  "LanguageVariant",
  "ModuleKind",
  "Language",
  "RegExpFlags",
];

const ast = oxcParse(content, { sourceFilename: "oxc_wasm.d.ts" });

const typeToExport: ExportNamedDeclaration[] = [];

const visited = new Set<string>();

const visitNode = (name: string) => {
  if (visited.has(name)) return;
  visited.add(name);
  console.log(name);
  const int = getInt(name);
  if (!int) {
    const type = getType(name);
    if (!type) throw new Error(`Could not find node ${name}`);
    if (type.decl.type !== "TSUnionType") {
      throw new Error(`Unexpected type ${type.decl.type}`);
    }
    for (const t of type.decl.types) {
      if (t.type === "TSTypeReference") {
        handleReference(t);
      } else {
        throw new Error(`Unexpected type ${t.type}`);
      }
    }
    typeToExport.push(type.exp);
    return;
  }
  typeToExport.push(int.exp);
  for (const sig of int.decl.body.body) {
    if (sig.type !== "TSPropertySignature") {
      throw new Error(`Unexpected signature type ${sig.type}`);
    }
    if (!sig.typeAnnotation || sig.typeAnnotation.type !== "TSTypeAnnotation") {
      throw new Error(
        `Unexpected typeAnnotation type ${sig.typeAnnotation?.type}`,
      );
    }
    switch (sig.typeAnnotation.typeAnnotation.type) {
      case "TSTypeReference":
        const inlineType = handleReference(sig.typeAnnotation.typeAnnotation);
        if (inlineType) sig.typeAnnotation.typeAnnotation = inlineType;
        break;
      case "TSUnionType":
        const { types } = sig.typeAnnotation.typeAnnotation;
        for (const [i, t] of types.entries()) {
          if (t.type === "TSTypeReference") {
            const inlineType = handleReference(t);
            if (inlineType) types[i] = inlineType;
          }
        }
        break;
      case "TSArrayType":
        const arrayType = sig.typeAnnotation.typeAnnotation;
        if (arrayType.elementType.type === "TSTypeReference") {
          const inlineType = handleReference(arrayType.elementType);
          if (inlineType) arrayType.elementType = inlineType;
        }
        break;
      default:
        console.log(sig.typeAnnotation.typeAnnotation.type);
    }
  }
};

const handleReference = ({ typeName }: TSTypeReference): TSType | undefined => {
  if (typeName.type !== "IdentifierReference") {
    throw new Error(`Unexpected typeName type ${typeName.type}`);
  }
  if (inlineTypes.includes(typeName.name)) {
    const type = getType(typeName.name);
    if (!type) {
      const intToLine = getInt(typeName.name);
      if (!intToLine) throw new Error(`Could not find type ${typeName.name}`);
      return {
        type: "TSTypeLiteral",
        start: intToLine.decl.body.start,
        end: intToLine.decl.body.end,
        members: intToLine.decl.body.body,
      };
    } else {
      return type.decl;
    }
  } else {
    visitNode(typeName.name);
  }
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

writeFileSync(
  import.meta.dir + "/tmp.d.ts",
  await format("--", {
    filepath: "oxc_wasm.d.ts",
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
                body: typeToExport,
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
