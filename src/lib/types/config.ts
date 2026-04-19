export type OSFamily = "macos" | "linux";

export type PackageManager = "homebrew" | "macports" | "none";
export type NodeInstallMethod = "fnm" | "nvm" | "n" | "asdf" | "mise" | "brew" | "ports" | "none";
export type NodeVersion = "v25" | "v24" | "v22";
export type JsRuntimeInstallMethod = "npm-global" | "brew" | "ports" | "script";
export type PythonInstallMethod = "uv" | "pyenv" | "conda" | "mise" | "asdf" | "brew" | "ports" | "none";
export type PythonToolInstallMethod = "pip" | "brew" | "ports" | "script";
export type JdkInstallMethod = "sdkman" | "brew" | "ports" | "mise" | "asdf" | "none";
export type JdkDistribution = "openjdk" | "oracle" | "temurin";
export type JdkVersion = "25" | "24" | "21" | "17" | "11";

export interface PackageManagersConfig {
  packageManagers: PackageManager[];
}

export interface NodeConfig {
  nodeInstallMethod: NodeInstallMethod;
  nodeVersions: NodeVersion[];

  enableCorepack: boolean;
  installYarn: boolean;
  installPnpm: boolean;

  installBun: boolean;
  bunInstallMethod: JsRuntimeInstallMethod;
  installDeno: boolean;
  denoInstallMethod: JsRuntimeInstallMethod;
  
}

export interface PythonConfig {
  pythonInstallMethod: PythonInstallMethod;
  installPythonLatest: boolean;
  aliasPythonToPython3: boolean;
  installPython2: boolean;
}

export interface JavaConfig {
  jdkInstallMethod: JdkInstallMethod;
  jdkDistribution: JdkDistribution;
  jdkVersions: JdkVersion[];
}

export type LanguageInstallMethod = "brew" | "ports" | "mise";

export interface LanguageConfig {
  enabled: boolean;
  installMethod: LanguageInstallMethod;
}

export interface OtherLanguagesConfig {
  go: LanguageConfig;
  rust: LanguageConfig;
  dart: LanguageConfig;
  otherEnabled: boolean;
  otherName: string;
}

export interface CliToolsConfig {
  git: boolean;
  openssh: boolean;
  php: boolean;
  cocoapods: boolean;
  tmux: boolean;
  jq: boolean;
  wget: boolean;
  autojump: boolean;
  gh: boolean;
}

export interface ServersConfig {
  nginx: boolean;
  tomcat: boolean;
  apache: boolean;
}

export interface DatabasesConfig {
  mysql: boolean;
  mariadb: boolean;
  postgresql: boolean;
  mongodb: boolean;
}

export interface ContainersConfig {
  docker: boolean;
  containerd: boolean;
  podman: boolean;
  kubernetes: boolean;
  appleVirtualization: boolean;
  lxc: boolean;
  lxd: boolean;
  addCurrentUserToContainerGroups: boolean;
}

export interface GuiAppsConfig {
  vscode: boolean;
  androidStudio: boolean;
  intellijIdea: boolean;
  webstorm: boolean;
  pycharm: boolean;
  sublimeText: boolean;
  iterm2: boolean;
  googleChrome: boolean;
  microsoftEdge: boolean;
  firefox: boolean;
  githubDesktop: boolean;
  anotherRedisDesktopManager: boolean;
}

export interface AiToolsConfig {
  ollama: boolean;
  continueDevCli: boolean;
  openWebui: boolean;
}

export interface NetworkToolsConfig {
  postman: boolean;
  bruno: boolean;
  httpie: boolean;
  proxyman: boolean;
  tailscale: boolean;
  zerotier: boolean;
}

export interface ShellCustomizationConfig {
  ohMyZsh: boolean;
  installRecommendedPlugins: boolean;
  ohMyPosh: boolean;
}

export interface DeveloperToolsConfig {
  cliTools: CliToolsConfig;
  shellCustomization: ShellCustomizationConfig;
  servers: ServersConfig;
  databases: DatabasesConfig;
  containers: ContainersConfig;
  guiApps: GuiAppsConfig;
  aiTools: AiToolsConfig;
  networkTools: NetworkToolsConfig;
}

export interface UiStateConfig {
  theme: "dark" | "light";
  currentModuleKey: ModuleKey;
  lastUpdatedAt: number;
  targetOs: OSFamily;
}

export type ModuleKey =
  | "package-managers"
  | "node"
  | "python"
  | "java"
  | "other-languages"
  | "developer-tools";

export interface Config {
  packageManagers: PackageManagersConfig;
  node: NodeConfig;
  python: PythonConfig;
  java: JavaConfig;
  otherLanguages: OtherLanguagesConfig;
  developerTools: DeveloperToolsConfig;
  ui: UiStateConfig;
}

export const MODULE_ORDER: ModuleKey[] = [
  "package-managers",
  "node",
  "python",
  "java",
  "other-languages",
  "developer-tools",
];

export const defaultConfig: Config = {
  packageManagers: {
    packageManagers: ["homebrew"],
  },
  node: {
    nodeInstallMethod: "fnm",
    nodeVersions: [],
    installYarn: true,
    installPnpm: true,
    enableCorepack: false,

    installBun: false,
    bunInstallMethod: "npm-global",
    installDeno: false,
    denoInstallMethod: "npm-global",
  },
  python: {
    pythonInstallMethod: "uv",
    installPythonLatest: false,
    aliasPythonToPython3: true,
    installPython2: false,
  },
  java: {
    jdkInstallMethod: "sdkman",
    jdkDistribution: "temurin",
    jdkVersions: ["21"],
  },
  otherLanguages: {
    go: { enabled: false, installMethod: "brew" },
    rust: { enabled: false, installMethod: "brew" },
    dart: { enabled: false, installMethod: "brew" },
    otherEnabled: false,
    otherName: "",
  },
  developerTools: {
    cliTools: {
      git: true,
      openssh: true,
      php: false,
      cocoapods: false,
      tmux: false,
      jq: true,
      wget: true,
      autojump: false,
      gh: false,
    },
    shellCustomization: {
      ohMyZsh: false,
      installRecommendedPlugins: false,
      ohMyPosh: false,
    },
    servers: {
      nginx: false,
      tomcat: false,
      apache: false,
    },
    databases: {
      mysql: false,
      mariadb: false,
      postgresql: false,
      mongodb: false,
    },
    containers: {
      docker: false,
      containerd: false,
      podman: false,
      kubernetes: false,
      appleVirtualization: false,
      lxc: false,
      lxd: false,
      addCurrentUserToContainerGroups: false,
    },
    guiApps: {
      vscode: true,
      androidStudio: false,
      intellijIdea: false,
      webstorm: false,
      pycharm: false,
      sublimeText: false,
      iterm2: false,
      googleChrome: false,
      microsoftEdge: false,
      firefox: false,
      githubDesktop: false,
      anotherRedisDesktopManager: false,
    },
    aiTools: {
      ollama: false,
      continueDevCli: false,
      openWebui: false,
    },
    networkTools: {
      postman: false,
      bruno: false,
      httpie: false,
      proxyman: false,
      tailscale: false,
      zerotier: false,
    },
  },
  ui: {
    theme: "dark",
    currentModuleKey: "package-managers",
    lastUpdatedAt: Date.now(),
    targetOs: "macos",
  },
};
