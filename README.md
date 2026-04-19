# Dev Setup Wizard

一个用于配置开发者工作环境的图形化工具。用户通过 UI 选择所需的技术栈和工具，自动生成可在 macOS/Linux 上运行的 Shell 配置脚本。

## 功能特性

- **包管理器**: Homebrew、MacPorts 选择
- **Node.js**: fnm、nvm、n、asdf、mise 版本管理 + Yarn/pnpm/Deno/Bun
- **Python**: pyenv、uv、conda、asdf、mise 版本管理
- **Java**: OpenJDK/Temurin/Oracle JDK 版本选择 + Maven/Gradle/SDKMAN
- **其他语言**: Go、Rust、Flutter、Dart
- **开发者工具**:
  - CLI 工具: git、openssh、tmux、jq、wget、autojump、gh
  - 容器: Docker、Podman、Kubernetes、LXC/LXD
  - 数据库: MySQL、MariaDB、PostgreSQL、MongoDB
  - GUI 应用: VS Code、Android Studio、IntelliJ IDEA、Chrome 等
  - AI 工具: Ollama、Continue、Open WebUI
  - 网络工具: Postman、Bruno、HTTPie、Proxyman、Tailscale

## 技术栈

- **前端框架**: Svelte 5 (Runes API)
- **构建工具**: Vite 8
- **语言**: TypeScript
- **样式**: Tailwind CSS 4 + bits-ui组件库
- **测试**: Vitest

## 项目结构

```
src/
├── lib/
│   ├── components/
│   │   ├── modules/          # 配置模块 UI 组件
│   │   │   ├── PackageManagersModule.svelte
│   │   │   ├── NodeJsModule.svelte
│   │   │   ├── PythonModule.svelte
│   │   │   ├── JavaModule.svelte
│   │   │   ├── OtherLanguagesModule.svelte
│   │   │   └── DeveloperToolsModule.svelte
│   │   └── ScriptPreviewPanel.svelte  # 脚本预览面板
│   ├── stores/
│   │   └── configStore.ts    # 集中式配置状态管理
│   ├── types/
│   │   └── config.ts        # 配置类型定义
│   └── utils/
│       └── generateShellScript.ts  # Shell 脚本生成器
├── App.svelte               # 主应用组件
└── main.ts                  # 入口文件
```

## 开发命令

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 类型检查
pnpm check

# 运行测试
pnpm test
```

## 配置数据流

1. 用户在 UI 组件中修改配置选项
2. `configStore.patch()` 更新状态并持久化到 localStorage
3. `App.svelte` 监听 `configStore` 变化
4. 调用 `generateShellScript()` 生成脚本
5. 右侧 `ScriptPreviewPanel` 实时显示生成的脚本内容
