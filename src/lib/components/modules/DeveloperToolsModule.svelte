<script lang="ts">
  import { fly } from "svelte/transition";
  import { configStore } from "$stores/configStore";
  import type { Config } from "$types/config";

  type DevTools = Config["developerTools"];
  type CliKey = keyof DevTools["cliTools"];
  type ServerKey = keyof DevTools["servers"];
  type DatabaseKey = keyof DevTools["databases"];
  type ContainerKey = keyof DevTools["containers"];
  type GuiKey = keyof DevTools["guiApps"];
  type AiKey = keyof DevTools["aiTools"];
  type NetworkKey = keyof DevTools["networkTools"];

  const cliKeys: CliKey[] = ["git", "openssh", "php", "cocoapods", "tmux", "jq", "wget", "autojump", "gh"];
  const serverKeys: ServerKey[] = ["nginx", "tomcat", "apache"];
  const databaseKeys: DatabaseKey[] = ["mysql", "mariadb", "postgresql", "mongodb"];
  const containerKeys: ContainerKey[] = [
    "docker",
    "containerd",
    "podman",
    "kubernetes",
    "appleVirtualization",
    "lxc",
    "lxd",
  ];
  const guiKeys: GuiKey[] = [
    "vscode",
    "androidStudio",
    "intellijIdea",
    "webstorm",
    "pycharm",
    "sublimeText",
    "iterm2",
    "googleChrome",
    "microsoftEdge",
    "firefox",
    "githubDesktop",
    "anotherRedisDesktopManager",
  ];
  const aiKeys: AiKey[] = ["ollama", "continueDevCli", "openWebui"];
  const networkKeys: NetworkKey[] = ["postman", "bruno", "httpie", "proxyman", "tailscale", "zerotier"];

  const devTools = $derived($configStore.developerTools);
  const targetOs = $derived($configStore.ui.targetOs);
  const isMac = $derived(targetOs === "macos");
  const packageManager = $derived($configStore.packageManagers.packageManagers[0] ?? "none");
  const canInstallTools = $derived(packageManager !== "none");

  const hasContainerSelected = $derived(
    devTools.containers.docker ||
      devTools.containers.containerd ||
      devTools.containers.podman ||
      devTools.containers.kubernetes ||
      devTools.containers.appleVirtualization ||
      devTools.containers.lxc ||
      devTools.containers.lxd,
  );

  function patchSection<T extends keyof typeof devTools>(
    section: T,
    key: keyof (typeof devTools)[T],
    value: boolean,
  ): void {
    configStore.patch({
      developerTools: {
        ...devTools,
        [section]: {
          ...devTools[section],
          [key]: value,
        },
      },
    });
  }
</script>

<section
  id="module-developer-tools"
  class="mt-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 md:p-6"
  in:fly={{ y: 18, duration: 350 }}
>
  {#if packageManager === "none"}
    <div class="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4">
      <p class="text-sm text-amber-300">
        选择包管理器后才能安装其他开发者工具。请在第一个模块中选择 Homebrew 或 MacPorts。
      </p>
    </div>
  {/if}

  <div class:opacity-50={!canInstallTools} class:pointer-events-none={!canInstallTools}>
    <div class="flex items-start justify-between gap-3">
    <div>
      <p class="text-xs font-medium tracking-wide text-teal-400">模块 6 / 6</p>
      <h2 class="mt-1 text-xl font-semibold text-slate-100 md:text-2xl">其他开发者工具</h2>
      <p class="mt-2 text-sm text-slate-400">按分组启用常用 CLI、服务端、数据库、容器与 GUI 工具。</p>
</div>
    </div>
  </div>
</section>
