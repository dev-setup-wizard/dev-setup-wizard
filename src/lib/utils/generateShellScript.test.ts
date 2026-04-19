import { describe, expect, it } from "vitest";
import { defaultConfig, type Config } from "$types/config";
import { generateShellScript } from "./generateShellScript";

function makeConfig(patch: Partial<Config>): Config {
  return {
    ...defaultConfig,
    ...patch,
    packageManagers: { ...defaultConfig.packageManagers, ...patch.packageManagers },
    node: { ...defaultConfig.node, ...patch.node },
    python: { ...defaultConfig.python, ...patch.python },
    java: { ...defaultConfig.java, ...patch.java },
    otherLanguages: { ...defaultConfig.otherLanguages, ...patch.otherLanguages },
    developerTools: {
      ...defaultConfig.developerTools,
      ...patch.developerTools,
      cliTools: { ...defaultConfig.developerTools.cliTools, ...patch.developerTools?.cliTools },
      shellCustomization: {
        ...defaultConfig.developerTools.shellCustomization,
        ...patch.developerTools?.shellCustomization,
      },
      servers: { ...defaultConfig.developerTools.servers, ...patch.developerTools?.servers },
      databases: { ...defaultConfig.developerTools.databases, ...patch.developerTools?.databases },
      containers: {
        ...defaultConfig.developerTools.containers,
        ...patch.developerTools?.containers,
      },
      guiApps: { ...defaultConfig.developerTools.guiApps, ...patch.developerTools?.guiApps },
      aiTools: { ...defaultConfig.developerTools.aiTools, ...patch.developerTools?.aiTools },
      networkTools: {
        ...defaultConfig.developerTools.networkTools,
        ...patch.developerTools?.networkTools,
      },
    },
    ui: { ...defaultConfig.ui, ...patch.ui },
  };
}

describe("generateShellScript", () => {
  it("contains required bash headers and os detection", () => {
    const script = generateShellScript(defaultConfig);
    expect(script).toContain("#!/usr/bin/env bash");
    expect(script).toContain("set -euo pipefail");
    expect(script).toContain('OS="$(uname -s)"');
  });

  it("uses brew install commands when homebrew is selected", () => {
    const cfg = makeConfig({ packageManagers: { packageManagers: ["homebrew"] } });
    const script = generateShellScript(cfg);
    expect(script).toContain("brew install");
  });

  it("adds darwin guard for mac-only hints", () => {
    const cfg = makeConfig({
      packageManagers: { packageManagers: ["macports"] },
      python: {
        ...defaultConfig.python,
        pythonInstallMethod: "ports",
      },
    });
    const script = generateShellScript(cfg);
    expect(script).toContain('if [[ "$OSTYPE" == "darwin"* ]]; then');
  });

  it("appends cleanup and completion message", () => {
    const script = generateShellScript(defaultConfig);
    expect(script).toContain("brew cleanup 2>/dev/null || true");
    expect(script).toContain('echo "🎉 环境配置完成！建议重启终端"');
  });
});
