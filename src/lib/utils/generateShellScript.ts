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
  const useVm = config.node.nodeVersionManager !== "none";

  if (useVm) {
    const vm = config.node.nodeVersionManager;
    switch (vm) {
      case "fnm":
        out.push(
          preferredPm !== "none"
            ? lines(...addInstallByPackageManager(preferredPm, ["fnm"]))
            : 'curl -fsSL https://fnm.vercel.app/install | bash',
        );
        if (hasNodeSelection) {
          if (nodeVersions.includes("latest")) out.push('fnm install latest');
          if (nodeVersions.includes("lts")) out.push('fnm install lts-lts');
          out.push('fnm default $(fnm list | grep "lts" | head -1 | awk "{print \\$2}") || true');
        }
        break;
      case "nvm":
        out.push('curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash');
        if (hasNodeSelection) {
          if (nodeVersions.includes("latest")) out.push('nvm install latest');
          if (nodeVersions.includes("lts")) out.push('nvm install --lts');
          out.push('nvm alias default lts/* || nvm alias default node || true');
        }
        break;
      case "n":
        out.push(
          preferredPm !== "none"
            ? lines(...addInstallByPackageManager(preferredPm, ["n"]))
            : "npm i -g n || true",
        );
        if (hasNodeSelection) {
          if (nodeVersions.includes("latest")) out.push('n latest');
          if (nodeVersions.includes("lts")) out.push('n lts');
          out.push('n alias default lts || true');
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
          if (nodeVersions.includes("latest")) out.push('asdf install nodejs latest');
          if (nodeVersions.includes("lts")) out.push('asdf install nodejs lts');
          out.push('asdf global nodejs lts || true');
        }
        break;
      case "mise":
        out.push('curl https://mise.run | sh');
        if (hasNodeSelection) {
          if (nodeVersions.includes("latest")) out.push('mise install nodejs latest');
          if (nodeVersions.includes("lts")) out.push('mise install nodejs lts');
          out.push('mise use nodejs lts || true');
        }
        break;
    }
  } else if (preferredPm !== "none") {
    if (hasNodeSelection) {
      out.push(...addInstallByPackageManager(preferredPm, ["node"]));
    } else {
      out.push("# 未选择 Node 版本，如需安装请手动执行: " + (preferredPm === "homebrew" ? "brew install node" : "port install node"));
    }
  } else {
    out.push('# 请先安装 Node.js（如需使用本脚本安装，请先选择包管理器或版本管理器）');
  }

  if (config.node.installYarn) {
    if (useVm) {
      out.push(config.node.nodeVersionManager === "asdf" || config.node.nodeVersionManager === "mise"
        ? 'asdf reshime nodejs yarn || npm i -g yarn || true'
        : 'npm i -g yarn || true');
    } else if (preferredPm !== "none") {
      out.push(...addInstallByPackageManager(preferredPm, ["yarn"]));
    } else {
      out.push('npm i -g yarn || true');
    }
  }
  if (config.node.installPnpm) {
    if (useVm) {
      out.push(config.node.nodeVersionManager === "asdf" || config.node.nodeVersionManager === "mise"
        ? 'asdf reshime nodejs pnpm || npm i -g pnpm || true'
        : 'npm i -g pnpm || true');
    } else if (preferredPm !== "none") {
      out.push(...addInstallByPackageManager(preferredPm, ["pnpm"]));
    } else {
      out.push('npm i -g pnpm || true');
    }
  }

  // Deno
  if (config.node.installDeno) {
    out.push("# Deno");
    const denoMethod = config.node.denoInstallMethod;
    if (useVm && (config.node.nodeVersionManager === "asdf" || config.node.nodeVersionManager === "mise")) {
      out.push('asdf plugin add deno || true');
      if (denoMethod === "script") {
        out.push('curl -fsSL https://deno.land/install.sh | sh');
      } else {
        out.push('asdf install deno latest');
        out.push('asdf global deno latest || true');
      }
    } else if (denoMethod === "script") {
      out.push('curl -fsSL https://deno.land/install.sh | sh');
    } else if (preferredPm !== "none") {
      out.push(...addInstallByPackageManager(preferredPm, ["deno"]));
    } else {
      out.push('curl -fsSL https://deno.land/install.sh | sh');
    }
  }

  // Bun
  if (config.node.installBun) {
    out.push("# Bun");
    const bunMethod = config.node.bunInstallMethod;
    if (useVm && (config.node.nodeVersionManager === "asdf" || config.node.nodeVersionManager === "mise")) {
      out.push('asdf plugin add bun || true');
      if (bunMethod === "script") {
        out.push('curl -fsSL https://bun.sh/install | bash');
      } else {
        out.push('asdf install bun latest');
        out.push('asdf global bun latest || true');
      }
    } else if (bunMethod === "script") {
      out.push('curl -fsSL https://bun.sh/install | bash');
    } else if (preferredPm !== "none") {
      out.push(...addInstallByPackageManager(preferredPm, ["bun"]));
    } else {
      out.push('curl -fsSL https://bun.sh/install | bash');
    }
  }
  out.push("");

  // Python
  out.push("# ---- Python ----");
  if (config.python.pythonVersionManager === "none") {
    if (config.python.pythonInstallMethod === "package-manager" && preferredPm !== "none") {
      out.push(...addInstallByPackageManager(preferredPm, ["python"]));
    } else {
      out.push(isDarwinGuard('echo "请从 python.org 安装 Python 官方包"'));
    }
  } else {
    const pyVmMap: Record<Exclude<Config["python"]["pythonVersionManager"], "none">, string[]> = {
      pyenv: ["pyenv"],
      uv: ["uv"],
      conda: ["miniconda"],
      asdf: ["asdf"],
      mise: ["mise"],
    };
    const vm = pyVmMap[config.python.pythonVersionManager];
    out.push(...(preferredPm !== "none" ? addInstallByPackageManager(preferredPm, vm) : [`# install ${vm[0]}`]));
  }
  if (config.python.aliasPythonToPython3) out.push('echo \'alias python="python3"\' >> ~/.zshrc');
  if (config.python.installPython2) out.push("# WARNING: Python 2 has reached end-of-life");
  out.push("");

  // Java
  out.push("# ---- Java ----");
  const jdkPkgPrefix = config.java.jdkDistribution === "temurin" ? "temurin" : "openjdk";
  for (const version of config.java.jdkVersions) {
    const suffix = version === "newest" ? "" : version.replace("-lts", "");
    const pkg = suffix ? `${jdkPkgPrefix}@${suffix}` : jdkPkgPrefix;
    out.push(...(preferredPm !== "none" ? addInstallByPackageManager(preferredPm, [pkg]) : [`# install ${pkg}`]));
  }
  if (config.java.installMaven) out.push(...addInstallByPackageManager(preferredPm, ["maven"]));
  if (config.java.installGradle) out.push(...addInstallByPackageManager(preferredPm, ["gradle"]));
  if (config.java.installSdkman) out.push('curl -s "https://get.sdkman.io" | bash');
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
