import {
  parseSync,
  type LogicalExpression,
  type TSQualifiedName,
} from "oxc-parser";
import type { Node, Program, MemberExpression } from "./oxc-types.ts";
import { saveJson } from "../playground/json.ts";

export const oxcParse = (code: string, filename: string, debug?: boolean) => {
  const result = parseSync(filename, code, {
    preserveParens: false,
  });
  if (result.errors.length) {
    throw new Error(result.errors[0].message);
  }
  const program = result.program as unknown as Program & {
    comments: typeof result.comments;
  };
  setProp(program, "comments", result.comments);

  if (debug) saveJson("ast", program);

  if (program.hashbang) {
    program.comments.unshift({
      type: "Line",
      start: 0,
      end: program.hashbang.end,
      value: program.hashbang.value,
    });
    deleteProp(program, "hashbang");
  }

  // This is inlined so that StringLiteral.raw can be created
  // from the code variable without passing in each call
  const toESTree = (node: Node): any => {
    setProp(node, "visited", true);

    switch (node.type) {
      case "Program":
        for (const stmt of node.body) toESTree(stmt);
        break;
      case "ExportDefaultDeclaration":
        toESTree(node.declaration);
        break;
      case "ExportNamedDeclaration":
        if (node.declaration) toESTree(node.declaration);
        break;
      case "BlockStatement":
        for (const stmt of node.body) toESTree(stmt);
        break;
      case "ExpressionStatement":
        toESTree(node.expression);
        break;
      case "NewExpression":
      case "CallExpression":
        toESTree(node.callee);
        for (const arg of node.arguments) toESTree(arg);
        if (node.typeArguments) toESTree(node.typeArguments);
        break;
      case "TaggedTemplateExpression":
        if (node.typeArguments) toESTree(node.typeArguments);
        break;
      case "UnaryExpression":
      case "ReturnStatement":
      case "YieldExpression":
        if (node.argument) toESTree(node.argument);
        break;
      case "VariableDeclaration":
        for (const decl of node.declarations) toESTree(decl);
        // https://github.com/prettier/prettier/blob/main/src/language-js/parse/postprocess/index.js#L100-L107
        const lastDeclaration = node.declarations.at(-1);
        if (
          lastDeclaration?.init &&
          code.slice(lastDeclaration.end, lastDeclaration.end + 1) !== ";"
        ) {
          node.end = lastDeclaration.end;
        }
        break;
      case "VariableDeclarator":
        toESTree(node.id);
        if (node.init) toESTree(node.init);
        break;
      case "ArrowFunctionExpression":
        if (node.body) toESTree(node.body);
        if (node.returnType) toESTree(node.returnType);
        if (node.typeParameters) toESTree(node.typeParameters);
        for (const param of node.params) toESTree(param);
        break;
      case "FunctionExpression":
      case "FunctionDeclaration":
        if (node.body) toESTree(node.body);
        if (node.returnType) toESTree(node.returnType);
        if (node.typeParameters) toESTree(node.typeParameters);
        for (const param of node.params) toESTree(param);
        break;
      case "SwitchStatement":
        for (const caseClause of node.cases) toESTree(caseClause);
        break;
      case "SwitchCase":
        for (const test of node.consequent) toESTree(test);
        break;
      case "ClassDeclaration":
      case "ClassExpression":
        toESTree(node.body);
        if (node.typeParameters) toESTree(node.typeParameters);
        if (node.superTypeArguments) toESTree(node.superTypeArguments);
        if (node.implements) {
          for (const impl of node.implements) {
            // implements NodeJS.ReadableStream
            if (impl.expression.type === "TSQualifiedName") {
              const newNode: MemberExpression = {
                type: "MemberExpression",
                start: impl.expression.start,
                end: impl.expression.end,
                computed: false,
                object: impl.expression.left as any,
                optional: false,
                property: impl.expression.right,
              };
              impl.expression = newNode as any;
            }
            toESTree(impl);
          }
        }
        break;
      case "ClassBody":
        for (const property of node.body) toESTree(property);
        break;
      case "MethodDefinition":
      case "TSAbstractMethodDefinition":
        toESTree(node.key);
        if (node.value) toESTree(node.value);
        if (node.decorators) {
          for (const decorator of node.decorators) toESTree(decorator);
        }
        break;
      case "PropertyDefinition":
        toESTree(node.key);
        if (node.typeAnnotation) toESTree(node.typeAnnotation);
        if (node.value) toESTree(node.value);
        if (node.decorators) {
          for (const decorator of node.decorators) toESTree(decorator);
        }
        break;
      case "ObjectExpression":
        for (const property of node.properties) toESTree(property);
        break;
      case "Property":
        toESTree(node.value);
        break;
      case "ArrayExpression":
        for (const element of node.elements) if (element) toESTree(element);
        break;
      case "SpreadElement":
        toESTree(node.argument);
        break;
      case "ConditionalExpression":
        toESTree(node.test);
        toESTree(node.consequent);
        toESTree(node.alternate);
        break;
      case "IfStatement":
        node.test = toESTree(node.test);
        node.consequent = toESTree(node.consequent);
        if (node.alternate) node.alternate = toESTree(node.alternate);
        break;
      case "BinaryExpression":
        node.left = toESTree(node.left);
        node.right = toESTree(node.right);
        break;
      case "LogicalExpression":
        if (isUnbalancedLogicalTree(node)) {
          return rebalanceLogicalTree(node);
        }
        node.left = toESTree(node.left);
        node.right = toESTree(node.right);
        break;
      case "AwaitExpression":
      case "ThrowStatement":
        toESTree(node.argument);
        break;
      case "ChainExpression":
        toESTree(node.expression);
        break;
      case "ForStatement":
      case "ForOfStatement":
        toESTree(node.body);
        break;
      case "ObjectPattern":
        for (const property of node.properties) toESTree(property);
        break;
      case "AssignmentExpression":
      case "AssignmentPattern":
        toESTree(node.left);
        toESTree(node.right);
        break;
      case "MemberExpression":
        toESTree(node.object);
        toESTree(node.property);
        break;
      case "TryStatement":
        toESTree(node.block);
        if (node.handler) toESTree(node.handler);
        break;
      case "CatchClause":
        if (node.param) toESTree(node.param);
        toESTree(node.body);
        break;
      case "TemplateLiteral":
        for (const expressions of node.expressions) toESTree(expressions);
        break;
      case "DoWhileStatement":
      case "WhileStatement":
        toESTree(node.test);
        toESTree(node.body);
        break;
      case "AccessorProperty":
        if (node.value) toESTree(node.value);
        break;
      case "Decorator":
        toESTree(node.expression);
        break;

      // JSX
      case "JSXOpeningElement":
        toESTree(node.name);
        for (const prop of node.attributes) toESTree(prop);
        if (node.typeArguments) toESTree(node.typeArguments);
        break;
      case "JSXExpressionContainer":
        toESTree(node.expression);
        break;
      case "JSXFragment":
        for (const child of node.children) toESTree(child);
        break;
      case "JSXElement":
        toESTree(node.openingElement);
        for (const child of node.children) toESTree(child);
        if (node.closingElement) toESTree(node.closingElement);
        break;
      case "JSXAttribute":
        toESTree(node.name);
        if (node.value) toESTree(node.value);
        break;
      case "JSXSpreadAttribute":
        toESTree(node.argument);
        break;
      case "JSXClosingElement":
        toESTree(node.name);
        break;
      case "JSXNamespacedName":
      case "JSXText":
        break;

      // TS
      case "TSAsExpression":
      case "TSSatisfiesExpression":
        toESTree(node.typeAnnotation);
        toESTree(node.expression);
        break;
      case "TSNonNullExpression":
        toESTree(node.expression);
        break;
      case "TSTypeReference":
      case "TSClassImplements":
      case "TSInterfaceHeritage":
      case "TSImportType":
        if (node.typeArguments) toESTree(node.typeArguments);
        break;
      case "TSInstantiationExpression":
        if (node.expression) toESTree(node.expression);
        break;
      case "TSTypeQuery":
        if (node.typeArguments) toESTree(node.typeArguments);
        toESTree(node.exprName);
        if (
          node.exprName.type === "Identifier" &&
          node.exprName.name === "this"
        ) {
          node.exprName.type = "ThisExpression" as any;
        }
        break;
      case "TSQualifiedName":
        if (node.left.type === "Identifier" && node.left.name === "this") {
          node.left.type = "ThisExpression" as any;
        }
        toESTree(node.left);
        break;
      case "TSTypePredicate":
        if (node.typeAnnotation) toESTree(node.typeAnnotation);
        if (
          node.parameterName.type === "Identifier" &&
          node.parameterName.name === "this"
        ) {
          node.parameterName.type = "TSThisType" as any;
        }
        break;
      case "TSTypeAliasDeclaration":
        toESTree(node.typeAnnotation);
        if (node.typeParameters) toESTree(node.typeParameters);
        break;
      case "TSTypeOperator":
      case "TSTypeAnnotation":
      case "Identifier":
      case "TSPropertySignature":
        if (node.typeAnnotation) toESTree(node.typeAnnotation);
        break;
      case "TSIndexedAccessType":
        node.objectType = toESTree(node.objectType);
        toESTree(node.indexType);
        break;
      case "TSMappedType":
        if (node.nameType) toESTree(node.nameType);
        if (node.constraint) toESTree(node.constraint);
        if (node.typeAnnotation) toESTree(node.typeAnnotation);
        // backward compatibility
        if (node.constraint) {
          setProp(node, "typeParameter", {
            type: "TSTypeParameter",
            start: node.key.start,
            end: node.constraint.end,
            const: false,
            constraint: node.constraint,
            in: false,
            name: node.key,
            out: false,
          });
        }
        break;
      case "TSUnionType":
      case "TSIntersectionType":
        // https://github.com/prettier/prettier/blob/main/src/language-js/parse/postprocess/index.js#L129-L135
        if (node.types.length === 1) {
          return toESTree(node.types[0]);
        }
        for (let i = 0; i < node.types.length; i++) {
          node.types[i] = toESTree(node.types[i]);
        }
        break;
      case "TSConditionalType":
        node.checkType = toESTree(node.checkType);
        node.extendsType = toESTree(node.extendsType);
        node.trueType = toESTree(node.trueType);
        node.falseType = toESTree(node.falseType);
        break;
      case "TSTypeParameterInstantiation":
        for (let i = 0; i < node.params.length; i++) {
          node.params[i] = toESTree(node.params[i]);
        }
        break;
      case "TSModuleDeclaration":
        setProp(node, "global", node.kind === "global"); // deprecated, adding for diff compatibility
        if (
          code.slice(node.id.end, node.id.end + 1) === "." &&
          node.body?.type === "TSModuleDeclaration"
        ) {
          // declare namespace monaco.languages.css {}
          const qualifiedName: TSQualifiedName = {
            type: "TSQualifiedName",
            start: node.id.start,
            end: node.body.id.end,
            left: node.id as any,
            right: node.body.id as any,
          };
          node.id = qualifiedName as any;
          node.body = node.body.body;
          toESTree(node);
        } else {
          if (node.body) toESTree(node.body);
        }
        break;
      case "TSModuleBlock":
        for (const stmt of node.body) toESTree(stmt);
        break;
      case "TSInterfaceDeclaration":
        toESTree(node.body);
        if (node.typeParameters) toESTree(node.typeParameters);
        if (node.extends) {
          for (const property of node.extends) toESTree(property);
        }
        break;
      case "TSInterfaceBody":
        for (const property of node.body) toESTree(property);
        break;
      case "TSInferType":
        toESTree(node.typeParameter);
        break;
      case "TSMethodSignature":
        if (node.returnType) toESTree(node.returnType);
        for (const param of node.params) toESTree(param);
        if (node.typeParameters) toESTree(node.typeParameters);
        break;
      case "TSParenthesizedType":
        // https://github.com/oxc-project/oxc/issues/9616
        return node.typeAnnotation;
      case "TSConstructSignatureDeclaration":
        for (const param of node.params) toESTree(param);
        if (node.returnType) toESTree(node.returnType);
        break;
      case "TSTypeParameterDeclaration":
        for (const param of node.params) toESTree(param);
        break;
      case "TSTypeParameter":
        if (node.constraint) toESTree(node.constraint);
        if (node.default) toESTree(node.default);
        break;
      case "TSFunctionType":
      case "TSEmptyBodyFunctionExpression":
        if (node.returnType) toESTree(node.returnType);
        for (const param of node.params) toESTree(param);
        if (node.typeParameters) toESTree(node.typeParameters);
        break;
      case "TSTypeLiteral":
        for (const property of node.members) toESTree(property);
        break;
      case "TSArrayType":
        node.elementType = toESTree(node.elementType);
        break;
      case "TSTemplateLiteralType":
        for (const type of node.types) toESTree(type);
        break;
      case "TSTupleType":
        for (let i = 0; i < node.elementTypes.length; i++) {
          node.elementTypes[i] = toESTree(node.elementTypes[i]);
        }
        break;
      case "TSNamedTupleMember":
        if (node.elementType) toESTree(node.elementType);
        break;
      case "TSDeclareFunction":
        if (node.returnType) toESTree(node.returnType);
        if (node.typeParameters) toESTree(node.typeParameters);
        for (const param of node.params) toESTree(param);
        break;
      case "TSConstructorType":
      case "TSCallSignatureDeclaration":
        if (node.returnType) toESTree(node.returnType);
        if (node.typeParameters) toESTree(node.typeParameters);
        for (const param of node.params) toESTree(param);
        break;
      case "TSEnumDeclaration":
        if (node.body) {
          toESTree(node.body);
          // backward compatibility
          setProp(node, "members", node.body.members);
        }
        break;
      case "TSEnumBody":
        for (const member of node.members) toESTree(member);
        break;
      case "TSEnumMember":
        if (node.initializer) toESTree(node.initializer);
        break;
    }
    return node;
  };

  return toESTree(program) as typeof program;
};

const setProp = (node: Node, key: string, value: any) => {
  (node as any)[key] = value;
};
const deleteProp = <T>(node: T, key: keyof T) => {
  delete node[key];
};

const isUnbalancedLogicalTree = (
  node: LogicalExpression,
): node is LogicalExpression & { right: LogicalExpression } =>
  node.right.type === "LogicalExpression" &&
  node.operator === node.right.operator;

const rebalanceLogicalTree = (node: LogicalExpression): LogicalExpression => {
  if (!isUnbalancedLogicalTree(node)) return node;

  return rebalanceLogicalTree({
    type: "LogicalExpression",
    operator: node.operator,
    left: rebalanceLogicalTree({
      type: "LogicalExpression",
      operator: node.operator,
      left: node.left,
      right: node.right.left,
      start: node.left.start,
      end: node.right.left.end,
    }),
    right: node.right.right,
    start: node.start,
    end: node.end,
  });
};
