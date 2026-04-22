import type { ModuleGenerator } from "./types";
import { addInstallByPackageManager, installByScript } from "./helpers";
import { DEV_TOOLS_SECTIONS } from "$lib/constants/devTools";

export const generateDeveloperToolsScript: ModuleGenerator = ({ config, preferredPm, out }) => {
  const { otherLanguages } = config;
  
  // Other languages
  out.push("# ---- Other Languages ----");
  if (otherLanguages.go.enabled) {
    out.push(...addInstallByPackageManager(mapPm(otherLanguages.go.installMethod), ["go"]));
  }
  if (otherLanguages.rust.enabled) out.push(...installByScript("rust"));
  if (otherLanguages.dart.enabled) {
    out.push(...addInstallByPackageManager(mapPm(otherLanguages.dart.installMethod), ["dart"]));
  }
  if (otherLanguages.otherEnabled && otherLanguages.otherName.trim()) {
    out.push(`# custom language: ${otherLanguages.otherName.trim()}`);
  }
  out.push("");

  // Shell customization
  const { ohMyZsh, installRecommendedPlugins, ohMyPosh } = config.developerTools.shellCustomization;
  out.push("# ---- Shell 美化 ----");
  if (ohMyZsh) {
    out.push(...installByScript("ohMyZsh"));
    if (installRecommendedPlugins) {
      out.push(
        'git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ~/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting || true',
        'git clone https://github.com/zsh-users/zsh-autosuggestions ~/.oh-my-zsh/custom/plugins/zsh-autosuggestions || true'
      );
    }
  }
  if (ohMyPosh) out.push(...installByScript("ohMyPosh"));
  out.push("");

  // Developer tools
  if (preferredPm !== "none") {
    out.push("# ---- Developer Tools ----");
    for (const section of DEV_TOOLS_SECTIONS) {
      const selectedTools = section.tools.filter(t => (config.developerTools[section.key] as any)[t.id]);
      if (selectedTools.length > 0) {
        out.push(`# ${section.title}`);
        if (preferredPm === "homebrew") {
          const formulaes = selectedTools.filter(t => !t.isCask).map(t => t.id);
          const casks = selectedTools.filter(t => t.isCask).map(t => t.id);
          if (formulaes.length > 0) out.push(`brew install ${formulaes.join(" ")}`);
          if (casks.length > 0) out.push(`brew install --cask ${casks.join(" ")}`);
        } else if (preferredPm === "macports") {
          const supported = selectedTools.filter(t => !t.notInPorts).map(t => t.id);
          const unsupported = selectedTools.filter(t => t.notInPorts).map(t => t.id);
          if (supported.length > 0) out.push(`sudo port install ${supported.join(" ")}`);
          if (unsupported.length > 0) out.push(`# MacPorts 不支持以下工具: ${unsupported.join(", ")}`);
        }
      }
    }
  }

  const { addCurrentUserToContainerGroups, docker, lxd } = config.developerTools.containers;
  if (addCurrentUserToContainerGroups) {
    if (docker) out.push('sudo usermod -aG docker "$USER" || true');
    if (lxd) out.push('sudo usermod -aG lxd "$USER" || true');
  }
};

function mapPm(method: string): any {
  if (method === "brew") return "homebrew";
  if (method === "ports") return "macports";
  return "none";
}
