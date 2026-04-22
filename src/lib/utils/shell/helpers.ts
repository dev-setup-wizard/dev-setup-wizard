import type { PackageManager } from "$types/config";

export function lines(...items: string[]): string {
  return items.filter(Boolean).join("\n");
}

export function isDarwinGuard(cmd: string): string {
  return lines('if [[ "$OSTYPE" == "darwin"* ]]; then', `  ${cmd}`, "fi");
}

export function installByScript(pkg: string): string[] {
  const scripts: Record<string, string> = {
    fnm: "curl -fsSL https://fnm.vercel.app/install | bash",
    nvm: "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash",
    n: "curl -L https://bit.ly/n-install | bash",
    mise: "curl https://mise.run | sh",
    bun: "curl -fsSL https://bun.sh/install | bash",
    deno: "curl -fsSL https://deno.land/install.sh | sh",
    uv: "curl -LsSf https://astral.sh/uv/install.sh | sh",
    pyenv: "curl -fsSL https://pyenv.run | bash",
    conda: "curl -O https://repo.anaconda.com/miniconda/Miniconda3-latest-MacOSX-arm64.sh | bash",
    sdkman: 'curl -s "https://get.sdkman.io" | bash',
    go: "curl -fsSL https://go.dev/dl/go1.21.5.darwin-arm64.pkg | open -W --wait -g",
    rust: 'curl --proto "=https" --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y',
    ohMyZsh:
      'sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"',
    ohMyPosh: "curl -s https://ohmyposh.sh/install.sh | bash -s || true",
    asdf: "git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.14.0 || true",
    corepack: "npm i -g corepack && corepack enable",
    yarn: "npm i -g yarn",
    pnpm: "npm i -g pnpm",
  };

  return scripts[pkg] ? [scripts[pkg]] : [`# Please install ${pkg} manually`];
}

export function addInstallByPackageManager(pm: PackageManager, packages: string[]): string[] {
  if (packages.length === 0) return [];
  if (pm === "none") return packages.flatMap((pkg) => installByScript(pkg));
  if (pm === "homebrew") return [`brew install ${packages.join(" ")}`];
  if (pm === "macports") return [`sudo port install ${packages.join(" ")}`];
  return [];
}

export function installByMethod(pkg: string, method: string): string[] {
  switch (method) {
    case "npm-global": return [`npm i -g ${pkg} || true`];
    case "brew": return addInstallByPackageManager("homebrew", [pkg]);
    case "ports": return addInstallByPackageManager("macports", [pkg]);
    case "script": return installByScript(pkg);
    default: return [];
  }
}
