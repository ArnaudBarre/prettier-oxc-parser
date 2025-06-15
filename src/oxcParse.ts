import {
  parseSync,
  type Comment,
  type LogicalExpression,
  type Node,
  type Program,
  rawTransferSupported,
} from "oxc-parser";
import { visitNode } from "./visitNode.ts";

export const oxcParse = (code: string, filename: string) => {
  const isTS = filename.endsWith(".ts") || filename.endsWith(".tsx");
  const result = parseSync(filename, code, {
    // `babel` parser produces `ParenthesizedExpression` and `TSParenthesizedType`,
    // but `typescript` parser doesn't
    preserveParens: isTS ? false : true,
    // @ts-expect-error
    experimentalRawTransfer: rawTransferSupported(),
  });

  if (result.errors.length) throw new Error(result.errors[0].message);

  const program = result.program as unknown as Program & {
    comments: Comment[];
  };
  setProp(program, "comments", result.comments);
  // https://github.com/prettier/prettier/blob/main/src/language-js/parse/postprocess/index.js#L225-L227
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

  let typeCastCommentsEnds: number[];

  return visitNode(program, (node: Node): any => {
    switch (node.type) {
      case "LogicalExpression":
        // https://github.com/prettier/prettier/blob/main/src/language-js/parse/postprocess/index.js#L90-95
        if (isUnbalancedLogicalTree(node)) {
          return rebalanceLogicalTree(node);
        }
        break;
      case "VariableDeclaration":
        // https://github.com/prettier/prettier/blob/main/src/language-js/parse/postprocess/index.js#L124-130
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
        // https://github.com/prettier/prettier/blob/main/src/language-js/parse/postprocess/index.js#L146-L151
        if (node.types.length === 1) return node.types[0];
        break;

      // JS only
      case "ParenthesizedExpression":
        // https://github.com/prettier/prettier/blob/main/src/language-js/parse/postprocess/index.js#L51-L88
        if (!typeCastCommentsEnds) {
          typeCastCommentsEnds = [];
          for (const comment of program.comments) {
            if (
              comment.type === "Block" &&
              comment.value[0] === "*" &&
              // TypeScript expects the type to be enclosed in curly brackets, however
              // Closure Compiler accepts types in parens and even without any delimiters at all.
              // That's why we just search for "@type" and "@satisfies".
              /@(?:type|satisfies)\b/u.test(comment.value)
            ) {
              typeCastCommentsEnds.push(comment.end);
            }
          }
        }
        const closestTypeCastCommentEnd = typeCastCommentsEnds.findLast(
          (end) => end <= node.start,
        );
        const keepTypeCast =
          closestTypeCastCommentEnd !== undefined &&
          // check that there are only white spaces between the comment and the parenthesis
          code.slice(closestTypeCastCommentEnd, node.start).trim().length === 0;
        if (!keepTypeCast) {
          return { ...node.expression, extra: { parenthesized: true } };
        }
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
    }
  }) as typeof program;
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

// https://github.com/prettier/prettier/blob/main/src/language-js/parse/postprocess/merge-nestled-jsdoc-comments.js
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
