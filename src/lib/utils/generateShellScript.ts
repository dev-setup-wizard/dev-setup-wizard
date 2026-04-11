import type { Config, PackageManager } from "$types/config";

function lines(...items: string[]): string {
  return items.filter(Boolean).join("\n");
}

function isDarwinGuard(cmd: string): string {
  return lines('if [[ "$OSTYPE" == "darwin"* ]]; then', `  ${cmd}`, "fi");
}

function addInstallByPackageManager(pm: PackageManager, packages: string[]): string[] {
  if (packages.length === 0) return [];
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
  const useVm = installMethod !== "none" && installMethod !== "brew" && installMethod !== "ports";

  function installByMethod(pkg: string, method: string): string[] {
    switch (method) {
      case "npm-global": return [`npm i -g ${pkg} || true`];
      case "brew": return addInstallByPackageManager("homebrew", [pkg]);
      case "ports": return addInstallByPackageManager("macports", [pkg]);
      case "script": return [];
      default: return [];
    }
  }

  if (useVm) {
    switch (installMethod) {
      case "fnm":
        out.push(
          preferredPm !== "none"
            ? lines(...addInstallByPackageManager(preferredPm, ["fnm"]))
            : 'curl -fsSL https://fnm.vercel.app/install | bash',
        );
        if (hasNodeSelection) {
          if (nodeVersions.includes("v22")) out.push('fnm install 22');
          if (nodeVersions.includes("v24")) out.push('fnm install 24');
          if (nodeVersions.includes("v25")) out.push('fnm install 25');
          out.push('fnm default 22 || true');
        }
        break;
      case "nvm":
        out.push('curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash');
        if (hasNodeSelection) {
          if (nodeVersions.includes("v22")) out.push('nvm install 22');
          if (nodeVersions.includes("v24")) out.push('nvm install 24');
          if (nodeVersions.includes("v25")) out.push('nvm install 25');
          out.push('nvm alias default 22 || true');
        }
        break;
      case "n":
        out.push(
          preferredPm !== "none"
            ? lines(...addInstallByPackageManager(preferredPm, ["n"]))
            : "npm i -g n || true",
        );
        if (hasNodeSelection) {
          if (nodeVersions.includes("v22")) out.push('n 22');
          if (nodeVersions.includes("v24")) out.push('n 24');
          if (nodeVersions.includes("v25")) out.push('n 25');
          out.push('n alias default 22 || true');
        }
        break;
      case "asdf":
        out.push(
          preferredPm !== "none"
            ? lines(...addInstallByPackageManager(preferredPm, ["asdf"]))
            : "git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.15.0 || true",
        );
        out.push('export ASDF_DATA_DIR="$HOME/.asdf"');
        if (hasNodeSelection) {
          if (nodeVersions.includes("v22")) out.push('asdf install nodejs 22');
          if (nodeVersions.includes("v24")) out.push('asdf install nodejs 24');
          if (nodeVersions.includes("v25")) out.push('asdf install nodejs 25');
          out.push('asdf global nodejs 22 || true');
        }
        break;
      case "mise":
        out.push('curl https://mise.run | sh');
        if (hasNodeSelection) {
          if (nodeVersions.includes("v22")) out.push('mise install nodejs 22');
          if (nodeVersions.includes("v24")) out.push('mise install nodejs 24');
          if (nodeVersions.includes("v25")) out.push('mise install nodejs 25');
          out.push('mise use nodejs 22 || true');
        }
        break;
    }
  } else if (installMethod === "brew") {
    if (hasNodeSelection) {
      out.push(...addInstallByPackageManager("homebrew", ["node"]));
    } else {
      out.push("# 未选择 Node 版本，如需安装请执行: brew install node");
    }
  } else if (installMethod === "ports") {
    if (hasNodeSelection) {
      out.push(...addInstallByPackageManager("macports", ["node"]));
    } else {
      out.push("# 未选择 Node 版本，如需安装请执行: sudo port install node");
    }
  } else if (installMethod === "none") {
    out.push('# 跳过 Node.js 安装（如需使用本脚本安装，请先选择安装方式）');
  }

  // yarn
  if (config.node.installYarn) {
    out.push(...installByMethod("yarn", config.node.yarnInstallMethod));
  }

  // pnpm
  if (config.node.installPnpm) {
    out.push(...installByMethod("pnpm", config.node.pnpmInstallMethod));
  }

  // Bun
  if (config.node.installBun) {
    out.push("# Bun");
    const bunMethod = config.node.bunInstallMethod;
    if (bunMethod === "script") {
      out.push('curl -fsSL https://bun.sh/install | bash');
    } else {
      out.push(...installByMethod("bun", bunMethod));
    }
  }

  // Deno
  if (config.node.installDeno) {
    out.push("# Deno");
    const denoMethod = config.node.denoInstallMethod;
    if (denoMethod === "script") {
      out.push('curl -fsSL https://deno.land/install.sh | sh');
    } else {
      out.push(...installByMethod("deno", denoMethod));
    }
  }

  // corepack
  if (config.node.enableCorepack) {
    out.push("corepack enable || true");
  }
  out.push("");

  // Python
  out.push("# ---- Python ----");
  const pyMethod = config.python.pythonInstallMethod;
  const pyInstalled = pyMethod !== "none";

  if (pyInstalled) {
    switch (pyMethod) {
      case "uv": out.push("pip install uv || true"); break;
      case "pyenv": out.push(...addInstallByPackageManager(preferredPm, ["pyenv"])); break;
      case "conda": out.push(...addInstallByPackageManager(preferredPm, ["miniconda"])); break;
      case "mise": out.push('curl https://mise.run | sh'); break;
      case "asdf": out.push(...addInstallByPackageManager(preferredPm, ["asdf"])); break;
      case "brew": out.push(...addInstallByPackageManager("homebrew", ["python"])); break;
      case "ports": out.push(...addInstallByPackageManager("macports", ["python3"])); break;
    }
    if (config.python.installPythonLatest) {
      out.push(pyMethod === "uv" ? "uv python install latest" : "# install python latest");
    }
  } else {
    out.push("# 跳过 Python 安装");
  }

  if (config.python.aliasPythonToPython3) {
    out.push('echo \'alias python="python3"\' >> ~/.zshrc');
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
        out.push('curl -s "https://get.sdkman.io" | bash');
        for (const v of config.java.jdkVersions) {
          out.push(`sdk install java ${jdkPrefix}-${v}.zulu || true`);
        }
        break;
      case "mise":
        out.push('curl https://mise.run | sh');
        for (const v of config.java.jdkVersions) {
          out.push(`mise install java ${jdkPrefix}-${v} || true`);
        }
        break;
      case "asdf":
        out.push(...addInstallByPackageManager(preferredPm, ["asdf"]));
        for (const v of config.java.jdkVersions) {
          out.push(`asdf install java ${jdkPrefix}-${v} || true`);
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
  if (config.otherLanguages.flutterEnabled) out.push(...addInstallByPackageManager(preferredPm, ["flutter"]));
  if (config.otherLanguages.dartEnabled) out.push(...addInstallByPackageManager(preferredPm, ["dart"]));
  if (config.otherLanguages.otherEnabled && config.otherLanguages.otherName.trim()) {
    out.push(`# custom language: ${config.otherLanguages.otherName.trim()}`);
  }
  out.push("");

  // Developer tools (sample package-based installation lines)
  out.push("# ---- Developer Tools ----");
  const cliPackages = Object.entries(config.developerTools.cliTools)
    .filter(([, enabled]) => enabled)
    .map(([name]) => name);
  out.push(...addInstallByPackageManager(preferredPm, cliPackages));

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
