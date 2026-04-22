import type { ModuleGenerator } from "./types";
import { addInstallByPackageManager, installByScript } from "./helpers";

export const generatePythonScript: ModuleGenerator = ({ config, preferredPm, out }) => {
  out.push("# ---- Python ----");
  const { pythonInstallMethod, installPythonLatest, aliasPythonToPython3, installPython2 } = config.python;
  
  if (pythonInstallMethod === "none") {
    out.push("# 跳过 Python 安装");
  } else {
    switch (pythonInstallMethod) {
      case "uv": out.push(...addInstallByPackageManager(preferredPm, ["uv"])); break;
      case "pyenv": out.push(...addInstallByPackageManager(preferredPm, ["pyenv"])); break;
      case "asdf":
        out.push(...installByScript("asdf"));
        out.push('. "$HOME/.asdf/asdf.sh"');
        out.push("asdf plugin add python https://github.com/asdf-community/asdf-python.git || true");
        if (installPythonLatest) out.push("asdf install python latest && asdf global python latest");
        break;
      case "conda": out.push(...addInstallByPackageManager(preferredPm, ["conda"])); break;
      case "mise": out.push(...addInstallByPackageManager(preferredPm, ["mise"])); break;
      case "brew": out.push(...addInstallByPackageManager("homebrew", ["python"])); break;
      case "ports": out.push(...addInstallByPackageManager("macports", ["python3"])); break;
    }
    if (installPythonLatest && pythonInstallMethod !== "asdf") {
      out.push(pythonInstallMethod === "uv" ? "uv python install latest" : "# install python latest");
    }
  }

  if (aliasPythonToPython3) {
    out.push('echo \'alias python="python3"\' >> ~/.zshrc', 'echo \'alias pip="pip3"\' >> ~/.zshrc');
  }
  if (installPython2) out.push("# WARNING: Python 2 已停止维护");
  out.push("");
};
