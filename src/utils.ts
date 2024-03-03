import { parseSync } from "../../oxc/napi/parser/index.js";
import type {
  BindingPattern,
  ExpressionStatement,
  FormalParameter,
  FormalParameters,
  Node,
  Program,
  TSThisParameter,
} from "./oxc-types.ts";
import type { TSESTree } from "@typescript-eslint/types";

export const oxcParse = (code: string, filename: string) => {
  const result = parseSync(code, {
    sourceFilename: filename,
    preserveParens: false,
  });
  if (result.errors.length) throw new Error(result.errors[0]);
  const program = JSON.parse(result.program) as Program & {
    comments: {
      type: "Line" | "Block";
      value: string;
      start: number;
      end: number;
    }[];
  };
  for (const comment of result.comments) {
    comment.start -= 2;
    if (comment.type === "Block") comment.end += 2;
  }
  setProp(program, "comments", result.comments);
  if (program.hashbang) {
    program.comments.unshift({
      type: "Line",
      value: program.hashbang.value.slice(0, -1),
      start: 0,
      end: program.hashbang.end - 1,
    });
  }
  return program;
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
      deleteProp(node, "withClause");
      setProp(node, "attributes", []);
      if (node.specifiers) {
        for (const specifier of node.specifiers) oxcToESTree(specifier);
      }
      oxcToESTree(node.source);
      break;
    case "ImportSpecifier":
      oxcToESTree(node.local);
      oxcToESTree(node.imported);
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
      break;
    case "TSImportType":
      // TODO: ImportAttributes
      oxcToESTree(node.argument);
      if (node.qualifier) oxcToESTree(node.qualifier);
      if (node.typeParameters) oxcToESTree(node.typeParameters);
      setProp(node, "typeArguments", node.typeParameters);
      break;
    case "ExportNamedDeclaration":
      setProp(node, "attributes", []);
      if (node.declaration) oxcToESTree(node.declaration);
      if (node.source) oxcToESTree(node.source);
      for (const specifier of node.specifiers) oxcToESTree(specifier);
      break;
    case "ExportSpecifier":
      oxcToESTree(node.local);
      oxcToESTree(node.exported);
      break;
    case "ExportDefaultDeclaration":
      oxcToESTree(node.declaration);
      oxcToESTree(node.exported);
      break;
    case "ExportAllDeclaration":
      // TODO: withClause/attributes
      oxcToESTree(node.source);
      if (node.exported) oxcToESTree(node.exported);
      break;
    case "ExpressionStatement":
    case "ChainExpression":
    case "Decorator":
    case "TSExportAssignment":
    case "TSExternalModuleReference":
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
      node.left = oxcToESTree(node.left);
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
      setProp(node, "typeArguments", node.typeParameters);
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
    case "JSXSpreadAttribute":
    case "BindingRestElement":
      oxcToESTree(node.argument);
      break;
    case "ReturnStatement":
    case "YieldExpression":
      if (node.argument) oxcToESTree(node.argument);
      break;
    case "UnaryExpression":
      setProp(node, "prefix", true);
      oxcToESTree(node.argument);
      break;
    case "NewExpression":
      oxcToESTree(node.callee);
      for (const arg of node.arguments) oxcToESTree(arg);
      if (node.typeParameters) {
        node.typeParameters = oxcToESTree(node.typeParameters);
      }
      setProp(node, "typeArguments", node.typeParameters);
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
      setProp(node, "type", "MemberExpression");
      node.object = oxcToESTree(node.object);
      oxcToESTree(node.property);
      break;
    case "ComputedMemberExpression":
      setProp(node, "type", "MemberExpression");
      setProp(node, "computed", true);
      node.object = oxcToESTree(node.object);
      setProp(node, "property", oxcToESTree(node.expression));
      deleteProp(node, "expression");
      break;
    case "PrivateFieldExpression":
      setProp(node, "type", "MemberExpression");
      node.object = oxcToESTree(node.object);
      setProp(node, "property", oxcToESTree(node.field));
      deleteProp(node, "field");
      break;
    case "LabelIdentifier":
    case "IdentifierReference":
    case "IdentifierName":
    case "BindingIdentifier":
      setProp(node, "type", "Identifier");
      break;
    case "StringLiteral":
      setProp(node, "extra", { rawValue: node.value, raw: `"${node.value}"` });
      break;
    case "NumericLiteral":
      setProp(node, "extra", { rawValue: node.value, raw: `${node.raw}` });
      break;
    case "TaggedTemplateExpression":
      oxcToESTree(node.tag);
      oxcToESTree(node.quasi);
      if (node.typeParameters) {
        node.typeParameters = oxcToESTree(node.typeParameters);
      }
      setProp(node, "typeArguments", node.typeParameters);
      break;
    case "TemplateLiteral":
      for (const expr of node.expressions) oxcToESTree(expr);
      break;
    case "ObjectExpression":
      for (const prop of node.properties) oxcToESTree(prop);
      break;
    case "ArrowFunctionExpression":
      setProp(node, "generator", false);
      setProp(node, "id", null);
      if (node.expression) {
        setProp(
          node,
          "body",
          (node.body.statements[0] as ExpressionStatement).expression,
        );
      }
      setProp(node, "params", inlineFormalParameters(node.params, null));
      if (node.body) oxcToESTree(node.body);
      if (node.typeParameters) oxcToESTree(node.typeParameters);
      if (node.returnType) oxcToESTree(node.returnType);
      break;
    case "FunctionDeclaration":
    case "TSDeclareFunction":
    case "FunctionExpression":
    case "TSEmptyBodyFunctionExpression":
      const declare = node.modifiers?.some((m) => m.kind === "declare");
      if (declare) setProp(node, "declare", true);
      if (node.id) oxcToESTree(node.id);
      setProp(
        node,
        "params",
        inlineFormalParameters(node.params, node.thisParam),
      );
      if (node.body) oxcToESTree(node.body);
      if (node.typeParameters) oxcToESTree(node.typeParameters);
      if (node.returnType) oxcToESTree(node.returnType);
      break;
    case "FunctionBody":
      setProp(node, "type", "BlockStatement");
      for (const stmt of node.statements) oxcToESTree(stmt);
      setProp(node, "body", node.statements);
      deleteProp(node, "statements");
      break;
    case "ObjectProperty":
      setProp(node, "type", "Property");
      oxcToESTree(node.key);
      oxcToESTree(node.value);
      if (node.init) oxcToESTree(node.init);
      break;
    case "VariableDeclaration":
      for (const decl of node.declarations) oxcToESTree(decl);
      setProp(
        node,
        "declare",
        node.modifiers?.some((m) => m.kind === "declare") ?? false,
      );
      deleteProp(node, "modifiers");
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
      for (let i = 0; i < node.elements.length; i++) {
        const el = node.elements[i];
        if (el) node.elements[i] = oxcToESTree(el);
      }
      if (node.rest) {
        node.elements.push({
          // @ts-expect-error
          type: "RestElement",
          argument: oxcToESTree(node.rest.argument),
        });
        deleteProp(node, "rest");
      }
      break;
    case "ArrayAssignmentTarget":
      setProp(node, "type", "ArrayPattern");
      for (let i = 0; i < node.elements.length; i++) {
        const el = node.elements[i];
        if (el) node.elements[i] = oxcToESTree(el);
      }
      if (node.rest) {
        node.elements.push({
          // @ts-expect-error
          type: "RestElement",
          argument: oxcToESTree(node.rest),
        });
        deleteProp(node, "rest");
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
        deleteProp(node, "rest");
      }
      break;
    case "ObjectAssignmentTarget":
      setProp(node, "type", "ObjectPattern");
      for (const prop of node.properties) oxcToESTree(prop);
      if (node.rest) {
        node.properties.push({
          // @ts-expect-error
          type: "RestElement",
          argument: oxcToESTree(node.rest),
        });
        deleteProp(node, "rest");
      }
      break;
    case "BindingProperty":
      setProp(node, "type", "Property");
      oxcToESTree(node.key);
      node.value = oxcToESTree(node.value);
      setProp(node, "kind", "init");
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
      setProp(node, "typeArguments", node.typeParameters);
      break;
    case "TSTypeQuery":
      oxcToESTree(node.exprName);
      if (node.typeParameters) oxcToESTree(node.typeParameters);
      setProp(node, "typeArguments", node.typeParameters);
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
      oxcToESTree(node.id);
      oxcToESTree(node.body);
      setProp(
        node,
        "declare",
        node.modifiers?.some((m) => m.kind === "declare"),
      );
      deleteProp(node, "modifiers");
      break;
    case "TSIndexedAccessType":
      oxcToESTree(node.objectType);
      oxcToESTree(node.indexType);
      break;
    case "TSEnumDeclaration":
      oxcToESTree(node.id);
      for (const member of node.members) oxcToESTree(member);
      setProp(
        node,
        "declare",
        node.modifiers?.some((m) => m.kind === "declare"),
      );
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
      else setProp(node, "extends", []);
      setProp(
        node,
        "declare",
        node.modifiers?.some((m) => m.kind === "declare"),
      );
      deleteProp(node, "modifiers");
      break;
    case "TSTypeAliasDeclaration":
      oxcToESTree(node.id);
      oxcToESTree(node.typeAnnotation);
      if (node.typeParameters) oxcToESTree(node.typeParameters);
      setProp(
        node,
        "declare",
        node.modifiers?.some((m) => m.kind === "declare"),
      );
      deleteProp(node, "modifiers");
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
      setProp(node, "typeArguments", node.typeParameters);
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
    case "TSTypeOperator":
      oxcToESTree(node.typeAnnotation);
      break;
    case "TSIndexSignature":
      for (const param of node.parameters) {
        setProp(param, "type", "Identifier");
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
      if (node.optional === "none") setProp(node, "optional", false);
      if (node.readonly === "none") setProp(node, "readonly", false);
      break;
    case "TSConditionalType":
      oxcToESTree(node.checkType);
      oxcToESTree(node.extendsType);
      oxcToESTree(node.trueType);
      oxcToESTree(node.falseType);
      break;
    case "TSFunctionType":
      setProp(
        node,
        "params",
        inlineFormalParameters(node.params, node.thisParam),
      );
      oxcToESTree(node.returnType);
      if (node.typeParameters) oxcToESTree(node.typeParameters);
      deleteProp(node, "thisParam");
      break;
    case "TSMethodSignature":
      oxcToESTree(node.key);
      setProp(
        node,
        "params",
        inlineFormalParameters(node.params, node.thisParam),
      );
      if (node.returnType) oxcToESTree(node.returnType);
      if (node.typeParameters) oxcToESTree(node.typeParameters);
      deleteProp(node, "thisParam");
      break;
    case "TSCallSignatureDeclaration":
      setProp(
        node,
        "params",
        inlineFormalParameters(node.params, node.thisParam),
      );
      if (node.returnType) oxcToESTree(node.returnType);
      if (node.typeParameters) oxcToESTree(node.typeParameters);
      deleteProp(node, "thisParam");
      break;
    case "TSConstructSignatureDeclaration":
      setProp(node, "params", inlineFormalParameters(node.params, null));
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
      setProp(
        node,
        "abstract",
        node.modifiers?.some((m) => m.kind === "abstract"),
      );
      setProp(
        node,
        "declare",
        node.modifiers?.some((m) => m.kind === "declare"),
      );
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
      setProp(node, "params", inlineFormalParameters(node.params, null));
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
      setProp(node, "typeArguments", node.typeParameters);
      break;
    case "MetaProperty":
      oxcToESTree(node.meta);
      oxcToESTree(node.property);
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
  if (thisParam) {
    const typeAnnotation = thisParam.typeAnnotation;
    if (typeAnnotation) oxcToESTree(typeAnnotation);
    items.push({ type: "Identifier", name: "this", typeAnnotation });
  }
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

const inlineFormalParameter = (node: FormalParameter) => {
  // https://github.com/typescript-eslint/typescript-eslint/blob/6954a4a463f9a2a1c20e41c91ee2c75c953dcc9f/packages/typescript-estree/src/convert.ts#L1738-L1748
  if (node.accessibility || node.readonly || node.override) {
    return {
      type: "TSParameterProperty",
      accessibility: node.accessibility,
      readonly: node.readonly,
      override: node.override,
      parameter: inlineBindingPattern(node.pattern),
    };
  } else {
    return inlineBindingPattern(node.pattern);
  }
};

const inlineBindingPattern = (node: BindingPattern) => {
  const { kind, typeAnnotation, optional } = node;
  if (typeAnnotation) oxcToESTree(typeAnnotation);
  return typeAnnotation
    ? {
        ...oxcToESTree(kind),
        end: typeAnnotation.end,
        typeAnnotation,
        optional,
      }
    : { ...oxcToESTree(kind), optional };
};

const setProp = (node: Node, key: string, value: any) => {
  (node as any)[key] = value;
};
const deleteProp = <T>(node: T, key: keyof T) => {
  delete node[key];
};
