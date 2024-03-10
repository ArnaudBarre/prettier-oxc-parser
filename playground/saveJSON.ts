import { writeFileSync } from "node:fs";

export const saveJson = (
  name: string,
  ast: any,
  replacer?: (key: string, value: any) => any,
) => {
  writeFileSync(
    `tmp/${name}.json`,
    JSON.stringify(
      ast,
      (k, v) => {
        if (typeof v === "bigint") return `(BigInt) ${v}`;
        return replacer ? replacer(k, v) : v;
      },
      2,
    ),
  );
};
