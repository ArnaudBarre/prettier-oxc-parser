## Benchmark report

- Plugin version: `0.1.0`
- Prettier version: `^3.5.3`

### JS(X)

#### 0000-kb.js

clk: ~3.16 GHz
cpu: Apple M1 Pro
runtime: node 23.11.0 (arm64-darwin)

| benchmark | avg              | min         | p75         | p99         | max         |
| --------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| oxc       | `143.16 µs/iter` | `105.96 µs` | `138.04 µs` | `700.46 µs` | `  2.04 ms` |
| babel     | `129.78 µs/iter` | `108.42 µs` | `124.88 µs` | `683.08 µs` | `  1.27 ms` |

#### 0001-kb.js

clk: ~3.15 GHz
cpu: Apple M1 Pro
runtime: node 23.11.0 (arm64-darwin)

| benchmark | avg              | min         | p75         | p99         | max         |
| --------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| oxc       | `942.16 µs/iter` | `693.04 µs` | `947.50 µs` | `  2.29 ms` | `  7.74 ms` |
| babel     | `  1.06 ms/iter` | `803.38 µs` | `  1.13 ms` | `  1.98 ms` | `  2.37 ms` |

#### 0003-kb.jsx

clk: ~3.07 GHz
cpu: Apple M1 Pro
runtime: node 23.11.0 (arm64-darwin)

| benchmark | avg              | min         | p75         | p99         | max         |
| --------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| oxc       | `  1.78 ms/iter` | `  1.43 ms` | `  1.88 ms` | `  3.01 ms` | `  3.39 ms` |
| babel     | `  2.09 ms/iter` | `  1.69 ms` | `  2.22 ms` | `  3.30 ms` | `  4.01 ms` |

#### 0005-kb.js

clk: ~3.13 GHz
cpu: Apple M1 Pro
runtime: node 23.11.0 (arm64-darwin)

| benchmark | avg              | min         | p75         | p99         | max         |
| --------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| oxc       | `  1.63 ms/iter` | `  1.33 ms` | `  1.69 ms` | `  2.90 ms` | `  3.36 ms` |
| babel     | `  2.02 ms/iter` | `  1.68 ms` | `  2.07 ms` | `  3.22 ms` | `  4.05 ms` |

#### 0006-kb.jsx

clk: ~3.13 GHz
cpu: Apple M1 Pro
runtime: node 23.11.0 (arm64-darwin)

| benchmark | avg              | min         | p75         | p99         | max         |
| --------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| oxc       | `  2.42 ms/iter` | `  1.98 ms` | `  2.59 ms` | `  4.07 ms` | `  4.51 ms` |
| babel     | `  2.79 ms/iter` | `  2.32 ms` | `  3.06 ms` | `  4.12 ms` | `  4.27 ms` |

#### 0010-kb.js

clk: ~3.14 GHz
cpu: Apple M1 Pro
runtime: node 23.11.0 (arm64-darwin)

| benchmark | avg              | min         | p75         | p99         | max         |
| --------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| oxc       | `  3.80 ms/iter` | `  2.92 ms` | `  4.13 ms` | `  7.08 ms` | ` 12.40 ms` |
| babel     | `  4.27 ms/iter` | `  3.49 ms` | `  4.63 ms` | `  5.86 ms` | `  6.71 ms` |

#### 0028-kb.js

clk: ~3.10 GHz
cpu: Apple M1 Pro
runtime: node 23.11.0 (arm64-darwin)

| benchmark | avg              | min         | p75         | p99         | max         |
| --------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| oxc       | ` 10.08 ms/iter` | `  8.77 ms` | ` 10.19 ms` | ` 13.80 ms` | ` 15.81 ms` |
| babel     | ` 11.52 ms/iter` | ` 10.60 ms` | ` 11.77 ms` | ` 13.52 ms` | ` 13.72 ms` |

#### 0080-kb.mjs

clk: ~3.15 GHz
cpu: Apple M1 Pro
runtime: node 23.11.0 (arm64-darwin)

| benchmark | avg              | min         | p75         | p99         | max         |
| --------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| oxc       | ` 70.14 ms/iter` | ` 63.58 ms` | ` 72.99 ms` | ` 73.33 ms` | ` 94.63 ms` |
| babel     | ` 89.57 ms/iter` | ` 78.53 ms` | ` 91.95 ms` | ` 96.39 ms` | `104.84 ms` |

#### 0143-kb.js

clk: ~3.05 GHz
cpu: Apple M1 Pro
runtime: node 23.11.0 (arm64-darwin)

| benchmark | avg              | min         | p75         | p99         | max         |
| --------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| oxc       | ` 64.94 ms/iter` | ` 55.73 ms` | ` 66.19 ms` | ` 71.93 ms` | ` 93.52 ms` |
| babel     | ` 75.00 ms/iter` | ` 68.85 ms` | ` 76.12 ms` | ` 80.55 ms` | ` 90.72 ms` |

#### 0554-kb.js

clk: ~3.16 GHz
cpu: Apple M1 Pro
runtime: node 23.11.0 (arm64-darwin)

| benchmark | avg              | min         | p75         | p99         | max         |
| --------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| oxc       | `247.98 ms/iter` | `224.76 ms` | `260.53 ms` | `271.01 ms` | `277.44 ms` |
| babel     | `456.96 ms/iter` | `409.40 ms` | `458.86 ms` | `531.08 ms` | `539.54 ms` |

### TS(X)

#### 0000-kb.ts

clk: ~3.09 GHz
cpu: Apple M1 Pro
runtime: node 23.11.0 (arm64-darwin)

| benchmark  | avg              | min         | p75         | p99         | max         |
| ---------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| oxc-ts     | `378.84 µs/iter` | `288.33 µs` | `369.54 µs` | `  1.18 ms` | `  2.57 ms` |
| typescript | `543.44 µs/iter` | `425.46 µs` | `527.29 µs` | `  1.73 ms` | `  2.16 ms` |

#### 0001-kb.tsx

clk: ~3.14 GHz
cpu: Apple M1 Pro
runtime: node 23.11.0 (arm64-darwin)

| benchmark  | avg              | min         | p75         | p99         | max         |
| ---------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| oxc-ts     | `707.25 µs/iter` | `528.29 µs` | `670.42 µs` | `  1.90 ms` | `  8.88 ms` |
| typescript | `  1.19 ms/iter` | `884.00 µs` | `  1.21 ms` | `  2.66 ms` | `  2.97 ms` |

#### 0003-kb.tsx

clk: ~3.14 GHz
cpu: Apple M1 Pro
runtime: node 23.11.0 (arm64-darwin)

| benchmark  | avg              | min         | p75         | p99         | max         |
| ---------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| oxc-ts     | `  1.14 ms/iter` | `926.75 µs` | `  1.15 ms` | `  2.18 ms` | `  3.22 ms` |
| typescript | `  2.01 ms/iter` | `  1.53 ms` | `  2.08 ms` | `  4.50 ms` | `  5.71 ms` |

#### 0007-kb.ts

clk: ~3.13 GHz
cpu: Apple M1 Pro
runtime: node 23.11.0 (arm64-darwin)

| benchmark  | avg              | min         | p75         | p99         | max         |
| ---------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| oxc-ts     | `  3.50 ms/iter` | `  2.91 ms` | `  3.83 ms` | `  5.57 ms` | `  6.13 ms` |
| typescript | `  5.84 ms/iter` | `  4.85 ms` | `  6.25 ms` | `  8.80 ms` | `  9.23 ms` |

#### 0008-kb.tsx

clk: ~3.15 GHz
cpu: Apple M1 Pro
runtime: node 23.11.0 (arm64-darwin)

| benchmark  | avg              | min         | p75         | p99         | max         |
| ---------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| oxc-ts     | `  3.91 ms/iter` | `  3.29 ms` | `  4.13 ms` | `  7.83 ms` | ` 10.07 ms` |
| typescript | `  6.48 ms/iter` | `  5.50 ms` | `  6.94 ms` | `  7.82 ms` | `  8.62 ms` |

#### 0015-kb.tsx

clk: ~3.14 GHz
cpu: Apple M1 Pro
runtime: node 23.11.0 (arm64-darwin)

| benchmark  | avg              | min         | p75         | p99         | max         |
| ---------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| oxc-ts     | `  4.97 ms/iter` | `  4.35 ms` | `  5.22 ms` | `  6.43 ms` | `  7.56 ms` |
| typescript | `  8.14 ms/iter` | `  6.94 ms` | `  8.40 ms` | ` 10.24 ms` | ` 10.54 ms` |

#### 0021-kb.tsx

clk: ~3.07 GHz
cpu: Apple M1 Pro
runtime: node 23.11.0 (arm64-darwin)

| benchmark  | avg              | min         | p75         | p99         | max         |
| ---------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| oxc-ts     | `  5.64 ms/iter` | `  4.82 ms` | `  5.97 ms` | `  7.01 ms` | `  8.03 ms` |
| typescript | ` 10.45 ms/iter` | `  8.92 ms` | ` 10.58 ms` | ` 14.79 ms` | ` 15.89 ms` |

#### 0022-kb.tsx

clk: ~3.15 GHz
cpu: Apple M1 Pro
runtime: node 23.11.0 (arm64-darwin)

| benchmark  | avg              | min         | p75         | p99         | max         |
| ---------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| oxc-ts     | `  9.23 ms/iter` | `  7.12 ms` | `  9.54 ms` | ` 16.40 ms` | ` 21.82 ms` |
| typescript | ` 14.09 ms/iter` | ` 12.82 ms` | ` 14.65 ms` | ` 18.20 ms` | ` 20.31 ms` |

#### 0040-kb.ts

clk: ~3.10 GHz
cpu: Apple M1 Pro
runtime: node 23.11.0 (arm64-darwin)

| benchmark  | avg              | min         | p75         | p99         | max         |
| ---------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| oxc-ts     | ` 18.17 ms/iter` | ` 16.20 ms` | ` 18.31 ms` | ` 23.89 ms` | ` 24.92 ms` |
| typescript | ` 31.84 ms/iter` | ` 28.98 ms` | ` 33.11 ms` | ` 34.87 ms` | ` 35.19 ms` |

#### 0050-kb.ts

clk: ~3.11 GHz
cpu: Apple M1 Pro
runtime: node 23.11.0 (arm64-darwin)

| benchmark  | avg              | min         | p75         | p99         | max         |
| ---------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| oxc-ts     | ` 17.18 ms/iter` | ` 14.88 ms` | ` 17.45 ms` | ` 24.95 ms` | ` 28.74 ms` |
| typescript | ` 28.79 ms/iter` | ` 26.38 ms` | ` 29.08 ms` | ` 34.38 ms` | ` 34.83 ms` |

#### 2922-kb.ts

clk: ~3.11 GHz
cpu: Apple M1 Pro
runtime: node 23.11.0 (arm64-darwin)

| benchmark  | avg              | min         | p75         | p99         | max         |
| ---------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| oxc-ts     | `768.79 ms/iter` | `716.40 ms` | `781.09 ms` | `825.67 ms` | `840.51 ms` |
| typescript | `   1.41 s/iter` | `   1.21 s` | `   1.44 s` | `   1.51 s` | `   1.76 s` |
