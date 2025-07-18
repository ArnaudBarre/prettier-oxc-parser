## Benchmark report

- Plugin version: `0.2.0`
- Prettier version: `^3.6.2`

### JS(X)

#### 0000-kb.js

clk: ~3.08 GHz
cpu: Apple M1 Pro
runtime: node 24.3.0 (arm64-darwin)

| benchmark            | avg              | min         | p75         | p99         | max         |
| -------------------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| prettier-oxc-parser  | `143.32 µs/iter` | `113.67 µs` | `139.00 µs` | `355.21 µs` | `  3.08 ms` |
| @prettier/plugin-oxc | `148.70 µs/iter` | `127.83 µs` | `143.21 µs` | `261.04 µs` | `  2.50 ms` |
| babel                | `129.98 µs/iter` | `111.67 µs` | `124.88 µs` | `192.13 µs` | `  2.92 ms` |

#### 0001-kb.js

clk: ~3.13 GHz
cpu: Apple M1 Pro
runtime: node 24.3.0 (arm64-darwin)

| benchmark            | avg              | min         | p75         | p99         | max         |
| -------------------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| prettier-oxc-parser  | `917.93 µs/iter` | `727.13 µs` | `940.08 µs` | `  1.84 ms` | `  2.37 ms` |
| @prettier/plugin-oxc | `  1.17 ms/iter` | `917.29 µs` | `  1.21 ms` | `  2.60 ms` | `  6.31 ms` |
| babel                | `980.85 µs/iter` | `782.83 µs` | `  1.01 ms` | `  2.33 ms` | `  5.79 ms` |

#### 0003-kb.jsx

clk: ~3.07 GHz
cpu: Apple M1 Pro
runtime: node 24.3.0 (arm64-darwin)

| benchmark            | avg              | min         | p75         | p99         | max         |
| -------------------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| prettier-oxc-parser  | `  1.83 ms/iter` | `  1.50 ms` | `  1.87 ms` | `  3.34 ms` | `  4.29 ms` |
| @prettier/plugin-oxc | `  2.26 ms/iter` | `  1.92 ms` | `  2.34 ms` | `  3.55 ms` | `  4.10 ms` |
| babel                | `  1.96 ms/iter` | `  1.63 ms` | `  2.05 ms` | `  3.31 ms` | `  4.49 ms` |

#### 0005-kb.js

clk: ~2.94 GHz
cpu: Apple M1 Pro
runtime: node 24.3.0 (arm64-darwin)

| benchmark            | avg              | min         | p75         | p99         | max         |
| -------------------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| prettier-oxc-parser  | `  1.80 ms/iter` | `  1.47 ms` | `  1.88 ms` | `  3.30 ms` | `  3.82 ms` |
| @prettier/plugin-oxc | `  2.13 ms/iter` | `  1.85 ms` | `  2.15 ms` | `  3.54 ms` | `  4.91 ms` |
| babel                | `  1.91 ms/iter` | `  1.63 ms` | `  1.90 ms` | `  4.15 ms` | `  4.44 ms` |

#### 0006-kb.jsx

clk: ~3.13 GHz
cpu: Apple M1 Pro
runtime: node 24.3.0 (arm64-darwin)

| benchmark            | avg              | min         | p75         | p99         | max         |
| -------------------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| prettier-oxc-parser  | `  2.69 ms/iter` | `  2.21 ms` | `  2.82 ms` | `  4.63 ms` | `  5.20 ms` |
| @prettier/plugin-oxc | `  3.13 ms/iter` | `  2.70 ms` | `  3.24 ms` | `  4.40 ms` | `  5.93 ms` |
| babel                | `  2.62 ms/iter` | `  2.26 ms` | `  2.61 ms` | `  5.00 ms` | `  5.21 ms` |

#### 0010-kb.js

clk: ~3.10 GHz
cpu: Apple M1 Pro
runtime: node 24.3.0 (arm64-darwin)

| benchmark            | avg              | min         | p75         | p99         | max         |
| -------------------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| prettier-oxc-parser  | `  3.89 ms/iter` | `  3.20 ms` | `  4.17 ms` | `  6.93 ms` | `  7.02 ms` |
| @prettier/plugin-oxc | `  4.57 ms/iter` | `  4.05 ms` | `  4.86 ms` | `  5.86 ms` | `  8.80 ms` |
| babel                | `  3.93 ms/iter` | `  3.47 ms` | `  3.97 ms` | `  6.07 ms` | `  6.27 ms` |

#### 0028-kb.js

clk: ~3.14 GHz
cpu: Apple M1 Pro
runtime: node 24.3.0 (arm64-darwin)

| benchmark            | avg              | min         | p75         | p99         | max         |
| -------------------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| prettier-oxc-parser  | ` 10.36 ms/iter` | `  8.90 ms` | ` 10.91 ms` | ` 13.92 ms` | ` 14.18 ms` |
| @prettier/plugin-oxc | ` 12.53 ms/iter` | ` 10.94 ms` | ` 13.09 ms` | ` 16.49 ms` | ` 18.64 ms` |
| babel                | ` 10.99 ms/iter` | `  9.69 ms` | ` 11.86 ms` | ` 14.05 ms` | ` 14.60 ms` |

#### 0080-kb.mjs

clk: ~3.15 GHz
cpu: Apple M1 Pro
runtime: node 24.3.0 (arm64-darwin)

| benchmark            | avg              | min         | p75         | p99         | max         |
| -------------------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| prettier-oxc-parser  | ` 81.65 ms/iter` | ` 67.35 ms` | ` 83.76 ms` | `101.89 ms` | `109.88 ms` |
| @prettier/plugin-oxc | ` 97.51 ms/iter` | ` 87.57 ms` | ` 98.30 ms` | `115.31 ms` | `122.38 ms` |
| babel                | ` 89.58 ms/iter` | ` 77.92 ms` | ` 92.13 ms` | ` 99.50 ms` | `128.88 ms` |

#### 0143-kb.js

clk: ~3.12 GHz
cpu: Apple M1 Pro
runtime: node 24.3.0 (arm64-darwin)

| benchmark            | avg              | min         | p75         | p99         | max         |
| -------------------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| prettier-oxc-parser  | ` 73.40 ms/iter` | ` 62.22 ms` | ` 78.07 ms` | ` 79.93 ms` | `106.59 ms` |
| @prettier/plugin-oxc | ` 88.49 ms/iter` | ` 78.95 ms` | ` 85.99 ms` | `106.71 ms` | `114.64 ms` |
| babel                | ` 76.84 ms/iter` | ` 70.90 ms` | ` 77.52 ms` | ` 83.08 ms` | `103.23 ms` |

#### 0554-kb.js

clk: ~3.13 GHz
cpu: Apple M1 Pro
runtime: node 24.3.0 (arm64-darwin)

| benchmark            | avg              | min         | p75         | p99         | max         |
| -------------------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| prettier-oxc-parser  | `256.81 ms/iter` | `241.18 ms` | `264.68 ms` | `274.81 ms` | `292.05 ms` |
| @prettier/plugin-oxc | `315.99 ms/iter` | `298.18 ms` | `316.55 ms` | `343.73 ms` | `362.02 ms` |
| babel                | `277.83 ms/iter` | `262.64 ms` | `271.64 ms` | `300.57 ms` | `342.61 ms` |

### TS(X)

#### 0000-kb.ts

clk: ~3.12 GHz
cpu: Apple M1 Pro
runtime: node 24.3.0 (arm64-darwin)

| benchmark            | avg              | min         | p75         | p99         | max         |
| -------------------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| prettier-oxc-parser  | `406.88 µs/iter` | `307.38 µs` | `400.46 µs` | `  1.26 ms` | `  2.89 ms` |
| @prettier/plugin-oxc | `476.66 µs/iter` | `403.04 µs` | `478.08 µs` | `  1.15 ms` | `  2.32 ms` |
| babel-ts             | `407.56 µs/iter` | `340.21 µs` | `400.04 µs` | `733.75 µs` | `  3.32 ms` |
| typescript           | `526.14 µs/iter` | `415.13 µs` | `506.50 µs` | `  1.20 ms` | `  4.95 ms` |

#### 0001-kb.tsx

clk: ~3.13 GHz
cpu: Apple M1 Pro
runtime: node 24.3.0 (arm64-darwin)

| benchmark            | avg              | min         | p75         | p99         | max         |
| -------------------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| prettier-oxc-parser  | `712.94 µs/iter` | `558.29 µs` | `729.33 µs` | `  1.74 ms` | `  2.17 ms` |
| @prettier/plugin-oxc | `904.93 µs/iter` | `710.00 µs` | `956.42 µs` | `  2.26 ms` | `  2.93 ms` |
| babel-ts             | `813.83 µs/iter` | `639.79 µs` | `825.79 µs` | `  2.64 ms` | `  4.50 ms` |
| typescript           | `  1.17 ms/iter` | `850.08 µs` | `  1.24 ms` | `  4.96 ms` | `  6.53 ms` |

#### 0003-kb.tsx

clk: ~3.09 GHz
cpu: Apple M1 Pro
runtime: node 24.3.0 (arm64-darwin)

| benchmark            | avg              | min         | p75         | p99         | max         |
| -------------------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| prettier-oxc-parser  | `  1.27 ms/iter` | `997.38 µs` | `  1.30 ms` | `  2.45 ms` | `  3.63 ms` |
| @prettier/plugin-oxc | `  1.44 ms/iter` | `  1.25 ms` | `  1.48 ms` | `  2.75 ms` | `  3.02 ms` |
| babel-ts             | `  1.34 ms/iter` | `  1.11 ms` | `  1.32 ms` | `  3.31 ms` | `  3.67 ms` |
| typescript           | `  1.81 ms/iter` | `  1.52 ms` | `  1.76 ms` | `  5.80 ms` | `  6.82 ms` |

#### 0007-kb.ts

clk: ~3.13 GHz
cpu: Apple M1 Pro
runtime: node 24.3.0 (arm64-darwin)

| benchmark            | avg              | min         | p75         | p99         | max         |
| -------------------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| prettier-oxc-parser  | `  3.78 ms/iter` | `  3.14 ms` | `  4.03 ms` | `  6.13 ms` | `  7.92 ms` |
| @prettier/plugin-oxc | `  5.30 ms/iter` | `  4.69 ms` | `  5.45 ms` | `  7.09 ms` | `  7.13 ms` |
| babel-ts             | `  4.28 ms/iter` | `  3.68 ms` | `  4.31 ms` | `  6.95 ms` | `  7.05 ms` |
| typescript           | `  5.63 ms/iter` | `  4.66 ms` | `  5.81 ms` | `  9.52 ms` | ` 10.78 ms` |

#### 0008-kb.tsx

clk: ~3.14 GHz
cpu: Apple M1 Pro
runtime: node 24.3.0 (arm64-darwin)

| benchmark            | avg              | min         | p75         | p99         | max         |
| -------------------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| prettier-oxc-parser  | `  4.47 ms/iter` | `  3.76 ms` | `  4.71 ms` | `  7.27 ms` | `  8.28 ms` |
| @prettier/plugin-oxc | `  5.40 ms/iter` | `  4.74 ms` | `  5.68 ms` | `  7.08 ms` | `  8.74 ms` |
| babel-ts             | `  4.73 ms/iter` | `  4.19 ms` | `  4.78 ms` | `  6.99 ms` | `  7.14 ms` |
| typescript           | `  6.37 ms/iter` | `  5.38 ms` | `  6.48 ms` | `  9.90 ms` | ` 10.18 ms` |

#### 0015-kb.tsx

clk: ~3.15 GHz
cpu: Apple M1 Pro
runtime: node 24.3.0 (arm64-darwin)

| benchmark            | avg              | min         | p75         | p99         | max         |
| -------------------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| prettier-oxc-parser  | `  5.90 ms/iter` | `  4.88 ms` | `  6.21 ms` | `  8.96 ms` | ` 10.05 ms` |
| @prettier/plugin-oxc | `  6.79 ms/iter` | `  6.05 ms` | `  7.31 ms` | `  8.51 ms` | `  8.75 ms` |
| babel-ts             | `  6.02 ms/iter` | `  5.25 ms` | `  6.17 ms` | `  8.10 ms` | `  8.20 ms` |
| typescript           | `  8.01 ms/iter` | `  6.76 ms` | `  8.36 ms` | ` 12.28 ms` | ` 12.72 ms` |

#### 0021-kb.tsx

clk: ~3.14 GHz
cpu: Apple M1 Pro
runtime: node 24.3.0 (arm64-darwin)

| benchmark            | avg              | min         | p75         | p99         | max         |
| -------------------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| prettier-oxc-parser  | `  6.35 ms/iter` | `  5.39 ms` | `  6.70 ms` | `  9.76 ms` | ` 11.03 ms` |
| @prettier/plugin-oxc | `  7.78 ms/iter` | `  6.93 ms` | `  8.27 ms` | `  9.55 ms` | `  9.74 ms` |
| babel-ts             | `  6.94 ms/iter` | `  6.10 ms` | `  7.19 ms` | `  9.30 ms` | `  9.55 ms` |
| typescript           | `  9.40 ms/iter` | `  7.99 ms` | `  9.88 ms` | ` 12.95 ms` | ` 12.96 ms` |

#### 0022-kb.tsx

clk: ~3.14 GHz
cpu: Apple M1 Pro
runtime: node 24.3.0 (arm64-darwin)

| benchmark            | avg              | min         | p75         | p99         | max         |
| -------------------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| prettier-oxc-parser  | `  8.48 ms/iter` | `  7.20 ms` | `  8.81 ms` | ` 13.60 ms` | ` 13.74 ms` |
| @prettier/plugin-oxc | ` 10.48 ms/iter` | `  9.47 ms` | ` 11.13 ms` | ` 12.64 ms` | ` 13.33 ms` |
| babel-ts             | `  9.40 ms/iter` | `  8.28 ms` | `  9.61 ms` | ` 12.31 ms` | ` 12.85 ms` |
| typescript           | ` 13.03 ms/iter` | ` 11.01 ms` | ` 14.69 ms` | ` 18.28 ms` | ` 18.34 ms` |

#### 0040-kb.ts

clk: ~3.15 GHz
cpu: Apple M1 Pro
runtime: node 24.3.0 (arm64-darwin)

| benchmark            | avg              | min         | p75         | p99         | max         |
| -------------------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| prettier-oxc-parser  | ` 18.38 ms/iter` | ` 16.02 ms` | ` 18.87 ms` | ` 23.31 ms` | ` 26.33 ms` |
| @prettier/plugin-oxc | ` 31.52 ms/iter` | ` 28.89 ms` | ` 32.67 ms` | ` 35.79 ms` | ` 36.19 ms` |
| babel-ts             | ` 20.60 ms/iter` | ` 18.00 ms` | ` 21.91 ms` | ` 23.63 ms` | ` 24.32 ms` |
| typescript           | ` 27.84 ms/iter` | ` 23.91 ms` | ` 29.69 ms` | ` 32.43 ms` | ` 33.42 ms` |

#### 0050-kb.ts

clk: ~3.13 GHz
cpu: Apple M1 Pro
runtime: node 24.3.0 (arm64-darwin)

| benchmark            | avg              | min         | p75         | p99         | max         |
| -------------------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| prettier-oxc-parser  | ` 16.89 ms/iter` | ` 14.73 ms` | ` 17.64 ms` | ` 19.98 ms` | ` 21.51 ms` |
| @prettier/plugin-oxc | ` 24.22 ms/iter` | ` 22.08 ms` | ` 25.49 ms` | ` 28.48 ms` | ` 29.62 ms` |
| babel-ts             | ` 18.82 ms/iter` | ` 16.85 ms` | ` 20.11 ms` | ` 21.02 ms` | ` 21.54 ms` |
| typescript           | ` 25.28 ms/iter` | ` 21.71 ms` | ` 27.54 ms` | ` 29.42 ms` | ` 30.07 ms` |

#### 2922-kb.ts

clk: ~3.15 GHz
cpu: Apple M1 Pro
runtime: node 24.3.0 (arm64-darwin)

| benchmark            | avg              | min         | p75         | p99         | max         |
| -------------------- | ---------------- | ----------- | ----------- | ----------- | ----------- |
| prettier-oxc-parser  | `736.98 ms/iter` | `699.35 ms` | `759.10 ms` | `766.22 ms` | `772.35 ms` |
| @prettier/plugin-oxc | `   1.13 s/iter` | `   1.09 s` | `   1.14 s` | `   1.17 s` | `   1.20 s` |
| babel-ts             | `847.85 ms/iter` | `800.45 ms` | `863.65 ms` | `887.26 ms` | `945.56 ms` |
| typescript           | `   1.09 s/iter` | `   1.03 s` | `   1.13 s` | `   1.16 s` | `   1.16 s` |

Main results

### JS(X)

| File size            | Small (1kb) | Medium (10kb) | Large (28kb) |
| -------------------- | ----------- | ------------- | ------------ |
| prettier-oxc-parser  | `0.9 ms`    | `3.9 ms`      | `10.4 ms`    |
| @prettier/plugin-oxc | `1.2 ms`    | `4.6 ms`      | `12.5 ms`    |
| default              | `1.0 ms`    | `3.9 ms`      | `11.0 ms`    |

### TS(X)

| File size            | Small (1kb) | Medium (7kb) | Large (40kb) | TS Compiler |
| -------------------- | ----------- | ------------ | ------------ | ----------- |
| prettier-oxc-parser  | `0.7 ms`    | `3.8 ms`     | `18.4 ms`    | `737 ms`    |
| @prettier/plugin-oxc | `0.9 ms`    | `5.3 ms`     | `31.5 ms`    | `1132 ms`   |
| babel-ts             | `0.8 ms`    | `4.3 ms`     | `20.6 ms`    | `848 ms`    |
| default              | `1.2 ms`    | `5.6 ms`     | `27.8 ms`    | `1093 ms`   |
