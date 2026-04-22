import type { ModuleGenerator } from "./types";
import { addInstallByPackageManager, installByMethod } from "./helpers";

export const generateNodeScript: ModuleGenerator = ({ config, preferredPm, out }) => {
  out.push("# ---- Node.js ----");
  const { nodeVersions, nodeInstallMethod, enableCorepack, installYarn, installPnpm, installBun, bunInstallMethod, installDeno, denoInstallMethod } = config.node;
  
  if (nodeInstallMethod === "none") {
    out.push("# 跳过 Node.js 安装（如需使用本脚本安装，请先选择安装方式）");
  } else if (nodeVersions.length > 0) {
    const latestVersion = getLatestVersion(nodeVersions);
    
    switch (nodeInstallMethod) {
      case "fnm":
        out.push(...addInstallByPackageManager(preferredPm, ["fnm"]));
        nodeVersions.forEach(v => out.push(`fnm install ${v.replace("v", "")}`));
        if (latestVersion) out.push(`fnm default ${latestVersion} || true`);
        break;
      case "asdf":
        out.push("asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git || true");
        nodeVersions.forEach(v => out.push(`asdf install nodejs ${v.replace("v", "")}`));
        if (latestVersion) out.push(`asdf global nodejs ${latestVersion} || true`);
        break;
      case "nvm":
        out.push(...addInstallByPackageManager(preferredPm, ["nvm"]));
        nodeVersions.forEach(v => out.push(`nvm install ${v.replace("v", "")}`));
        if (latestVersion) out.push(`nvm alias default ${latestVersion} || true`);
        break;
      case "n":
        out.push(...addInstallByPackageManager(preferredPm, ["n"]));
        nodeVersions.forEach(v => out.push(`n ${v.replace("v", "")}`));
        if (latestVersion) out.push(`n alias default ${latestVersion} || true`);
        break;
      case "mise":
        out.push(...addInstallByPackageManager(preferredPm, ["mise"]));
        nodeVersions.forEach(v => out.push(`mise install node@${v.replace("v", "")}`));
        if (latestVersion) out.push(`mise use -g node@${latestVersion} || true`);
        break;
      case "brew":
        out.push(...addInstallByPackageManager("homebrew", nodeVersions.map(v => `node@${v.replace("v", "")}`)));
        if (latestVersion) {
          out.push(`brew unlink node || true`, `brew link node@${latestVersion} || true`);
        }
        break;
      case "ports":
        out.push(...addInstallByPackageManager("macports", nodeVersions.map(v => `node${v.replace("v", "")}`)));
        if (latestVersion) out.push(`port select node node${latestVersion} || true`);
        break;
    }

    if (enableCorepack) {
      if (parseInt(latestVersion) >= 25) {
        out.push("# 从 Node.js v25 开始，默认安装不包含 corepack");
        out.push(...installByMethod("corepack", "npm-global"));
      } else {
        out.push(`# Node.js v${latestVersion} 自带 corepack`);
      }
    }
    if (installYarn) out.push(...installByMethod("yarn", "npm-global"));
    if (installPnpm) out.push(...installByMethod("pnpm", "npm-global"));
  }

  if (installBun) {
    out.push("# Bun");
    out.push(...installByMethod("bun", bunInstallMethod));
  }
  if (installDeno) {
    out.push("# Deno");
    out.push(...installByMethod("deno", denoInstallMethod));
  }
  out.push("");
};

function getLatestVersion(versions: string[]): string {
  if (versions.length === 0) return "";
  const nums = versions.map((v) => parseInt(v.replace("v", ""), 10));
  return String(Math.max(...nums));
}
