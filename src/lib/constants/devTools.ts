export interface ToolDefinition {
  id: string;
  name: string;
  isMacOnly?: boolean;
}

export const CLI_TOOLS: ToolDefinition[] = [
  { id: "git", name: "git" },
  { id: "openssh", name: "openssh" },
  { id: "php", name: "php" },
  { id: "cocoapods", name: "cocoapods" },
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
  { id: "mongodb", name: "mongodb" },
];

export const CONTAINER_TOOLS: ToolDefinition[] = [
  { id: "docker", name: "docker" },
  { id: "containerd", name: "containerd" },
  { id: "podman", name: "podman" },
  { id: "kubernetes", name: "kubernetes" },
  { id: "appleVirtualization", name: "Apple Virtualization", isMacOnly: true },
  { id: "lxc", name: "lxc" },
  { id: "lxd", name: "lxd" },
];

export const GUI_TOOLS: ToolDefinition[] = [
  { id: "vscode", name: "vscode" },
  { id: "androidStudio", name: "androidStudio" },
  { id: "intellijIdea", name: "intellijIdea" },
  { id: "webstorm", name: "webstorm" },
  { id: "pycharm", name: "pycharm" },
  { id: "sublimeText", name: "sublimeText" },
  { id: "iterm2", name: "iterm2" },
  { id: "googleChrome", name: "googleChrome" },
  { id: "microsoftEdge", name: "microsoftEdge" },
  { id: "firefox", name: "firefox" },
  { id: "githubDesktop", name: "githubDesktop" },
  { id: "anotherRedisDesktopManager", name: "anotherRedisDesktopManager" },
];

export const AI_TOOLS: ToolDefinition[] = [
  { id: "ollama", name: "ollama" },
  { id: "continueDevCli", name: "continueDevCli" },
  { id: "openWebui", name: "openWebui" },
];

export const NETWORK_TOOLS: ToolDefinition[] = [
  { id: "postman", name: "postman" },
  { id: "bruno", name: "bruno" },
  { id: "httpie", name: "httpie" },
  { id: "proxyman", name: "Proxyman", isMacOnly: true },
  { id: "tailscale", name: "tailscale" },
  { id: "zerotier", name: "zerotier" },
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
