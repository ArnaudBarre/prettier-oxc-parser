import { type ParserOptions, parseSync } from "oxc-parser";
import type {
  BindingPattern,
  FormalParameter,
  FormalParameters,
  Node,
  Program,
  TSThisParameter,
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
    // TODO: Program.hashbang?
    case "BlockStatement":
    case "StaticBlock":
      for (const stmt of node.body) oxcToESTree(stmt);
      break;
    case "ImportDeclaration":
      // TODO: withClause/attributes
      if (node.specifiers) {
        for (const specifier of node.specifiers) oxcToESTree(specifier);
      }
      oxcToESTree(node.source);
      // @ts-expect-error
      node.importKind =
        // no error
        node.importKind.type;
      break;
    case "ImportSpecifier":
      oxcToESTree(node.local);
      oxcToESTree(node.imported);
      // @ts-expect-error
      node.importKind =
        // no error
        node.importKind.type;
      break;
    case "ImportNamespaceSpecifier":
    case "ImportDefaultSpecifier":
      oxcToESTree(node.local);
      break;
    case "ImportExpression":
      // TODO: arguments/attributes?
      oxcToESTree(node.source);
      break;
    case "TSImportEqualsDeclaration":
      oxcToESTree(node.id);
      oxcToESTree(node.moduleReference);
      // @ts-expect-error
      node.importKind =
        // no error
        node.importKind.type;
      break;
    case "TSImportType":
      if (node.qualifier) oxcToESTree(node.qualifier);
      if (node.typeParameters) oxcToESTree(node.typeParameters);
      // TODO: incomplete support, see https://github.com/oxc-project/oxc/issues/2394
      // and https://github.com/prettier/prettier/issues/16072
      // @ts-expect-error
      node.argument =
        // no error
        oxcToESTree(node.parameter);
      // @ts-expect-error
      delete node.parameter;
      break;
    case "ExportNamedDeclaration":
      if (node.declaration) oxcToESTree(node.declaration);
      if (node.source) oxcToESTree(node.source);
      for (const specifier of node.specifiers) oxcToESTree(specifier);
      // @ts-expect-error
      node.exportKind =
        // no error
        node.export_kind.type;
      // @ts-expect-error
      delete node.export_kind;
      break;
    case "ExportSpecifier":
      oxcToESTree(node.local);
      oxcToESTree(node.exported);
      // @ts-expect-error
      node.exportKind =
        // no error
        node.export_kind.type;
      // @ts-expect-error
      delete node.export_kind;
      break;
    case "ExportDefaultDeclaration":
      oxcToESTree(node.declaration);
      oxcToESTree(node.exported);
      break;
    case "ExportAllDeclaration":
      // TODO: withClause/attributes
      oxcToESTree(node.source);
      if (node.exported) oxcToESTree(node.exported);
      // @ts-expect-error
      node.exportKind =
        // no error
        node.export_kind.type;
      // @ts-expect-error
      delete node.export_kind;
      break;
    case "ExpressionStatement":
    case "ParenthesizedExpression":
    case "ChainExpression":
    case "Decorator":
    case "TSExportAssignment":
    case "TSNonNullExpression":
    case "JSXSpreadChild":
    case "JSXExpressionContainer":
      oxcToESTree(node.expression);
      break;
    case "SequenceExpression":
      for (const expr of node.expressions) oxcToESTree(expr);
      break;
    case "AssignmentExpression":
    case "AssignmentPattern":
      oxcToESTree(node.left);
      oxcToESTree(node.right);
      break;
    case "BinaryExpression":
    case "LogicalExpression":
      oxcToESTree(node.left);
      oxcToESTree(node.right);
      break;
    case "CallExpression":
      oxcToESTree(node.callee);
      for (const arg of node.arguments) oxcToESTree(arg);
      if (node.typeParameters) oxcToESTree(node.typeParameters);
      break;
    case "IfStatement":
      oxcToESTree(node.test);
      oxcToESTree(node.consequent);
      if (node.alternate) oxcToESTree(node.alternate);
      break;
    case "ConditionalExpression":
      oxcToESTree(node.test);
      oxcToESTree(node.consequent);
      oxcToESTree(node.alternate);
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
    case "WhileStatement":
    case "DoWhileStatement":
      oxcToESTree(node.test);
      oxcToESTree(node.body);
      break;
    case "ForOfStatement":
    case "ForInStatement":
      oxcToESTree(node.left);
      oxcToESTree(node.right);
      oxcToESTree(node.body);
      break;
    case "TSAsExpression":
    case "TSTypeAssertion":
    case "TSSatisfiesExpression":
      oxcToESTree(node.expression);
      oxcToESTree(node.typeAnnotation);
      break;
    case "ThrowStatement":
    case "UpdateExpression":
    case "AwaitExpression":
    case "SpreadElement":
    case "UnaryExpression":
    case "JSXSpreadAttribute":
    case "BindingRestElement":
      oxcToESTree(node.argument);
      break;
    case "ReturnStatement":
    case "YieldExpression":
      if (node.argument) oxcToESTree(node.argument);
      break;
    case "NewExpression":
      oxcToESTree(node.callee);
      for (const arg of node.arguments) oxcToESTree(arg);
      if (node.type_parameters)
        // @ts-expect-error
        node.typeParameters =
          // no error
          oxcToESTree(node.type_parameters);
      break;
    case "LabeledStatement":
      oxcToESTree(node.label);
      oxcToESTree(node.body);
      break;
    case "BreakStatement":
    case "ContinueStatement":
      if (node.label) oxcToESTree(node.label);
      break;
    case "WithStatement":
      oxcToESTree(node.object);
      oxcToESTree(node.body);
      break;
    case "StaticMemberExpression":
      // @ts-expect-error
      node.type = "MemberExpression";
      node.object = oxcToESTree(node.object);
      oxcToESTree(node.property);
      break;
    case "ComputedMemberExpression":
      // @ts-expect-error
      node.type = "MemberExpression";
      // @ts-expect-error
      node.computed = true;
      node.object = oxcToESTree(node.object);
      // @ts-expect-error
      node.property = oxcToESTree(node.expression);
      // @ts-expect-error
      delete node.expression;
      break;
    case "PrivateFieldExpression":
      // @ts-expect-error
      node.type = "MemberExpression";
      node.object = oxcToESTree(node.object);
      // @ts-expect-error
      node.property = oxcToESTree(node.field);
      // @ts-expect-error
      delete node.field;
      break;
    case "LabelIdentifier":
    case "IdentifierReference":
    case "IdentifierName":
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
    case "TaggedTemplateExpression":
      oxcToESTree(node.tag);
      oxcToESTree(node.quasi);
      if (node.type_parameters)
        // @ts-expect-error
        node.typeParameters = oxcToESTree(node.type_parameters);
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
      node.params =
        // no error
        inlineFormalParameters(node.params, null);
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
      if (node.init) oxcToESTree(node.init);
      break;
    case "VariableDeclaration":
      for (const decl of node.declarations) oxcToESTree(decl);
      // @ts-expect-error
      node.declare = // no error
        node.modifiers?.some((m) => m.kind.type === "declare");
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
    case "ArrayPattern":
      for (const prop of node.elements) {
        if (prop) oxcToESTree(prop);
      }
      if (node.rest) {
        node.elements.push({
          // @ts-expect-error
          type: "RestElement",
          argument: oxcToESTree(node.rest.argument),
        });
        // @ts-expect-error
        delete node.rest;
      }
      break;
    case "ArrayAssignmentTarget":
      // @ts-expect-error
      node.type = "ArrayPattern";
      for (const prop of node.elements) {
        if (prop) oxcToESTree(prop);
      }
      if (node.rest) {
        node.elements.push({
          // @ts-expect-error
          type: "RestElement",
          argument: oxcToESTree(node.rest),
        });
        // @ts-expect-error
        delete node.rest;
      }
      break;
    case "ObjectPattern":
      for (const prop of node.properties) oxcToESTree(prop);
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
    case "ObjectAssignmentTarget":
      // @ts-expect-error
      node.type = "ObjectPattern";
      for (const prop of node.properties) oxcToESTree(prop);
      if (node.rest) {
        node.properties.push({
          // @ts-expect-error
          type: "RestElement",
          argument: oxcToESTree(node.rest),
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
    case "CatchClause":
      if (node.param) oxcToESTree(node.param);
      oxcToESTree(node.body);
      break;
    case "TryStatement":
      oxcToESTree(node.block);
      if (node.handler) oxcToESTree(node.handler);
      if (node.finalizer) oxcToESTree(node.finalizer);
      break;
    case "TSTypeAnnotation":
    case "TSRestType":
    case "TSOptionalType":
      node.typeAnnotation = oxcToESTree(node.typeAnnotation);
      break;
    case "TSTypeReference":
      oxcToESTree(node.typeName);
      if (node.typeParameters) oxcToESTree(node.typeParameters);
      break;
    case "TSTypeQuery":
      oxcToESTree(node.exprName);
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
    case "TSModuleBlock":
      for (const stmt of node.body) oxcToESTree(stmt);
      break;
    case "TSModuleDeclaration":
      // TODO: incomplete support, missing kind, global
      // See https://github.com/oxc-project/oxc/issues/2395
      oxcToESTree(node.id);
      oxcToESTree(node.body);
      // @ts-expect-error
      node.declare = // no error
        node.modifiers?.some((m) => m.kind.type === "declare");
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
      if (node.typeParameters) oxcToESTree(node.typeParameters);
      if (node.extends) for (const ext of node.extends) oxcToESTree(ext);
      // @ts-expect-error
      node.declare = // no error
        node.modifiers?.some((m) => m.kind.type === "declare");
      break;
    case "TSTypeAliasDeclaration":
      oxcToESTree(node.id);
      oxcToESTree(node.typeAnnotation);
      if (node.typeParameters) oxcToESTree(node.typeParameters);
      // @ts-expect-error
      node.declare = // no error
        node.modifiers?.some((m) => m.kind.type === "declare");
      break;
    case "TSUnionType":
    case "TSIntersectionType":
      for (const type of node.types) oxcToESTree(type);
      break;
    case "TSPropertySignature":
      oxcToESTree(node.key);
      if (node.typeAnnotation) oxcToESTree(node.typeAnnotation);
      break;
    case "TSInterfaceHeritage":
    case "TSClassImplements":
      oxcToESTree(node.expression);
      if (node.typeParameters) oxcToESTree(node.typeParameters);
      break;
    case "TSTypeParameterDeclaration":
      for (const param of node.params) oxcToESTree(param);
      break;
    case "TSTypeParameter":
      oxcToESTree(node.name);
      if (node.constraint) oxcToESTree(node.constraint);
      if (node.default) oxcToESTree(node.default);
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
    case "TSIndexSignature":
      for (const param of node.parameters) {
        // @ts-expect-error
        param.type = "Identifier";
        oxcToESTree(param.typeAnnotation);
      }
      oxcToESTree(node.typeAnnotation);
      break;
    case "TSInferType":
      oxcToESTree(node.typeParameter);
      break;
    case "TSMappedType":
      oxcToESTree(node.typeParameter);
      if (node.nameType) oxcToESTree(node.nameType);
      if (node.typeAnnotation) oxcToESTree(node.typeAnnotation);
      // TODO: check if correct (ex typescript/lib/lib.es2020.promise.d.ts)
      if (node.optional === "none")
        // @ts-expect-error
        node.optional = undefined;
      if (node.readonly === "none")
        // @ts-expect-error
        node.readonly = undefined;
      break;
    case "TSConditionalType":
      oxcToESTree(node.checkType);
      oxcToESTree(node.extendsType);
      oxcToESTree(node.trueType);
      oxcToESTree(node.falseType);
      break;
    case "TSFunctionType":
      // @ts-expect-error
      node.params =
        // no error
        inlineFormalParameters(node.params, node.thisParam);
      oxcToESTree(node.returnType);
      if (node.typeParameters) oxcToESTree(node.typeParameters);
      // @ts-expect-error
      delete node.thisParam;
      break;
    case "TSMethodSignature":
      oxcToESTree(node.key);
      // @ts-expect-error
      node.params =
        // no error
        inlineFormalParameters(node.params, node.thisParam);
      if (node.returnType) oxcToESTree(node.returnType);
      if (node.typeParameters) oxcToESTree(node.typeParameters);
      // @ts-expect-error
      delete node.thisParam;
      break;
    case "TSCallSignatureDeclaration":
      // @ts-expect-error
      node.params =
        // no error
        inlineFormalParameters(node.params, node.thisParam);
      if (node.returnType) oxcToESTree(node.returnType);
      if (node.typeParameters) oxcToESTree(node.typeParameters);
      // @ts-expect-error
      delete node.thisParam;
      break;
    case "TSConstructSignatureDeclaration":
      // @ts-expect-error
      node.params =
        // no error
        inlineFormalParameters(node.params, null);
      if (node.returnType) oxcToESTree(node.returnType);
      if (node.typeParameters) oxcToESTree(node.typeParameters);
      break;
    case "TSDeclareFunction":
      if (node.id) oxcToESTree(node.id);
      // @ts-expect-error
      node.params =
        // no error
        inlineFormalParameters(node.params, null);
      if (node.returnType) oxcToESTree(node.returnType);
      if (node.typeParameters) oxcToESTree(node.typeParameters);
      break;
    case "ClassDeclaration":
    case "ClassExpression":
      if (node.id) oxcToESTree(node.id);
      if (node.superClass) oxcToESTree(node.superClass);
      for (const decl of node.body.body) oxcToESTree(decl);
      if (node.superTypeParameters) oxcToESTree(node.superTypeParameters);
      if (node.typeParameters) oxcToESTree(node.typeParameters);
      for (const d of node.decorators) oxcToESTree(d);
      if (node.implements) for (const i of node.implements) oxcToESTree(i);
      // @ts-expect-error
      node.abstract = // no error
        node.modifiers?.some((m) => m.kind.type === "abstract");
      // @ts-expect-error
      node.declare = // no error
        node.modifiers?.some((m) => m.kind.type === "declare");
      break;
    case "AccessorProperty":
      oxcToESTree(node.key);
      if (node.value) oxcToESTree(node.value);
      for (const d of node.decorators) oxcToESTree(d);
      break;
    case "MethodDefinition":
    case "TSAbstractMethodDefinition":
      oxcToESTree(node.key);
      oxcToESTree(node.value);
      for (const decorator of node.decorators) oxcToESTree(decorator);
      break;
    case "PropertyDefinition":
    case "TSAbstractPropertyDefinition":
      oxcToESTree(node.key);
      if (node.value) oxcToESTree(node.value);
      if (node.typeAnnotation) oxcToESTree(node.typeAnnotation);
      for (const decorator of node.decorators) oxcToESTree(decorator);
      break;
    case "TSInstantiationExpression":
      oxcToESTree(node.expression);
      oxcToESTree(node.typeParameters);
      break;
    case "TSNamespaceExportDeclaration":
      oxcToESTree(node.id);
      break;
    case "TSTemplateLiteralType":
      for (const type of node.types) oxcToESTree(type);
      break;
    case "TSConstructorType":
      // @ts-expect-error
      node.params =
        // no error
        inlineFormalParameters(node.params, null);
      oxcToESTree(node.returnType);
      if (node.typeParameters) oxcToESTree(node.typeParameters);
      break;
    case "TSTypePredicate":
      oxcToESTree(node.parameterName);
      if (node.typeAnnotation) oxcToESTree(node.typeAnnotation);
      break;
    case "TSNamedTupleMember":
      oxcToESTree(node.elementType);
      oxcToESTree(node.label);
      break;
    case "TSTupleType":
      for (const el of node.elementTypes) oxcToESTree(el);
      break;
    case "JSXAttribute":
      oxcToESTree(node.name);
      if (node.value) oxcToESTree(node.value);
      break;
    case "JSXMemberExpression":
      oxcToESTree(node.object);
      oxcToESTree(node.property);
      break;
    case "JSXFragment":
    case "JSXElement":
      for (const child of node.children) oxcToESTree(child);
      break;
    case "JSXOpeningElement":
      for (const attr of node.attributes) oxcToESTree(attr);
      if (node.typeParameters) oxcToESTree(node.typeParameters);
      break;
    case "MetaProperty":
      oxcToESTree(node.meta);
      oxcToESTree(node.property);
      break;
    case "TSThisKeyword":
      // @ts-expect-error
      node.type = "TSThisType";
      break;
    case "UsingDeclaration":
      // TODO convert to VariableDeclaration
      break;
    case "PrivateInExpression":
      // TODO: not an TSESTree node, find what to map
      break;
  }
  return node;
};

const inlineFormalParameters = (
  node: FormalParameters,
  thisParam: TSThisParameter | null,
): TSESTree.Parameter[] => {
  const items: any[] = [];
  if (thisParam) items.push({ type: "Identifier", name: "this" });
  for (const item of node.items) {
    items.push(inlineFormalParameter(item));
  }
  if (node.rest) {
    const typeAnnotation = node.rest.argument.typeAnnotation;
    if (typeAnnotation) oxcToESTree(typeAnnotation);
    items.push({
      type: "RestElement",
      argument: oxcToESTree(node.rest.argument.kind),
      typeAnnotation,
      optional: node.rest.argument.optional,
    });
  }
  return items;
};

const inlineFormalParameter = (node: FormalParameter): TSESTree.Parameter =>
  inlineBindingPattern(node.pattern);

const inlineBindingPattern = (node: BindingPattern): TSESTree.Parameter => {
  const { kind, typeAnnotation, optional } = node;
  if (typeAnnotation) oxcToESTree(typeAnnotation);
  return { ...oxcToESTree(kind), typeAnnotation, optional };
};
