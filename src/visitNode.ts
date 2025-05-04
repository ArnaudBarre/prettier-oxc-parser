import type { Node } from "oxc-parser";
import { visitorKeys } from "./visitor-keys.ts";

export const visitNode = (node: any, fn: (node: Node) => Node) => {
  if (!node) return node;
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) {
      node[i] = visitNode(node[i], fn);
    }
    return node;
  }

  const keys = visitorKeys[node.type];
  if (!keys) return node;

  for (const key of keys) {
    node[key] = visitNode(node[key], fn);
  }

  return fn(node) ?? node;
};
