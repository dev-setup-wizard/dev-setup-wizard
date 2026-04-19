# AI Agent 工作指南

## 项目概述

Dev Setup Wizard 是一个开发者环境配置工具，通过 UI 让用户选择所需的技术栈和工具，自动生成 Shell 脚本以在 macOS/Linux 上配置开发环境。

## 架构说明

### 数据流

```
UI Components (modules/*)
    ↓ user input
configStore.patch({...})  → stores/configStore.ts
    ↓ subscribe
App.svelte
    ↓ watch configStore
generateShellScript(config)  → utils/generateShellScript.ts
    ↓ return string
ScriptPreviewPanel  ← display generated script
```

### 核心文件

| 文件                                   | 作用                                   |
| -------------------------------------- | -------------------------------------- |
| `src/lib/types/config.ts`              | 所有配置类型定义和默认值               |
| `src/lib/stores/configStore.ts`        | 集中式状态管理，含 patch/reset/persist |
| `src/lib/utils/generateShellScript.ts` | 根据 Config 生成 Shell 脚本字符串      |
| `src/App.svelte`                       | 主页面，监听 store 变化并触发脚本生成  |
| `src/lib/components/modules/*.svelte`  | 各配置模块 UI                          |

### 配置模块顺序

```
MODULE_ORDER = [
  "package-managers",  → PackageManagersModule.svelte
  "node",              → NodeJsModule.svelte
  "python",            → PythonModule.svelte
  "java",              → JavaModule.svelte
  "other-languages",  → OtherLanguagesModule.svelte
  "developer-tools"   → DeveloperToolsModule.svelte
]
```

## 类型系统

`src/lib/types/config.ts` 导出核心类型:

- `Config` - 完整配置对象
- `ModuleKey` - 模块标识联合类型
- 各子配置类型: `PackageManagersConfig`, `NodeConfig`, `PythonConfig`, `JavaConfig`, `OtherLanguagesConfig`, `DeveloperToolsConfig`, `UiStateConfig`

## 添加新模块步骤

1. 在 `config.ts` 添加新的配置类型和默认配置
2. 创建 `ModuleKey` 联合类型并添加到 `MODULE_ORDER`
3. 在 `configStore.ts` 的 `hasModuleSelection` 添加判断逻辑
4. 创建 `src/lib/components/modules/XXXModule.svelte` UI 组件
5. 在 `App.svelte` 引入并添加组件
6. 在 `generateShellScript.ts` 添加对应的脚本生成逻辑

## 常用操作

### 修改配置值

```typescript
configStore.patch({
  node: { nodeVersionManager: "fnm", nodeVersions: ["lts", "latest"] },
});
```

### 添加新的开发者工具选项

1. 在 `config.ts` 的 `CliToolsConfig` 或其他子配置类型添加布尔字段
2. 在 `defaultConfig` 设置默认值
3. 在 `generateShellScript.ts` 的对应 section 添加生成逻辑

### 运行测试

```bash
pnpm test        # 运行 vitest
pnpm check      # 类型检查
```

## 注意事项

- 使用 `$stores/configStore` 和 `$types/config` 路径别名
- Svelte 5 使用 Runes API: `$state`, `$derived`, `$effect`
- bits-ui 组件库用于 UI 控件
- 配置通过 localStorage 持久化，key 为 `dev-setup-wizard-config-v1`
