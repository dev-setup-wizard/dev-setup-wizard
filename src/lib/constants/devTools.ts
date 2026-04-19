export interface ToolDefinition {
  id: string;
  name: string;
  isMacOnly?: boolean;
  isCask?: boolean;
  notInPorts?: boolean;
}

export const CLI_TOOLS: ToolDefinition[] = [
  { id: "git", name: "git" },
  { id: "openssh", name: "openssh" },
  { id: "php", name: "php" },
  { id: "cocoapods", name: "cocoapods", isMacOnly: true },
  { id: "tmux", name: "tmux" },
  { id: "jq", name: "jq" },
  { id: "wget", name: "wget" },
  { id: "autojump", name: "autojump" },
  { id: "gh", name: "gh" },
];

export const SERVER_TOOLS: ToolDefinition[] = [
  { id: "nginx", name: "nginx" },
  { id: "tomcat", name: "tomcat" },
  { id: "apache", name: "apache" },
];

export const DATABASE_TOOLS: ToolDefinition[] = [
  { id: "mysql", name: "mysql" },
  { id: "mariadb", name: "mariadb" },
  { id: "postgresql", name: "postgresql" },
  { id: "mongodb", name: "mongodb", notInPorts: true },
];

export const CONTAINER_TOOLS: ToolDefinition[] = [
  { id: "docker", name: "docker", isCask: true },
  { id: "containerd", name: "containerd", notInPorts: true },
  { id: "podman", name: "podman" },
  { id: "kubernetes", name: "kubernetes" },
  { id: "appleVirtualization", name: "Apple Virtualization", isMacOnly: true, notInPorts: true },
  { id: "lxc", name: "lxc", notInPorts: true },
  { id: "lxd", name: "lxd", notInPorts: true },
];

export const GUI_TOOLS: ToolDefinition[] = [
  { id: "vscode", name: "VS Code", isCask: true, notInPorts: true },
  { id: "android-studio", name: "Android Studio", isCask: true, notInPorts: true },
  { id: "intellij-idea", name: "IntelliJ IDEA", isCask: true, notInPorts: true },
  { id: "webstorm", name: "WebStorm", isCask: true, notInPorts: true },
  { id: "pycharm", name: "PyCharm", isCask: true, notInPorts: true },
  { id: "sublime-text", name: "Sublime Text", isCask: true, notInPorts: true },
  { id: "iterm2", name: "iTerm2", isCask: true, isMacOnly: true, notInPorts: true },
  { id: "google-chrome", name: "Google Chrome", isCask: true, notInPorts: true },
  { id: "microsoft-edge", name: "Microsoft Edge", isCask: true, notInPorts: true },
  { id: "firefox", name: "Firefox", isCask: true, notInPorts: true },
  { id: "github-desktop", name: "GitHub Desktop", isCask: true, notInPorts: true },
  { id: "another-redis-desktop-manager", name: "Another Redis Desktop Manager", isCask: true, notInPorts: true },
];

export const AI_TOOLS: ToolDefinition[] = [
  { id: "ollama", name: "Ollama", isCask: true, notInPorts: true },
  { id: "continue", name: "Continue (CLI)", notInPorts: true },
  { id: "open-webui", name: "Open WebUI", notInPorts: true },
];

export const NETWORK_TOOLS: ToolDefinition[] = [
  { id: "postman", name: "Postman", isCask: true, notInPorts: true },
  { id: "bruno", name: "Bruno", isCask: true, notInPorts: true },
  { id: "httpie", name: "HTTPie", isCask: true },
  { id: "proxyman", name: "Proxyman", isCask: true, isMacOnly: true, notInPorts: true },
  { id: "tailscale", name: "Tailscale", isCask: true, notInPorts: true },
  { id: "zerotier", name: "ZeroTier", isCask: true, notInPorts: true },
];

export const DEV_TOOLS_SECTIONS = [
  { title: "基础 CLI 工具", key: "cliTools", tools: CLI_TOOLS },
  { title: "服务器", key: "servers", tools: SERVER_TOOLS },
  { title: "数据库", key: "databases", tools: DATABASE_TOOLS },
  { title: "容器 & 虚拟化", key: "containers", tools: CONTAINER_TOOLS },
  { title: "GUI 应用", key: "guiApps", tools: GUI_TOOLS },
  { title: "AI 工具", key: "aiTools", tools: AI_TOOLS },
  { title: "网络工具", key: "networkTools", tools: NETWORK_TOOLS },
] as const;
