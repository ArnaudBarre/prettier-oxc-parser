import {
  parseSync,
  type Comment,
  type LogicalExpression,
  type Node,
  type Program,
  type TSTypeParameter,
} from "oxc-parser";
import { visitNode } from "./visitNode.ts";

export const oxcParse = (code: string, filename: string) => {
  const result = parseSync(filename, code, {
    preserveParens: false,
    // @ts-expect-error
    experimentalRawTransfer: true,
  });

  if (result.errors.length) throw new Error(result.errors[0].message);
  const isTS = filename.endsWith(".ts") || filename.endsWith(".tsx");

  const program = result.program as unknown as Program & {
    comments: Comment[];
  };
  setProp(program, "comments", result.comments);
  // https://github.com/prettier/prettier/blob/main/src/language-js/parse/postprocess/index.js#L186-L190
  if (program.type === "Program") {
    program.start = 0;
    program.end = code.length;
  }

  if (program.hashbang && isTS) {
    program.comments.unshift({
      type: "Line",
      start: 0,
      end: program.hashbang.end,
      value: program.hashbang.value,
    });
  }

  mergeNestledBlockComments(program.comments);
  for (const comment of program.comments) addLoc(comment);

  return visitNode(program, (node: Node): any => {
    addLoc(node);
    switch (node.type) {
      case "LogicalExpression":
        // https://github.com/prettier/prettier/blob/main/src/language-js/parse/postprocess/index.js#L89-L94
        if (isUnbalancedLogicalTree(node)) {
          return rebalanceLogicalTree(node);
        }
        break;
      case "VariableDeclaration":
        // https://github.com/prettier/prettier/blob/main/src/language-js/parse/postprocess/index.js#L112-L118
        const lastDeclaration = node.declarations.at(-1);
        if (
          lastDeclaration?.init &&
          code.slice(lastDeclaration.end, lastDeclaration.end + 1) !== ";"
        ) {
          node.end = lastDeclaration.end;
        }
        break;
      case "TSUnionType":
      case "TSIntersectionType":
        // https://github.com/prettier/prettier/blob/main/src/language-js/parse/postprocess/index.js#L141-L146
        if (node.types.length === 1) return node.types[0];
        break;

      // https://github.com/prettier/prettier/blob/main/src/language-js/loc.js#L15-L19
      case "ClassExpression":
      case "ClassDeclaration":
        if (node.decorators?.length) {
          node.start = Math.min(node.decorators[0].start, node.start);
        }
        break;
      case "ExportDefaultDeclaration":
      case "ExportNamedDeclaration":
        const decl = node.declaration;
        if (!decl) break;
        if (
          (decl.type === "ClassDeclaration" ||
            decl.type === "ClassExpression") &&
          decl.decorators?.length
        ) {
          node.start = Math.min(decl.decorators[0].start, node.start);
        }
        break;

      case "TSMappedType":
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
            default: null,
            out: false,
          } satisfies TSTypeParameter);
        }
        break;
      case "TSEnumDeclaration":
        // backward compatibility
        if (node.body) setProp(node, "members", node.body.members);
        break;
    }
  }) as typeof program;
};

const addLoc = (node: any) => {
  // Adding due to https://github.com/prettier/prettier/pull/17133 not being released yet
  node.loc = { start: node.start, end: node.end };
};

const setProp = (node: Node, key: string, value: any) => {
  (node as any)[key] = value;
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

// https://github.com/prettier/prettier/blob/main/src/language-js/parse/postprocess/index.js#L155
const mergeNestledBlockComments = (comments: Comment[]) => {
  for (let i = comments.length - 1; i > 0; i--) {
    const followingComment = comments[i];
    const comment = comments[i - 1];

    if (
      comment.end === followingComment.start &&
      comment.type === "Block" &&
      followingComment.type === "Block" &&
      isDocLikeBlockComment(comment) &&
      isDocLikeBlockComment(followingComment)
    ) {
      comments.splice(i, 1);
      comment.value += "*//*" + followingComment.value;
      comment.end = followingComment.end;
    }
  }
};
const isDocLikeBlockComment = (comment: Comment) => {
  const lines = `*${comment.value}*`.split("\n");
  return lines.length > 1 && lines.every((line) => line.trimStart()[0] === "*");
};
