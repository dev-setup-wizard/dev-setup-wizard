import type { ModuleGenerator } from "./types";
import { addInstallByPackageManager, installByScript } from "./helpers";

export const generateJavaScript: ModuleGenerator = ({ config, preferredPm, out }) => {
  out.push("# ---- Java ----");
  const { jdkInstallMethod, jdkDistribution, jdkVersions } = config.java;
  
  if (jdkInstallMethod === "none") {
    out.push("# 跳过 Java 安装");
  } else {
    const sdkmanDistMap: Record<string, string> = { temurin: "tem", openjdk: "open", oracle: "oracle" };
    const genericDistMap: Record<string, string> = { temurin: "temurin", openjdk: "openjdk", oracle: "oracle-graalvm" };

    switch (jdkInstallMethod) {
      case "sdkman":
        out.push(...installByScript("sdkman"));
        out.push('export SDKMAN_DIR="$HOME/.sdkman"', '[[ -s "$HOME/.sdkman/bin/sdkman-init.sh" ]] && source "$HOME/.sdkman/bin/sdkman-init.sh"');
        jdkVersions.forEach(v => out.push(`sdk install java ${v}-${sdkmanDistMap[jdkDistribution] || "open"} || true`));
        break;
      case "mise":
        jdkVersions.forEach(v => out.push(`mise install java@${genericDistMap[jdkDistribution] || "openjdk"}-${v} || true`));
        break;
      case "asdf":
        out.push(...installByScript("asdf"), '. "$HOME/.asdf/asdf.sh"', "asdf plugin add java https://github.com/halcyon/asdf-java.git || true");
        jdkVersions.forEach(v => out.push(`asdf install java ${genericDistMap[jdkDistribution] || "openjdk"}-${v} || true`));
        break;
      case "brew":
        jdkVersions.forEach(v => {
          if (jdkDistribution === "temurin") out.push(`brew install --cask temurin@${v} || true`);
          else if (jdkDistribution === "openjdk") out.push(`brew install openjdk@${v} || true`);
          else out.push(`brew install --cask oracle-jdk@${v} || true`);
        });
        break;
      case "ports":
        out.push(...addInstallByPackageManager("macports", jdkVersions.map(v => `openjdk${v}`)));
        break;
    }
  }
  out.push("");
};
