#!/usr/bin/env bun
import { readFileSync, writeFileSync } from "node:fs";
import * as B from "@babel/types";
import { format } from "prettier";
import { parse } from "@babel/parser";
import generate from "@babel/generator";
import assert from "node:assert";

const content = readFileSync(
  import.meta.dir + "/../../oxc/npm/parser-wasm/oxc_parser_wasm.d.ts",
  "utf-8",
);
const { program: ast } = parse(content, {
  sourceType: "module",
  plugins: ["typescript"],
  sourceFilename: "oxc_parser_wasm.d.ts",
});
const exports: B.Statement[] = [];
const nodes: string[] = [];
const visited = new Map<string, B.TSType | null>();

const visitNode = (name: string): B.TSType | null => {
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
      const types: B.TSTypeReference[] = [];
      for (const item of type.decl.types) {
        const t = item as B.TSTypeReference;
        if (
          t.typeName.type === "Identifier" &&
          t.typeName.name === "ParenthesizedExpression"
        ) {
          continue;
        }
        handleReference(t);
        types.push(t);
      }
      type.decl.types = types;
    } else if (type.decl.type === "TSIntersectionType") {
      assert(name === "BindingPattern", `Unexpected intersection ${name}`);
      exports.push(type.exp);
      visited.set(name, null);
      assert(
        type.decl.types.length === 2 &&
          type.decl.types[1].type === "TSParenthesizedType" &&
          type.decl.types[1].typeAnnotation.type === "TSUnionType",
        "Unexpected BindingPattern structure",
      );
      for (const t of type.decl.types[1].typeAnnotation.types) {
        if (t.type === "TSTypeReference") handleReference(t);
      }
    } else {
      visited.set(name, type.decl);
      return type.decl;
    }
  } else {
    const int = getInt(name);
    if (!int) throw new Error(`Could not find interface ${name}`);
    exports.push(int.exp);
    visited.set(name, null);
    let hasType = false;
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
      if (sig.key.type === "Identifier" && sig.key.name === "type") {
        nodes.push(name);
        hasType = true;
      }
      switch (sig.typeAnnotation.typeAnnotation.type) {
        case "TSTypeReference":
          if (
            sig.typeAnnotation.typeAnnotation.typeName.type === "Identifier" &&
            sig.typeAnnotation.typeAnnotation.typeName.name === "Array"
          ) {
            const params =
              sig.typeAnnotation.typeAnnotation.typeParameters?.params;
            assert(params?.length === 1);
            switch (params[0].type) {
              case "TSTypeReference":
                const inlineType = handleReference(params[0]);
                if (inlineType) params[0] = inlineType;
                break;
              case "TSUnionType":
                handleUnionType(params[0]);
                break;
            }
            break;
          }
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
    if (
      !hasType &&
      int.decl.extends?.some(
        (e) =>
          e.type === "TSExpressionWithTypeArguments" &&
          e.expression.type === "Identifier" &&
          e.expression.name === "Span",
      )
    ) {
      const knowMissing = [
        "ObjectPattern",
        "ArrayPattern",
        "FormalParameters",
        "ArrayAssignmentTarget",
        "ObjectAssignmentTarget",
      ];
      if (knowMissing.includes(name)) {
        console.warn(`No type property in ${name}`);
        int.decl.body.body.unshift({
          type: "TSPropertySignature",
          key: { type: "Identifier", name: "type" },
          typeAnnotation: {
            type: "TSTypeAnnotation",
            typeAnnotation: {
              type: "TSLiteralType",
              literal: { type: "StringLiteral", value: name },
            },
          },
        } as B.TSPropertySignature);
        nodes.push(name);
      } else {
        throw new Error(`No type property in ${name}`);
      }
    }
  }
  return null;
};

const handleUnionType = ({ types }: B.TSUnionType) => {
  for (const [i, t] of types.entries()) {
    if (t.type === "TSTypeReference") {
      const inlineType = handleReference(t);
      if (inlineType) types[i] = inlineType;
    } else if (t.type === "TSArrayType") {
      handleArrayType(t);
    }
  }
};

const handleArrayType = (arrayType: B.TSArrayType) => {
  if (arrayType.elementType.type === "TSTypeReference") {
    const inlineType = handleReference(arrayType.elementType);
    if (inlineType) arrayType.elementType = inlineType;
  }
};

const handleReference = ({ typeName }: B.TSTypeReference): B.TSType | null => {
  if (typeName.type !== "Identifier") {
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

for (const it of exports) it.trailingComments = null;
const code =
  generate(B.program(exports), { concise: true }).code +
  `\nexport type Node = ${nodes.join(" | ")};`;

writeFileSync(
  import.meta.dir + "/../src/oxc-types.ts",
  await format(code, { filepath: "oxc-types.ts", printWidth: 120 }),
);
