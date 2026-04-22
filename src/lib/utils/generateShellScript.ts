import type { Config } from "$types/config";
import { isDarwinGuard } from "./shell/helpers";
import type { ScriptGeneratorContext } from "./shell/types";
import { generateNodeScript } from "./shell/node";
import { generatePythonScript } from "./shell/python";
import { generateJavaScript } from "./shell/java";
import { generateDeveloperToolsScript } from "./shell/developer-tools";

export function generateShellScript(config: Config): string {
  const preferredPm = (config.packageManagers.packageManagers.find((pm) => pm !== "none") ?? "none") as "homebrew" | "macports" | "none";
  const out: string[] = [];

  // Header
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

  // Base Package Managers
  if (config.packageManagers.packageManagers.includes("homebrew")) {
    out.push("if ! command -v brew >/dev/null 2>&1; then");
    out.push('  echo "📦 安装 Homebrew..."');
    out.push('  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"');
    out.push("fi", "");
  }

  if (config.packageManagers.packageManagers.includes("macports")) {
    out.push(isDarwinGuard('if ! command -v port >/dev/null 2>&1; then echo "请先手动安装 MacPorts"; fi'), "");
  }

  const ctx: ScriptGeneratorContext = { config, preferredPm, out };

  // Modules
  generateNodeScript(ctx);
  generatePythonScript(ctx);
  generateJavaScript(ctx);
  generateDeveloperToolsScript(ctx);

  // Footer
  out.push("brew cleanup 2>/dev/null || true");
  out.push('echo "🎉 环境配置完成！建议重启终端"');

  if (preferredPm === "none") {
    out.unshift("# NOTE: 未选择包管理器，部分工具将使用官方安装方式。");
  }

  return `${out.join("\n").replace(/\n{3,}/g, "\n\n")}\n`;
}
