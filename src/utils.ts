import { parseSync } from "oxc-parser";
import type {
  BindingPattern,
  ExpressionStatement,
  FormalParameter,
  FormalParameterRest,
  Node,
  Program,
  TSThisParameter,
} from "./oxc-types.ts";
import type { TSESTree } from "@typescript-eslint/types";
import { writeFileSync } from "node:fs";

export const oxcParse = (code: string, filename: string, debug?: boolean) => {
  const result = parseSync(filename, code, {
    preserveParens: false,
  });
  if (result.errors.length) throw new Error(result.errors[0].message);
  const program = result.program as unknown as Program & {
    comments: typeof result.comments;
  };
  setProp(program, "comments", result.comments);

  if (debug) writeFileSync("tmp/ast.json", JSON.stringify(program, null, 2));

  if (program.hashbang) {
    program.comments.unshift({
      type: "Line",
      value: program.hashbang.value.slice(0, -1),
      start: 0,
      end: program.hashbang.end - 1,
    });
  }

  // This is inlined so that StringLiteral.raw can be created
  // from the code variable without passing in each call
  const toESTree = (node: Node): any => {
    switch (node.type) {
      case "Program":
        // TODO: hashbang?
        for (const stmt of node.body) toESTree(stmt);
        break;
      case "BlockStatement":
      case "StaticBlock":
        for (const stmt of node.body) toESTree(stmt);
        break;
      case "ImportDeclaration":
        // TODO: withClause/attributes
        if (node.specifiers) {
          for (const specifier of node.specifiers) toESTree(specifier);
        }
        toESTree(node.source);
        break;
      case "ImportSpecifier":
        toESTree(node.local);
        toESTree(node.imported);
        break;
      case "ImportNamespaceSpecifier":
      case "ImportDefaultSpecifier":
        toESTree(node.local);
        break;
      case "ImportExpression":
        // TODO: arguments/attributes?
        toESTree(node.source);
        break;
      case "TSImportEqualsDeclaration":
        toESTree(node.id);
        toESTree(node.moduleReference);
        break;
      case "TSImportType":
        // TODO: ImportAttributes
        toESTree(node.argument);
        if (node.qualifier) toESTree(node.qualifier);
        if (node.typeParameters) toESTree(node.typeParameters);
        setProp(node, "typeArguments", node.typeParameters);
        break;
      case "ExportNamedDeclaration":
        setProp(node, "attributes", []);
        if (node.declaration) toESTree(node.declaration);
        if (node.source) toESTree(node.source);
        for (const specifier of node.specifiers) toESTree(specifier);
        break;
      case "ExportSpecifier":
        toESTree(node.local);
        toESTree(node.exported);
        break;
      case "ExportDefaultDeclaration":
        toESTree(node.declaration);
        toESTree(node.exported);
        break;
      case "ExportAllDeclaration":
        // TODO: withClause/attributes
        toESTree(node.source);
        if (node.exported) toESTree(node.exported);
        break;
      case "ExpressionStatement":
      case "ChainExpression":
      case "Decorator":
      case "TSExportAssignment":
      case "TSExternalModuleReference":
      case "TSNonNullExpression":
      case "JSXSpreadChild":
      case "JSXExpressionContainer":
        toESTree(node.expression);
        break;
      case "SequenceExpression":
        for (const expr of node.expressions) toESTree(expr);
        break;
      case "AssignmentExpression":
      case "BinaryExpression":
      case "LogicalExpression":
        toESTree(node.left);
        toESTree(node.right);
        break;
      case "CallExpression":
        toESTree(node.callee);
        for (const arg of node.arguments) toESTree(arg);
        if (node.typeParameters) toESTree(node.typeParameters);
        setProp(node, "typeArguments", node.typeParameters);
        break;
      case "IfStatement":
        toESTree(node.test);
        toESTree(node.consequent);
        if (node.alternate) toESTree(node.alternate);
        break;
      case "ConditionalExpression":
        toESTree(node.test);
        toESTree(node.consequent);
        toESTree(node.alternate);
        break;
      case "SwitchStatement":
        toESTree(node.discriminant);
        for (const c of node.cases) toESTree(c);
        break;
      case "SwitchCase":
        if (node.test) toESTree(node.test);
        for (const c of node.consequent) toESTree(c);
        break;
      case "ForStatement":
        if (node.init) toESTree(node.init);
        if (node.test) toESTree(node.test);
        if (node.update) toESTree(node.update);
        toESTree(node.body);
        break;
      case "WhileStatement":
      case "DoWhileStatement":
        toESTree(node.test);
        toESTree(node.body);
        break;
      case "ForOfStatement":
      case "ForInStatement":
        toESTree(node.left);
        toESTree(node.right);
        toESTree(node.body);
        break;
      case "TSAsExpression":
      case "TSTypeAssertion":
      case "TSSatisfiesExpression":
        toESTree(node.expression);
        toESTree(node.typeAnnotation);
        break;
      case "ThrowStatement":
      case "UpdateExpression":
      case "AwaitExpression":
      case "SpreadElement":
      case "JSXSpreadAttribute":
      case "ReturnStatement":
      case "YieldExpression":
        if (node.argument) toESTree(node.argument);
        break;
      case "UnaryExpression":
        setProp(node, "prefix", true);
        toESTree(node.argument);
        break;
      case "NewExpression":
        toESTree(node.callee);
        for (const arg of node.arguments) toESTree(arg);
        if (node.typeParameters) {
          node.typeParameters = toESTree(node.typeParameters);
        }
        setProp(node, "typeArguments", node.typeParameters);
        break;
      case "LabeledStatement":
        toESTree(node.label);
        toESTree(node.body);
        break;
      case "BreakStatement":
      case "ContinueStatement":
        if (node.label) toESTree(node.label);
        break;
      case "WithStatement":
        toESTree(node.object);
        toESTree(node.body);
        break;
      case "StaticMemberExpression":
        setProp(node, "type", "MemberExpression");
        setProp(node, "computed", false);
        node.object = toESTree(node.object);
        toESTree(node.property);
        break;
      case "ComputedMemberExpression":
        setProp(node, "type", "MemberExpression");
        setProp(node, "computed", true);
        node.object = toESTree(node.object);
        setProp(node, "property", toESTree(node.expression));
        deleteProp(node, "expression");
        break;
      case "PrivateFieldExpression":
        setProp(node, "type", "MemberExpression");
        node.object = toESTree(node.object);
        setProp(node, "property", toESTree(node.field));
        deleteProp(node, "field");
        break;
      case "StringLiteral":
        setProp(node, "type", "Literal");
        setProp(node, "raw", code.slice(node.start, node.end));
        break;
      case "BooleanLiteral":
        setProp(node, "type", "Literal");
        setProp(node, "raw", node.value ? "true" : "false");
        break;
      case "NumericLiteral":
        setProp(node, "type", "Literal");
        break;
      case "NullLiteral":
        setProp(node, "type", "Literal");
        setProp(node, "value", null);
        setProp(node, "raw", "null");
        break;
      case "BigIntLiteral":
        setProp(node, "extra", {
          rawValue: BigInt(node.raw.slice(0, -1)),
          raw: node.raw,
        });
        break;
      case "RegExpLiteral":
        setProp(node, "type", "Literal");
        setProp(node, "value", {});
        setProp(node, "raw", code.slice(node.start, node.end));
        break;
      case "TaggedTemplateExpression":
        toESTree(node.tag);
        toESTree(node.quasi);
        if (node.typeParameters) {
          node.typeParameters = toESTree(node.typeParameters);
        }
        setProp(node, "typeArguments", node.typeParameters);
        break;
      case "TemplateLiteral":
        for (const quasi of node.quasis) toESTree(quasi);
        for (const expr of node.expressions) toESTree(expr);
        break;
      case "ObjectExpression":
        for (const prop of node.properties) toESTree(prop);
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
        if (node.body) toESTree(node.body);
        if (node.typeParameters) toESTree(node.typeParameters);
        if (node.returnType) toESTree(node.returnType);
        break;
      case "FunctionDeclaration":
      case "TSDeclareFunction":
      case "FunctionExpression":
      case "TSEmptyBodyFunctionExpression":
        const declare = node.modifiers?.some((m) => m.kind === "declare");
        if (declare) setProp(node, "declare", true);
        if (node.id) toESTree(node.id);
        setProp(
          node,
          "params",
          inlineFormalParameters(node.params, node.thisParam),
        );
        if (node.body) toESTree(node.body);
        if (node.typeParameters) toESTree(node.typeParameters);
        if (node.returnType) toESTree(node.returnType);
        break;
      case "FunctionBody":
        setProp(node, "type", "BlockStatement");
        for (const stmt of node.statements) toESTree(stmt);
        setProp(node, "body", node.statements);
        deleteProp(node, "statements");
        break;
      case "ObjectProperty":
        setProp(node, "type", "Property");
        toESTree(node.key);
        toESTree(node.value);
        if (node.init) toESTree(node.init);
        break;
      case "VariableDeclaration":
        for (const decl of node.declarations) toESTree(decl);
        setProp(
          node,
          "declare",
          node.modifiers?.some((m) => m.kind === "declare") ?? false,
        );
        deleteProp(node, "modifiers");
        break;
      case "VariableDeclarator":
        handleBindingPattern(node.id);
        if (node.init) toESTree(node.init);
        break;
      case "ArrayExpression":
        for (let i = 0; i < node.elements.length; i++) {
          const el = node.elements[i];
          if ("type" in el) {
            toESTree(el);
          } else {
            // @ts-expect-error
            node.elements[i] = null;
          }
        }
        break;
      case "AssignmentPattern":
        handleBindingPattern(node.left);
        toESTree(node.right);
        break;
      case "ArrayPattern":
        for (let i = 0; i < node.elements.length; i++) {
          const el = node.elements[i];
          if (!el) continue;
          if (el.type === "RestElement") {
            toESTree(el);
          } else {
            handleBindingPattern(el);
          }
        }
        break;
      case "ArrayAssignmentTarget":
        setProp(node, "type", "ArrayPattern");
        for (let i = 0; i < node.elements.length; i++) {
          const el = node.elements[i];
          if (el) node.elements[i] = toESTree(el);
        }
        break;
      case "ObjectPattern":
        for (const prop of node.properties) toESTree(prop);
        break;
      case "ObjectAssignmentTarget":
        setProp(node, "type", "ObjectPattern");
        for (const prop of node.properties) toESTree(prop);
        break;
      case "AssignmentTargetPropertyIdentifier":
        setProp(node, "type", "Property");
        setProp(node, "key", toESTree(node.binding));
        setProp(node, "kind", "init");
        setProp(node, "shorthand", true);
        if (node.init) {
          setProp(node, "value", {
            type: "AssignmentPattern",
            start: node.binding.start,
            end: node.init.end,
            left: node.binding,
            right: toESTree(node.init),
          });
        } else {
          setProp(node, "value", node.binding);
        }
        deleteProp(node, "init");
        deleteProp(node, "binding");
        break;
      case "BindingProperty":
        setProp(node, "type", "Property");
        toESTree(node.key);
        handleBindingPattern(node.value);
        setProp(node, "kind", "init");
        break;
      case "RestElement":
        toESTree(node.argument);
        if ("typeAnnotation" in node && node.typeAnnotation) {
          toESTree(node.typeAnnotation);
          node.argument.end = node.typeAnnotation.start;
        }
        break;
      case "CatchClause":
        if (node.param) handleBindingPattern(node.param);
        toESTree(node.body);
        break;
      case "TryStatement":
        toESTree(node.block);
        if (node.handler) toESTree(node.handler);
        if (node.finalizer) toESTree(node.finalizer);
        break;
      case "TSTypeAnnotation":
      case "TSRestType":
      case "TSOptionalType":
        node.typeAnnotation = toESTree(node.typeAnnotation);
        break;
      case "TSTypeReference":
        toESTree(node.typeName);
        if (node.typeParameters) toESTree(node.typeParameters);
        setProp(node, "typeArguments", node.typeParameters);
        break;
      case "TSTypeQuery":
        toESTree(node.exprName);
        if (node.typeParameters) toESTree(node.typeParameters);
        setProp(node, "typeArguments", node.typeParameters);
        break;
      case "TSQualifiedName":
        toESTree(node.left);
        toESTree(node.right);
        break;
      case "TSArrayType":
        toESTree(node.elementType);
        break;
      case "TSTypeLiteral":
        for (const member of node.members) toESTree(member);
        break;
      case "TSModuleBlock":
        for (const stmt of node.body) toESTree(stmt);
        break;
      case "TSModuleDeclaration":
        toESTree(node.id);
        toESTree(node.body);
        setProp(
          node,
          "declare",
          node.modifiers?.some((m) => m.kind === "declare") ?? false,
        );
        deleteProp(node, "modifiers");
        break;
      case "TSIndexedAccessType":
        toESTree(node.objectType);
        toESTree(node.indexType);
        break;
      case "TSEnumDeclaration":
        toESTree(node.id);
        for (const member of node.members) toESTree(member);
        setProp(
          node,
          "declare",
          node.modifiers?.some((m) => m.kind === "declare"),
        );
        setProp(
          node,
          "const",
          node.modifiers?.some((m) => m.kind === "const"),
        );
        break;
      case "TSEnumMember":
        toESTree(node.id);
        if (node.initializer) toESTree(node.initializer);
        break;
      case "TSInterfaceDeclaration":
        toESTree(node.id);
        toESTree(node.body);
        if (node.typeParameters) toESTree(node.typeParameters);
        if (node.extends) for (const ext of node.extends) toESTree(ext);
        else setProp(node, "extends", []);
        setProp(
          node,
          "declare",
          node.modifiers?.some((m) => m.kind === "declare"),
        );
        deleteProp(node, "modifiers");
        break;
      case "TSInterfaceBody":
        for (const member of node.body) toESTree(member);
        break;
      case "TSTypeAliasDeclaration":
        toESTree(node.id);
        toESTree(node.typeAnnotation);
        if (node.typeParameters) toESTree(node.typeParameters);
        setProp(
          node,
          "declare",
          node.modifiers?.some((m) => m.kind === "declare"),
        );
        deleteProp(node, "modifiers");
        break;
      case "TSUnionType":
      case "TSIntersectionType":
        // https://github.com/prettier/prettier/blob/main/src/language-js/parse/postprocess/index.js#L117-L121
        if (node.types.length === 1) {
          const newNode = toESTree(node.types[0]);
          deleteProp(node, "types");
          for (const key in newNode) {
            setProp(node, key, newNode[key]);
          }
          return newNode;
        }
        for (const type of node.types) toESTree(type);
        break;
      case "TSPropertySignature":
        toESTree(node.key);
        if (node.typeAnnotation) toESTree(node.typeAnnotation);
        break;
      case "TSInterfaceHeritage":
      case "TSClassImplements":
        toESTree(node.expression);
        if (node.typeParameters) toESTree(node.typeParameters);
        setProp(node, "typeArguments", node.typeParameters);
        break;
      case "TSTypeParameterDeclaration":
        for (const param of node.params) toESTree(param);
        break;
      case "TSTypeParameter":
        toESTree(node.name);
        if (node.constraint) toESTree(node.constraint);
        if (node.default) toESTree(node.default);
        break;
      case "TSLiteralType":
        toESTree(node.literal);
        break;
      case "TSTypeParameterInstantiation":
        for (const type of node.params) toESTree(type);
        break;
      case "TSTypeOperator":
        toESTree(node.typeAnnotation);
        break;
      case "TSIndexSignature":
        for (const param of node.parameters) toESTree(param.typeAnnotation);
        toESTree(node.typeAnnotation);
        break;
      case "TSInferType":
        toESTree(node.typeParameter);
        break;
      case "TSMappedType":
        toESTree(node.typeParameter);
        if (node.nameType) toESTree(node.nameType);
        if (node.typeAnnotation) toESTree(node.typeAnnotation);
        if (node.optional === "none") setProp(node, "optional", false);
        if (node.readonly === "none") setProp(node, "readonly", false);
        break;
      case "TSConditionalType":
        toESTree(node.checkType);
        toESTree(node.extendsType);
        toESTree(node.trueType);
        toESTree(node.falseType);
        break;
      case "TSFunctionType":
        setProp(
          node,
          "params",
          inlineFormalParameters(node.params, node.thisParam),
        );
        toESTree(node.returnType);
        if (node.typeParameters) toESTree(node.typeParameters);
        deleteProp(node, "thisParam");
        break;
      case "TSMethodSignature":
        toESTree(node.key);
        setProp(
          node,
          "params",
          inlineFormalParameters(node.params, node.thisParam),
        );
        if (node.returnType) toESTree(node.returnType);
        if (node.typeParameters) toESTree(node.typeParameters);
        deleteProp(node, "thisParam");
        break;
      case "TSCallSignatureDeclaration":
        setProp(
          node,
          "params",
          inlineFormalParameters(node.params, node.thisParam),
        );
        if (node.returnType) toESTree(node.returnType);
        if (node.typeParameters) toESTree(node.typeParameters);
        deleteProp(node, "thisParam");
        break;
      case "TSConstructSignatureDeclaration":
        setProp(node, "params", inlineFormalParameters(node.params, null));
        if (node.returnType) toESTree(node.returnType);
        if (node.typeParameters) toESTree(node.typeParameters);
        break;
      case "ClassDeclaration":
      case "ClassExpression":
        if (node.id) toESTree(node.id);
        if (node.superClass) toESTree(node.superClass);
        toESTree(node.body);
        if (node.superTypeParameters) toESTree(node.superTypeParameters);
        if (node.typeParameters) toESTree(node.typeParameters);
        for (const d of node.decorators) toESTree(d);
        if (node.implements) for (const i of node.implements) toESTree(i);
        else setProp(node, "implements", []);
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
      case "ClassBody":
        for (const decl of node.body) toESTree(decl);
        break;
      case "AccessorProperty":
        toESTree(node.key);
        if (node.value) toESTree(node.value);
        for (const d of node.decorators) toESTree(d);
        break;
      case "MethodDefinition":
      case "TSAbstractMethodDefinition":
        toESTree(node.key);
        toESTree(node.value);
        for (const decorator of node.decorators) toESTree(decorator);
        break;
      case "PropertyDefinition":
      case "TSAbstractPropertyDefinition":
        toESTree(node.key);
        if (node.value) toESTree(node.value);
        if (node.typeAnnotation) toESTree(node.typeAnnotation);
        for (const decorator of node.decorators) toESTree(decorator);
        break;
      case "TSInstantiationExpression":
        toESTree(node.expression);
        toESTree(node.typeParameters);
        break;
      case "TSNamespaceExportDeclaration":
        toESTree(node.id);
        break;
      case "TSTemplateLiteralType":
        for (const type of node.types) toESTree(type);
        break;
      case "TSConstructorType":
        setProp(node, "params", inlineFormalParameters(node.params, null));
        toESTree(node.returnType);
        if (node.typeParameters) toESTree(node.typeParameters);
        break;
      case "TSTypePredicate":
        toESTree(node.parameterName);
        if (node.typeAnnotation) toESTree(node.typeAnnotation);
        break;
      case "TSNamedTupleMember":
        toESTree(node.elementType);
        toESTree(node.label);
        break;
      case "TSTupleType":
        for (const el of node.elementTypes) toESTree(el);
        break;
      case "JSXAttribute":
        toESTree(node.name);
        if (node.value) toESTree(node.value);
        break;
      case "JSXMemberExpression":
        toESTree(node.object);
        toESTree(node.property);
        break;
      case "JSXFragment":
        toESTree(node.openingFragment);
        for (const child of node.children) toESTree(child);
        toESTree(node.closingFragment);
        break;
      case "JSXElement":
        toESTree(node.openingElement);
        for (const child of node.children) toESTree(child);
        if (node.closingElement) toESTree(node.closingElement);
        break;
      case "JSXOpeningElement":
        toESTree(node.name);
        for (const attr of node.attributes) toESTree(attr);
        if (node.typeParameters) toESTree(node.typeParameters);
        setProp(node, "typeArguments", node.typeParameters);
        break;
      case "JSXClosingElement":
        toESTree(node.name);
        break;
      case "JSXText":
        setProp(node, "raw", node.value);
        break;
      case "MetaProperty":
        toESTree(node.meta);
        toESTree(node.property);
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
      if (typeAnnotation) toESTree(typeAnnotation);
      items.push({
        type: "Identifier",
        start: thisParam.start,
        end: thisParam.end,
        name: "this",
        typeAnnotation,
      });
    }
    for (const item of node.items) {
      items.push(inlineFormalParameter(item));
    }
    return items;
  };

  const inlineFormalParameter = (
    node: FormalParameter | FormalParameterRest,
  ) => {
    if (node.type === "RestElement") return toESTree(node);
    // https://github.com/typescript-eslint/typescript-eslint/blob/6954a4a463f9a2a1c20e41c91ee2c75c953dcc9f/packages/typescript-estree/src/convert.ts#L1738-L1748
    if (node.accessibility || node.readonly || node.override) {
      return {
        type: "TSParameterProperty",
        start: node.start,
        end: node.end,
        accessibility: node.accessibility,
        readonly: node.readonly,
        override: node.override,
        parameter: handleBindingPattern(node.pattern),
      };
    } else {
      return handleBindingPattern(node.pattern);
    }
  };

  const handleBindingPattern = (node: BindingPattern) => {
    if (node.typeAnnotation) {
      toESTree(node.typeAnnotation);
    }
    return toESTree(node);
  };

  return toESTree(program);
};

const setProp = (node: Node, key: string, value: any) => {
  (node as any)[key] = value;
};
const deleteProp = <T>(node: T, key: keyof T) => {
  delete node[key];
};
