import { type ParserOptions, parseSync } from "oxc-parser";
import type {
  BindingPattern,
  FormalParameter,
  FormalParameters,
  Node,
  Program,
} from "./oxc-types.ts";
import type { TSESTree } from "@typescript-eslint/types";

export const oxcParse = (code: string, options: ParserOptions) => {
  const result = parseSync(code, options);
  if (result.errors.length) throw new Error(result.errors[0]);
  return JSON.parse(result.program) as Program;
};

export const oxcToESTree = (node: Node): any => {
  switch (node.type) {
    case "Program":
    case "BlockStatement":
      for (const stmt of node.body) oxcToESTree(stmt);
      break;
    case "ImportDeclaration":
      if (node.specifiers) {
        for (const specifier of node.specifiers) oxcToESTree(specifier);
      }
      oxcToESTree(node.source);
      // @ts-expect-error
      node.importKind = node.importKind.type;
      break;
    case "ImportSpecifier":
      oxcToESTree(node.local);
      oxcToESTree(node.imported);
      // @ts-expect-error
      node.importKind = node.importKind.type;
      break;
    case "ImportNamespaceSpecifier":
      oxcToESTree(node.local);
      break;
    case "ExportNamedDeclaration":
      if (node.declaration) oxcToESTree(node.declaration);
      if (node.source) oxcToESTree(node.source);
      for (const specifier of node.specifiers) oxcToESTree(specifier);
      // @ts-expect-error
      node.exportKind = node.export_kind.type;
      // @ts-expect-error
      delete node.export_kind;
      break;
    case "ExpressionStatement":
      oxcToESTree(node.expression);
      break;
    case "AssignmentExpression":
      oxcToESTree(node.left);
      oxcToESTree(node.right);
      break;
    case "BinaryExpression":
      oxcToESTree(node.left);
      oxcToESTree(node.right);
      break;
    case "CallExpression":
      oxcToESTree(node.callee);
      for (const arg of node.arguments) oxcToESTree(arg);
      break;
    case "IfStatement":
      oxcToESTree(node.test);
      oxcToESTree(node.consequent);
      if (node.alternate) oxcToESTree(node.alternate);
      break;
    case "SwitchStatement":
      oxcToESTree(node.discriminant);
      for (const c of node.cases) oxcToESTree(c);
      break;
    case "SwitchCase":
      if (node.test) oxcToESTree(node.test);
      for (const c of node.consequent) oxcToESTree(c);
      break;
    case "ForStatement":
      if (node.init) oxcToESTree(node.init);
      if (node.test) oxcToESTree(node.test);
      if (node.update) oxcToESTree(node.update);
      oxcToESTree(node.body);
      break;
    case "ForOfStatement":
      oxcToESTree(node.left);
      oxcToESTree(node.right);
      oxcToESTree(node.body);
      break;
    case "TSAsExpression":
      oxcToESTree(node.expression);
      oxcToESTree(node.typeAnnotation);
      break;
    case "ThrowStatement":
    case "UpdateExpression":
    case "AwaitExpression":
    case "SpreadElement":
    case "UnaryExpression":
      oxcToESTree(node.argument);
      break;
    case "ReturnStatement":
      if (node.argument) oxcToESTree(node.argument);
      break;
    case "NewExpression":
      oxcToESTree(node.callee);
      for (const arg of node.arguments) oxcToESTree(arg);
      break;
    case "StaticMemberExpression":
      // @ts-expect-error
      node.type = "MemberExpression";
      oxcToESTree(node.object);
      oxcToESTree(node.property);
      break;
    case "ComputedMemberExpression":
      // @ts-expect-error
      node.type = "MemberExpression";
      // @ts-expect-error
      node.computed = true;
      oxcToESTree(node.object);
      // @ts-expect-error
      node.property = oxcToESTree(node.expression);
      // @ts-expect-error
      delete node.expression;
      break;
    case "PrivateFieldExpression":
      // @ts-expect-error
      node.type = "MemberExpression";
      oxcToESTree(node.object);
      // @ts-expect-error
      node.property = oxcToESTree(node.field);
      // @ts-expect-error
      delete node.field;
      break;
    case "IdentifierReference":
      // @ts-expect-error
      node.type = "Identifier";
      break;
    case "IdentifierName":
      // @ts-expect-error
      node.type = "Identifier";
      break;
    case "BindingIdentifier":
      // @ts-expect-error
      node.type = "Identifier";
      break;
    case "StringLiteral":
      // @ts-expect-error
      node.extra = { rawValue: node.value, raw: `"${node.value}"` };
      break;
    case "NumberLiteral":
      // @ts-expect-error
      node.type = "NumericLiteral";
      // @ts-expect-error
      node.extra = { rawValue: node.value, raw: `${node.value}` };
      break;
    case "TemplateLiteral":
      for (const expr of node.expressions) oxcToESTree(expr);
      break;
    case "ObjectExpression":
      for (const prop of node.properties) oxcToESTree(prop);
      break;
    case "ArrowExpression":
    case "FunctionDeclaration":
    case "FunctionExpression":
      if (node.type === "ArrowExpression") {
        // @ts-expect-error
        node.type = "ArrowFunctionExpression";
        if (node.expression) {
          // @ts-expect-error
          node.body = node.body.statements[0].expression;
        }
      }
      oxcToESTree(node.body);
      // @ts-expect-error
      node.params = inlineFormalParameters(node.params);
      if (node.typeParameters) oxcToESTree(node.typeParameters);
      if (node.returnType) oxcToESTree(node.returnType);
      break;
    case "FunctionBody":
      // @ts-expect-error
      node.type = "BlockStatement";
      for (const stmt of node.statements) oxcToESTree(stmt);
      // @ts-expect-error
      node.body = node.statements;
      // @ts-expect-error
      delete node.statements;
      break;
    case "ObjectProperty":
      oxcToESTree(node.key);
      oxcToESTree(node.value);
      break;
    case "VariableDeclaration":
      for (const decl of node.declarations) oxcToESTree(decl);
      break;
    case "VariableDeclarator":
      node.id = oxcToESTree(node.id);
      if (node.init) oxcToESTree(node.init);
      break;
    case "BindingPattern":
      return inlineBindingPattern(node);
    case "ArrayExpression":
      for (let i = 0; i < node.elements.length; i++) {
        const el = node.elements[i];
        if ("type" in el) {
          oxcToESTree(el);
        } else {
          // @ts-expect-error
          node.elements[i] = null;
        }
      }
      break;
    case "ObjectPattern":
      for (const prop of node.properties) {
        oxcToESTree(prop);
      }
      if (node.rest) {
        node.properties.push({
          // @ts-expect-error
          type: "RestElement",
          argument: oxcToESTree(node.rest.argument),
        });
        // @ts-expect-error
        delete node.rest;
      }
      break;
    case "BindingProperty":
      // @ts-expect-error
      node.type = "Property";
      oxcToESTree(node.key);
      node.value = oxcToESTree(node.value);
      break;
    case "TSTypeAnnotation":
      node.typeAnnotation = oxcToESTree(node.typeAnnotation);
      break;
    case "TSTypeReference":
      oxcToESTree(node.typeName);
      if (node.typeParameters) oxcToESTree(node.typeParameters);
      break;
    case "TSQualifiedName":
      oxcToESTree(node.left);
      oxcToESTree(node.right);
      break;
    case "TSArrayType":
      oxcToESTree(node.elementType);
      break;
    case "TSTypeLiteral":
      for (const member of node.members) oxcToESTree(member);
      break;
    case "TSIndexedAccessType":
      oxcToESTree(node.objectType);
      oxcToESTree(node.indexType);
      break;
    case "TSEnumDeclaration":
      oxcToESTree(node.id);
      // @ts-expect-error
      node.members = node.body.members.map(oxcToESTree);
      // @ts-expect-error
      delete node.body;
      break;
    case "TSEnumMember":
      oxcToESTree(node.id);
      if (node.initializer) oxcToESTree(node.initializer);
      break;
    case "TSInterfaceDeclaration":
      oxcToESTree(node.id);
      for (const member of node.body.body) oxcToESTree(member);
      if (node.extends) for (const ext of node.extends) oxcToESTree(ext);
      break;
    case "TSTypeAliasDeclaration":
      oxcToESTree(node.id);
      oxcToESTree(node.typeAnnotation);
      if (node.typeParameters) oxcToESTree(node.typeParameters);
      break;
    case "TSUnionType":
      for (const type of node.types) oxcToESTree(type);
      break;
    case "TSIntersectionType":
      for (const type of node.types) oxcToESTree(type);
      break;
    case "TSPropertySignature":
      oxcToESTree(node.key);
      if (node.typeAnnotation) oxcToESTree(node.typeAnnotation);
      break;
    case "TSInterfaceHeritage":
      oxcToESTree(node.expression);
      break;
    case "TSTypeParameterDeclaration":
      for (const param of node.params) oxcToESTree(param);
      break;
    case "TSTypeParameter":
      oxcToESTree(node.name);
      break;
    case "TSLiteralType":
      oxcToESTree(node.literal);
      break;
    case "TSTypeParameterInstantiation":
      for (const type of node.params) oxcToESTree(type);
      break;
    case "TSTypeOperatorType":
      // @ts-expect-error
      node.type = "TSTypeOperator";
      // @ts-expect-error
      node.typeAnnotation = oxcToESTree(node.type_annotation);
      // @ts-expect-error
      delete node.type_annotation;
      break;
  }
  return node;
};

const inlineFormalParameters = (
  node: FormalParameters,
): TSESTree.Parameter[] => {
  if (node.rest) {
    return [
      ...node.items.map(inlineFormalParameter),
      inlineBindingPattern(node.rest.argument), // TODO: check
    ];
  } else {
    return node.items.map(inlineFormalParameter);
  }
};

const inlineFormalParameter = (node: FormalParameter): TSESTree.Parameter =>
  inlineBindingPattern(node.pattern);

const inlineBindingPattern = (node: BindingPattern): TSESTree.Parameter => {
  const { kind, typeAnnotation, optional } = node;
  if (typeAnnotation) oxcToESTree(typeAnnotation);
  return { ...oxcToESTree(kind), typeAnnotation, optional };
};
