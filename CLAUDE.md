# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

```bash
pnpm build          # 构建库，产物输出到 dist/
pnpm dev            # 监听模式构建
pnpm test           # 运行测试（无测试文件时也通过）
pnpm test:watch     # 监听模式运行测试
pnpm lint           # ESLint 检查
pnpm commit         # 使用 commitizen 交互式提交
pnpm release        # standard-version 发布（更新版本号 + CHANGELOG）
pnpm release:alpha  # 发布 alpha 预发布版本
```

运行单个测试文件：
```bash
pnpm vitest run src/composables/use-xxx.spec.ts
```

## Architecture

### Build System

Vite library mode（[vite.config.ts](vite.config.ts)），仅输出 ESM（`formats: ['es']`）。`vite-plugin-dts` + `tsconfig.lib.json` 生成 `.d.ts` 声明文件。

### Entry Points

5 个独立构建入口，每个对应 `package.json` 的一个 `exports` 路径：

| 源文件 | 产物 | 外部导入路径 |
|---|---|---|
| `src/index.ts` | `dist/index.js` | `@buka/nuxt-kit` |
| `src/composables/index.ts` | `dist/composables/index.js` | `@buka/nuxt-kit/composables` |
| `src/components/index.ts` | `dist/components/index.js` | `@buka/nuxt-kit/components` |
| `src/utils/index.ts` | `dist/utils/index.js` | `@buka/nuxt-kit/utils` |
| `src/keq/index.ts` | `dist/keq/index.js` | `@buka/nuxt-kit/keq` |

`src/index.ts` re-export 所有子模块。**新增子模块**时需同时修改：`vite.config.ts` 的 `entry`、`package.json` 的 `exports`、以及 `src/index.ts`。

### Testing

Vitest + jsdom 环境。测试文件放在 `src/**/*.{spec,test}.ts` 或 `__tests__/**/*.{spec,test}.ts`。使用 `@vue/test-utils` 测试 Vue 组件。

### TypeScript Configs

| 文件 | 用途 |
|---|---|
| `tsconfig.json` | IDE 类型检查，继承 `@vue/tsconfig/tsconfig.dom.json` |
| `tsconfig.lib.json` | 构建时 dts 生成（include `src/` only） |
| `tsconfig.config.json` | ESLint projectService 用于 type-check 配置文件 |

`moduleResolution: "bundler"`（Vite 生态），import 语句无需 `.js` 后缀。

### Path Aliases

通过 `package.json` `imports` 字段定义，TypeScript `moduleResolution: "bundler"` 和 Vite 均原生支持：

```json
"imports": {
  "#composables/*": "./src/composables/*",
  "#components/*": "./src/components/*",
  "#utils/*": "./src/utils/*",
  "#keq/*": "./src/keq/*"
}
```

模块内跨目录引用示例：`import { useXxx } from '#composables/use-xxx'`
