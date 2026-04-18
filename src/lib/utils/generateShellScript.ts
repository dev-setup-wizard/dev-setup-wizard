import type { Config, PackageManager } from "$types/config";

function lines(...items: string[]): string {
  return items.filter(Boolean).join("\n");
}

function isDarwinGuard(cmd: string): string {
  return lines('if [[ "$OSTYPE" == "darwin"* ]]; then', `  ${cmd}`, "fi");
}

function installByScript(pkg: string): string[] {
  const scripts: Record<string, string> = {
    fnm: 'curl -fsSL https://fnm.vercel.app/install | bash',
    nvm: 'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash',
    n: 'curl -L https://bit.ly/n-install | bash',
    mise: 'curl https://mise.run | sh',
    bun: 'curl -fsSL https://bun.sh/install | bash',
    deno: 'curl -fsSL https://deno.land/install.sh | sh',
    uv: 'curl -LsSf https://astral.sh/uv/install.sh | sh',
    pyenv: 'curl -fsSL https://pyenv.run | bash',
    conda: 'curl -O https://repo.anaconda.com/miniconda/Miniconda3-latest-MacOSX-arm64.sh | bash',
    sdkman: 'curl -s "https://get.sdkman.io" | bash',
    go: 'curl -fsSL https://go.dev/dl/go1.21.5.darwin-arm64.pkg | open -W --wait -g',
    rust: 'curl --proto "=https" --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y',
    ohMyZsh: 'sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"',
    ohMyPosh: 'curl -s https://ohmyposh.sh/install.sh | bash -s || true',

    corepack: 'npm i -g corepack && corepack enable',
    yarn: 'npm i -g yarn',
    pnpm: 'npm i -g pnpm',
  };
  
  if (scripts[pkg]) {
    return [scripts[pkg]];
  }
  return [`# Please install ${pkg} manually`];
}

function addInstallByPackageManager(pm: PackageManager, packages: string[]): string[] {
  if (packages.length === 0) return [];
  if (pm === "none") {
    return packages.flatMap(pkg => installByScript(pkg));
  }
  if (pm === "homebrew") return [`brew install ${packages.join(" ")}`];
  if (pm === "macports") return [`sudo port install ${packages.join(" ")}`];
  return [];
}

function hasPackageManager(config: Config): boolean {
  return config.packageManagers.packageManagers.some((pm) => pm !== "none");
}

export function generateShellScript(config: Config): string {
  const preferredPm = config.packageManagers.packageManagers.find((pm) => pm !== "none") ?? "none";
  const out: string[] = [];

  out.push("#!/usr/bin/env bash");
  out.push("set -euo pipefail");
  out.push("");
  out.push('OS="$(uname -s)"');
  out.push('if [[ "$OS" == "Darwin" ]]; then');
  out.push('  PLATFORM="macos"');
  out.push('elif [[ "$OS" == "Linux" ]]; then');
  out.push('  PLATFORM="linux"');
  out.push("else");
  out.push('  echo "❌ 暂不支持当前系统: $OS"');
  out.push("  exit 1");
  out.push("fi");
  out.push("");
  out.push('echo "🚀 开始配置开发环境（$PLATFORM）..."');
  out.push("");

  if (config.packageManagers.packageManagers.includes("homebrew")) {
    out.push('if ! command -v brew >/dev/null 2>&1; then');
    out.push('  echo "📦 安装 Homebrew..."');
    out.push('  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"');
    out.push("fi");
    out.push("");
  }

  if (config.packageManagers.packageManagers.includes("macports")) {
    out.push(isDarwinGuard('if ! command -v port >/dev/null 2>&1; then echo "请先手动安装 MacPorts"; fi'));
    out.push("");
  }

  // Node.js
  out.push("# ---- Node.js ----");
  const nodeVersions = config.node.nodeVersions;
  const hasNodeSelection = nodeVersions.length > 0;
  const installMethod = config.node.nodeInstallMethod;

  function getLatestVersion(versions: string[]): string {
    if (versions.length === 0) return "";
    const nums = versions.map(v => parseInt(v.replace("v", ""), 10));
    return String(Math.max(...nums));
  }

  const latestVersion = getLatestVersion(nodeVersions);

  function installNodeVersions(installCmd: (v: string) => string): void {
    for (const v of nodeVersions) {
      const ver = v.replace("v", "");
      out.push(installCmd(ver));
    }
    if (latestVersion) {
      out.push(`# Set default version to ${latestVersion}`);
    }
  }

  function installByMethod(pkg: string, method: string): string[] {
    switch (method) {
      case "npm-global": return [`npm i -g ${pkg} || true`];
      case "brew": return addInstallByPackageManager("homebrew", [pkg]);
      case "ports": return addInstallByPackageManager("macports", [pkg]);
      case "script": return installByScript(pkg);
      default: return [];
    }
  }

  if (installMethod !== "none") {
    if (hasNodeSelection) {
      switch (installMethod) {
        case "fnm":
          out.push(...addInstallByPackageManager(preferredPm, ["fnm"]));
          installNodeVersions((v) => `fnm install ${v}`);
          if (latestVersion) out.push(`fnm default ${latestVersion} || true`);
          break;
        case "nvm":
          out.push(...addInstallByPackageManager(preferredPm, ["nvm"]));
          installNodeVersions((v) => `nvm install ${v}`);
          if (latestVersion) out.push(`nvm alias default ${latestVersion} || true`);
          break;
        case "n":
          out.push(...addInstallByPackageManager(preferredPm, ["n"]));
          installNodeVersions((v) => `n ${v}`);
          if (latestVersion) out.push(`n alias default ${latestVersion} || true`);
          break;
        case "mise":
          out.push(...addInstallByPackageManager(preferredPm, ["mise"]));
          installNodeVersions((v) => `mise install node@${v}`);
          if (latestVersion) out.push(`mise use -g node@${latestVersion} || true`);
          break;
        case "brew":
          const brewVersions = nodeVersions.map(v => `node@${v}`);
          out.push(...addInstallByPackageManager("homebrew", brewVersions));
          if (latestVersion) {
            out.push(`brew unlink node || true`);
            out.push(`brew link node@${latestVersion} || true`);
          }
          break;
        case "ports":
          const portsVersions = nodeVersions.map(v => `node${v}`);
          out.push(...addInstallByPackageManager("macports", portsVersions));
          if (latestVersion) {
            out.push(`port select node node${latestVersion} || true`);
          }
          break;
      }
      if (nodeVersions.length > 0) {
        // corepack
        if (config.node.enableCorepack) {
          if (parseInt(latestVersion) >=25) {
            out.push(`# 从 Node.js v25 开始，默认安装不包含 corepack`);
            out.push(...installByMethod("corepack", "npm-global"));
          } else {
            out.push(`# Node.js v${latestVersion} 自带 corepack`); 
          }
        }

        // yarn
        if (config.node.installYarn) {
          out.push(...installByMethod("yarn", "npm-global"));
        }

        // pnpm
        if (config.node.installPnpm) {
          out.push(...installByMethod("pnpm", "npm-global"));
        }
      }
    }
  } else {
    out.push('# 跳过 Node.js 安装（如需使用本脚本安装，请先选择安装方式）');
  }


  // Bun
  if (config.node.installBun) {
    out.push("# Bun");
    out.push(...installByMethod("bun", config.node.bunInstallMethod));
  }

  // Deno
  if (config.node.installDeno) {
    out.push("# Deno");
    out.push(...installByMethod("deno", config.node.denoInstallMethod));
  }
  out.push("");

  // Python
  out.push("# ---- Python ----");
  const pyMethod = config.python.pythonInstallMethod;
  const pyInstalled = pyMethod !== "none";

  if (pyInstalled) {
    switch (pyMethod) {
      case "uv": 
        out.push(...addInstallByPackageManager(preferredPm, ["uv"])); 
        break;
      case "pyenv": 
        out.push(...addInstallByPackageManager(preferredPm, ["pyenv"])); 
        break;
      case "conda": 
        out.push(...addInstallByPackageManager(preferredPm, ["conda"])); 
        break;
      case "mise": 
        out.push(...addInstallByPackageManager(preferredPm, ["mise"])); 
        break;
      case "brew": 
        out.push(...addInstallByPackageManager("homebrew", ["python"])); 
        break;
      case "ports": 
        out.push(...addInstallByPackageManager("macports", ["python3"])); 
        break;
    }
    if (config.python.installPythonLatest) {
      out.push(pyMethod === "uv" ? "uv python install latest" : "# install python latest");
    }
  } else {
    out.push("# 跳过 Python 安装");
  }

  if (config.python.aliasPythonToPython3) {
    out.push('echo \'alias python="python3"\' >> ~/.zshrc');
    out.push('echo \'alias pip="pip3"\' >> ~/.zshrc');
  }

  if (config.python.installPython2) {
    out.push("# WARNING: Python 2 已停止维护");
  }
  out.push("");

  // Java
  out.push("# ---- Java ----");
  const jdkMethod = config.java.jdkInstallMethod;
  const jdkInstalled = jdkMethod !== "none";

  if (jdkInstalled) {
    const dist = config.java.jdkDistribution;
    const jdkPrefix = dist === "temurin" ? "temurin" : dist;

    switch (jdkMethod) {
      case "sdkman":
        out.push(...installByScript("sdkman"));
        for (const v of config.java.jdkVersions) {
          out.push(`sdk install java ${jdkPrefix}-${v}.zulu || true`);
        }
        break;
      case "mise":
        out.push(...addInstallByPackageManager(preferredPm, ["mise"]));
        for (const v of config.java.jdkVersions) {
          out.push(`mise install java ${jdkPrefix}-${v} || true`);
        }
        break;
      case "brew":
        for (const v of config.java.jdkVersions) {
          out.push(...addInstallByPackageManager("homebrew", [`${jdkPrefix}@${v}`]));
        }
        break;
      case "ports":
        for (const v of config.java.jdkVersions) {
          out.push(...addInstallByPackageManager("macports", [`openjdk${v}`]));
        }
        break;
    }
  } else {
    out.push("# 跳过 Java 安装");
  }
  out.push("");

  // Other languages
  out.push("# ---- Other Languages ----");
  if (config.otherLanguages.goEnabled) out.push(...addInstallByPackageManager(preferredPm, ["go"]));
  if (config.otherLanguages.rustEnabled) out.push("curl https://sh.rustup.rs -sSf | sh -s -- -y");
  if (config.otherLanguages.dartEnabled) out.push(...addInstallByPackageManager(preferredPm, ["dart"]));
  if (config.otherLanguages.otherEnabled && config.otherLanguages.otherName.trim()) {
    out.push(`# custom language: ${config.otherLanguages.otherName.trim()}`);
  }
  out.push("");

  // Shell customization
  out.push("# ---- Shell 美化 ----");
  if (config.developerTools.shellCustomization.ohMyZsh) {
    out.push(...installByScript("ohMyZsh"));
    if (config.developerTools.shellCustomization.installRecommendedPlugins) {
      out.push('git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ~/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting || true');
      out.push('git clone https://github.com/zsh-users/zsh-autosuggestions ~/.oh-my-zsh/custom/plugins/zsh-autosuggestions || true');
    }
  }
  if (config.developerTools.shellCustomization.ohMyPosh) {
    out.push(...installByScript("ohMyPosh"));
  }
  out.push("");

  // Developer tools
  const pm = hasPackageManager(config) ? preferredPm : "none";
  if (pm !== "none") {
    out.push("# ---- Developer Tools ----");

    const cliPackages = Object.entries(config.developerTools.cliTools)
      .filter(([, enabled]) => enabled)
      .map(([name]) => name);
    if (cliPackages.length > 0) {
      out.push("# CLI 工具");
      out.push(...addInstallByPackageManager(pm, cliPackages));
    }

    const serverPackages = Object.entries(config.developerTools.servers)
      .filter(([, enabled]) => enabled)
      .map(([name]) => name);
    if (serverPackages.length > 0) {
      out.push("# 服务器");
      out.push(...addInstallByPackageManager(pm, serverPackages));
    }

    const databasePackages = Object.entries(config.developerTools.databases)
      .filter(([, enabled]) => enabled)
      .map(([name]) => name);
    if (databasePackages.length > 0) {
      out.push("# 数据库");
      out.push(...addInstallByPackageManager(pm, databasePackages));
    }

    const containerPackages = Object.entries(config.developerTools.containers)
      .filter(([, enabled]) => enabled)
      .map(([name]) => name);
    if (containerPackages.length > 0) {
      out.push("# 容器");
      out.push(...addInstallByPackageManager(pm, containerPackages));
    }

    const guiPackages = Object.entries(config.developerTools.guiApps)
      .filter(([, enabled]) => enabled)
      .map(([name]) => name);
    if (guiPackages.length > 0) {
      out.push("# GUI 应用");
      out.push(...addInstallByPackageManager(pm, guiPackages));
    }

    const aiPackages = Object.entries(config.developerTools.aiTools)
      .filter(([, enabled]) => enabled)
      .map(([name]) => name);
    if (aiPackages.length > 0) {
      out.push("# AI 工具");
      out.push(...addInstallByPackageManager(pm, aiPackages));
    }

    const networkPackages = Object.entries(config.developerTools.networkTools)
      .filter(([, enabled]) => enabled)
      .map(([name]) => name);
    if (networkPackages.length > 0) {
      out.push("# 网络工具");
      out.push(...addInstallByPackageManager(pm, networkPackages));
    }
  }

  if (config.developerTools.containers.addCurrentUserToContainerGroups) {
    if (config.developerTools.containers.docker) out.push('sudo usermod -aG docker "$USER" || true');
    if (config.developerTools.containers.lxd) out.push('sudo usermod -aG lxd "$USER" || true');
  }

  out.push("");
  out.push("brew cleanup 2>/dev/null || true");
  out.push('echo "🎉 环境配置完成！建议重启终端"');

  if (!hasPackageManager(config) && preferredPm === "none") {
    out.unshift("# NOTE: 未选择包管理器，部分工具将使用官方安装方式。");
  }

  return `${out.join("\n").replace(/\n{3,}/g, "\n\n")}\n`;
}
