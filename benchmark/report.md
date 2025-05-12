## Benchmark report

- Plugin version: `0.1.0`
- Prettier version: `^3.5.3`

### JS(X)

#### 0000-kb.js

clk: ~3.12 GHz
cpu: Apple M1 Pro
runtime: node 23.11.0 (arm64-darwin)

| benchmark | avg              | min         | p75         | p99         | max         |
| --------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| oxc       | `137.25 µs/iter` | `105.83 µs` | `131.79 µs` | `724.04 µs` | `  1.93 ms` |
| babel     | `135.46 µs/iter` | `109.04 µs` | `129.83 µs` | `715.38 µs` | `  1.02 ms` |

#### 0001-kb.js

clk: ~3.17 GHz
cpu: Apple M1 Pro
runtime: node 23.11.0 (arm64-darwin)

| benchmark | avg              | min         | p75         | p99         | max         |
| --------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| oxc       | `848.40 µs/iter` | `682.08 µs` | `843.29 µs` | `  1.70 ms` | `  2.99 ms` |
| babel     | `948.77 µs/iter` | `792.42 µs` | `956.00 µs` | `  1.71 ms` | `  1.87 ms` |

#### 0003-kb.jsx

clk: ~3.16 GHz
cpu: Apple M1 Pro
runtime: node 23.11.0 (arm64-darwin)

| benchmark | avg              | min         | p75         | p99         | max         |
| --------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| oxc       | `  1.67 ms/iter` | `  1.38 ms` | `  1.69 ms` | `  2.99 ms` | `  3.66 ms` |
| babel     | `  1.89 ms/iter` | `  1.62 ms` | `  1.98 ms` | `  2.71 ms` | `  3.35 ms` |

#### 0005-kb.js

clk: ~3.16 GHz
cpu: Apple M1 Pro
runtime: node 23.11.0 (arm64-darwin)

| benchmark | avg              | min         | p75         | p99         | max         |
| --------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| oxc       | `  1.60 ms/iter` | `  1.34 ms` | `  1.62 ms` | `  2.68 ms` | `  3.23 ms` |
| babel     | `  1.97 ms/iter` | `  1.66 ms` | `  2.04 ms` | `  3.25 ms` | `  3.49 ms` |

#### 0006-kb.jsx

clk: ~3.11 GHz
cpu: Apple M1 Pro
runtime: node 23.11.0 (arm64-darwin)

| benchmark | avg              | min         | p75         | p99         | max         |
| --------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| oxc       | `  2.63 ms/iter` | `  2.04 ms` | `  2.83 ms` | `  4.14 ms` | `  5.13 ms` |
| babel     | `  3.05 ms/iter` | `  2.34 ms` | `  3.40 ms` | `  4.95 ms` | `  5.45 ms` |

#### 0010-kb.js

clk: ~3.09 GHz
cpu: Apple M1 Pro
runtime: node 23.11.0 (arm64-darwin)

| benchmark | avg              | min         | p75         | p99         | max         |
| --------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| oxc       | `  3.74 ms/iter` | `  2.99 ms` | `  4.02 ms` | `  6.65 ms` | `  9.10 ms` |
| babel     | `  4.29 ms/iter` | `  3.56 ms` | `  4.71 ms` | `  5.85 ms` | `  6.47 ms` |

#### 0028-kb.js

clk: ~2.98 GHz
cpu: Apple M1 Pro
runtime: node 23.11.0 (arm64-darwin)

| benchmark | avg              | min         | p75         | p99         | max         |
| --------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| oxc       | ` 10.63 ms/iter` | `  8.98 ms` | ` 10.92 ms` | ` 16.36 ms` | ` 16.54 ms` |
| babel     | ` 12.53 ms/iter` | ` 11.07 ms` | ` 12.67 ms` | ` 17.30 ms` | ` 17.45 ms` |

#### 0080-kb.mjs

clk: ~3.00 GHz
cpu: Apple M1 Pro
runtime: node 23.11.0 (arm64-darwin)

| benchmark | avg              | min         | p75         | p99         | max         |
| --------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| oxc       | ` 72.90 ms/iter` | ` 66.04 ms` | ` 75.38 ms` | ` 77.60 ms` | ` 98.88 ms` |
| babel     | ` 96.59 ms/iter` | ` 87.90 ms` | ` 97.52 ms` | `111.77 ms` | `124.81 ms` |

#### 0143-kb.js

clk: ~2.95 GHz
cpu: Apple M1 Pro
runtime: node 23.11.0 (arm64-darwin)

| benchmark | avg              | min         | p75         | p99         | max         |
| --------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| oxc       | ` 69.81 ms/iter` | ` 60.08 ms` | ` 67.90 ms` | ` 96.26 ms` | ` 99.32 ms` |
| babel     | ` 77.06 ms/iter` | ` 70.42 ms` | ` 80.95 ms` | ` 82.46 ms` | ` 98.00 ms` |

#### 0554-kb.js

clk: ~3.01 GHz
cpu: Apple M1 Pro
runtime: node 23.11.0 (arm64-darwin)

| benchmark | avg              | min         | p75         | p99         | max         |
| --------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| oxc       | `243.33 ms/iter` | `224.88 ms` | `251.40 ms` | `276.65 ms` | `285.38 ms` |
| babel     | `413.82 ms/iter` | `379.04 ms` | `422.88 ms` | `443.99 ms` | `472.80 ms` |

### TS(X)

#### 0000-kb.ts

clk: ~3.14 GHz
cpu: Apple M1 Pro
runtime: node 23.11.0 (arm64-darwin)

| benchmark  | avg              | min         | p75         | p99         | max         |
| ---------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| oxc-ts     | `357.55 µs/iter` | `281.54 µs` | `344.13 µs` | `  1.04 ms` | `  1.94 ms` |
| babel-ts   | `441.43 µs/iter` | `335.00 µs` | `435.04 µs` | `  1.42 ms` | `  1.68 ms` |
| typescript | `566.06 µs/iter` | `414.21 µs` | `563.04 µs` | `  1.77 ms` | `  2.12 ms` |

#### 0001-kb.tsx

clk: ~3.11 GHz
cpu: Apple M1 Pro
runtime: node 23.11.0 (arm64-darwin)

| benchmark  | avg              | min         | p75         | p99         | max         |
| ---------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| oxc-ts     | `642.10 µs/iter` | `517.33 µs` | `628.54 µs` | `  1.39 ms` | `  2.41 ms` |
| babel-ts   | `792.45 µs/iter` | `648.79 µs` | `791.17 µs` | `  1.64 ms` | `  2.24 ms` |
| typescript | `  1.09 ms/iter` | `858.50 µs` | `  1.09 ms` | `  2.46 ms` | `  2.94 ms` |

#### 0003-kb.tsx

clk: ~3.16 GHz
cpu: Apple M1 Pro
runtime: node 23.11.0 (arm64-darwin)

| benchmark  | avg              | min         | p75         | p99         | max         |
| ---------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| oxc-ts     | `  1.06 ms/iter` | `903.79 µs` | `  1.04 ms` | `  1.75 ms` | `  2.63 ms` |
| babel-ts   | `  1.38 ms/iter` | `  1.12 ms` | `  1.42 ms` | `  2.45 ms` | `  3.16 ms` |
| typescript | `  1.90 ms/iter` | `  1.53 ms` | `  1.95 ms` | `  3.76 ms` | `  4.54 ms` |

#### 0007-kb.ts

clk: ~3.16 GHz
cpu: Apple M1 Pro
runtime: node 23.11.0 (arm64-darwin)

| benchmark  | avg              | min         | p75         | p99         | max         |
| ---------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| oxc-ts     | `  3.51 ms/iter` | `  2.92 ms` | `  3.85 ms` | `  5.43 ms` | `  6.10 ms` |
| babel-ts   | `  4.91 ms/iter` | `  3.79 ms` | `  5.35 ms` | `  7.14 ms` | `  7.40 ms` |
| typescript | `  5.81 ms/iter` | `  4.79 ms` | `  6.22 ms` | `  8.06 ms` | `  8.26 ms` |

#### 0008-kb.tsx

clk: ~3.16 GHz
cpu: Apple M1 Pro
runtime: node 23.11.0 (arm64-darwin)

| benchmark  | avg              | min         | p75         | p99         | max         |
| ---------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| oxc-ts     | `  4.05 ms/iter` | `  3.39 ms` | `  4.32 ms` | `  6.13 ms` | `  8.00 ms` |
| babel-ts   | `  5.04 ms/iter` | `  4.22 ms` | `  5.43 ms` | `  7.09 ms` | `  8.21 ms` |
| typescript | `  6.84 ms/iter` | `  5.61 ms` | `  7.23 ms` | `  9.62 ms` | ` 10.11 ms` |

#### 0015-kb.tsx

clk: ~3.15 GHz
cpu: Apple M1 Pro
runtime: node 23.11.0 (arm64-darwin)

| benchmark  | avg              | min         | p75         | p99         | max         |
| ---------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| oxc-ts     | `  5.02 ms/iter` | `  4.42 ms` | `  5.27 ms` | `  6.43 ms` | `  6.65 ms` |
| babel-ts   | `  5.79 ms/iter` | `  5.10 ms` | `  6.12 ms` | `  6.73 ms` | `  7.28 ms` |
| typescript | `  8.04 ms/iter` | `  6.92 ms` | `  8.40 ms` | `  9.80 ms` | ` 10.17 ms` |

#### 0021-kb.tsx

clk: ~3.15 GHz
cpu: Apple M1 Pro
runtime: node 23.11.0 (arm64-darwin)

| benchmark  | avg              | min         | p75         | p99         | max         |
| ---------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| oxc-ts     | `  5.32 ms/iter` | `  4.68 ms` | `  5.59 ms` | `  6.91 ms` | `  7.68 ms` |
| babel-ts   | `  6.73 ms/iter` | `  5.91 ms` | `  7.13 ms` | `  7.64 ms` | `  7.70 ms` |
| typescript | `  9.48 ms/iter` | `  8.16 ms` | `  9.79 ms` | ` 11.17 ms` | ` 12.48 ms` |

#### 0022-kb.tsx

clk: ~3.16 GHz
cpu: Apple M1 Pro
runtime: node 23.11.0 (arm64-darwin)

| benchmark  | avg              | min         | p75         | p99         | max         |
| ---------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| oxc-ts     | `  7.52 ms/iter` | `  6.51 ms` | `  7.82 ms` | `  9.65 ms` | ` 10.81 ms` |
| babel-ts   | `  9.96 ms/iter` | `  8.55 ms` | ` 10.21 ms` | ` 11.99 ms` | ` 12.55 ms` |
| typescript | ` 13.09 ms/iter` | ` 12.12 ms` | ` 13.44 ms` | ` 16.06 ms` | ` 16.85 ms` |

#### 0040-kb.ts

clk: ~3.16 GHz
cpu: Apple M1 Pro
runtime: node 23.11.0 (arm64-darwin)

| benchmark  | avg              | min         | p75         | p99         | max         |
| ---------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| oxc-ts     | ` 17.58 ms/iter` | ` 15.95 ms` | ` 17.87 ms` | ` 21.13 ms` | ` 21.43 ms` |
| babel-ts   | ` 23.61 ms/iter` | ` 21.63 ms` | ` 23.91 ms` | ` 26.22 ms` | ` 30.27 ms` |
| typescript | ` 30.60 ms/iter` | ` 27.90 ms` | ` 31.73 ms` | ` 34.18 ms` | ` 35.47 ms` |

#### 0050-kb.ts

clk: ~3.17 GHz
cpu: Apple M1 Pro
runtime: node 23.11.0 (arm64-darwin)

| benchmark  | avg              | min         | p75         | p99         | max         |
| ---------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| oxc-ts     | ` 16.44 ms/iter` | ` 14.92 ms` | ` 17.02 ms` | ` 18.27 ms` | ` 18.69 ms` |
| babel-ts   | ` 20.71 ms/iter` | ` 19.17 ms` | ` 21.49 ms` | ` 22.72 ms` | ` 23.83 ms` |
| typescript | ` 27.33 ms/iter` | ` 25.85 ms` | ` 27.61 ms` | ` 29.14 ms` | ` 29.17 ms` |

#### 2922-kb.ts

clk: ~3.12 GHz
cpu: Apple M1 Pro
runtime: node 23.11.0 (arm64-darwin)

| benchmark  | avg              | min         | p75         | p99         | max         |
| ---------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| oxc-ts     | `727.29 ms/iter` | `689.22 ms` | `748.71 ms` | `760.04 ms` | `768.59 ms` |
| babel-ts   | `965.07 ms/iter` | `921.21 ms` | `987.59 ms` | `   1.01 s` | `   1.02 s` |
| typescript | `   1.24 s/iter` | `   1.17 s` | `   1.26 s` | `   1.29 s` | `   1.31 s` |
