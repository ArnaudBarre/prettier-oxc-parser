import { writeFileSync } from "node:fs";

export const saveJson = (name: string, ast: any) => {
  writeFileSync(
    `tmp/${name}.json`,
    JSON.stringify(
      ast,
      (_, v) => (typeof v === "bigint" ? `(BigInt) ${v}` : v),
      2,
    ),
  );
};
