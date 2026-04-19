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
  const containerKeys: ContainerKey[] = ["docker", "containerd", "podman", "kubernetes", "appleVirtualization", "lxc", "lxd"];
  const guiKeys: GuiKey[] = ["vscode", "androidStudio", "intellijIdea", "webstorm", "pycharm", "sublimeText", "iterm2", "googleChrome", "microsoftEdge", "firefox", "githubDesktop", "anotherRedisDesktopManager"];
  const aiKeys: AiKey[] = ["ollama", "continueDevCli", "openWebui"];
  const networkKeys: NetworkKey[] = ["postman", "bruno", "httpie", "proxyman", "tailscale", "zerotier"];

  const devTools = $derived($configStore.developerTools);
  const targetOs = $derived($configStore.ui.targetOs);
  const isMac = $derived(targetOs === "macos");
  const packageManager = $derived($configStore.packageManagers.packageManagers[0] ?? "none");
  const canInstallTools = $derived(packageManager !== "none");

  const hasContainerSelected = $derived(
    devTools.containers.docker || devTools.containers.containerd || devTools.containers.podman ||
    devTools.containers.kubernetes || devTools.containers.appleVirtualization || devTools.containers.lxc || devTools.containers.lxd,
  );

  function patchSection<T extends keyof typeof devTools>(section: T, key: keyof DevTools[T], value: boolean): void {
    configStore.patch({
      developerTools: {
        ...devTools,
        [section]: {...devTools[section], [key]: value},
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
    <div class="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 mb-4">
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
        <p class="mt-2 text-sm text-slate-400">按分组选择需要安装的工具。</p>
      </div>
    </div>

    <div class="mt-5 space-y-3">
      <details open class="rounded-xl border border-slate-700 bg-slate-950/30 p-4">
        <summary class="cursor-pointer text-sm font-medium text-slate-100">基础 CLI 工具</summary>
        <div class="mt-3 grid gap-2 md:grid-cols-3">
          {#each cliKeys as key (key)}
            <label class="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2 text-sm text-slate-200">
              <span>{key}</span>
              <input type="checkbox" class="h-4 w-4 accent-teal-500" checked={devTools.cliTools[key]} onchange={(e) => patchSection("cliTools", key, e.currentTarget.checked)} />
            </label>
          {/each}
        </div>
      </details>

      <details class="rounded-xl border border-slate-700 bg-slate-950/30 p-4">
        <summary class="cursor-pointer text-sm font-medium text-slate-100">服务器</summary>
        <div class="mt-3 grid gap-2 md:grid-cols-3">
          {#each serverKeys as key (key)}
            <label class="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2 text-sm text-slate-200">
              <span>{key}</span>
              <input type="checkbox" class="h-4 w-4 accent-teal-500" checked={devTools.servers[key]} onchange={(e) => patchSection("servers", key, e.currentTarget.checked)} />
            </label>
          {/each}
        </div>
      </details>

      <details class="rounded-xl border border-slate-700 bg-slate-950/30 p-4">
        <summary class="cursor-pointer text-sm font-medium text-slate-100">数据库</summary>
        <div class="mt-3 grid gap-2 md:grid-cols-3">
          {#each databaseKeys as key (key)}
            <label class="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2 text-sm text-slate-200">
              <span>{key}</span>
              <input type="checkbox" class="h-4 w-4 accent-teal-500" checked={devTools.databases[key]} onchange={(e) => patchSection("databases", key, e.currentTarget.checked)} />
            </label>
          {/each}
        </div>
      </details>

      <details class="rounded-xl border border-slate-700 bg-slate-950/30 p-4">
        <summary class="cursor-pointer text-sm font-medium text-slate-100">容器 & 虚拟化</summary>
        <div class="mt-3 grid gap-2 md:grid-cols-3">
          {#each containerKeys as key (key)}
            <label class={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${key === "appleVirtualization" && !isMac ? "cursor-not-allowed border-slate-800 bg-slate-900/40 text-slate-500" : "border-slate-700 bg-slate-900/40 text-slate-200"}`} title={key === "appleVirtualization" && !isMac ? "仅 macOS 可用" : ""}>
              <span>{key === "appleVirtualization" ? "Apple Virtualization（仅 Mac）" : key}</span>
              <input type="checkbox" class="h-4 w-4 accent-teal-500" checked={devTools.containers[key]} disabled={key === "appleVirtualization" && !isMac} onchange={(e) => patchSection("containers", key, e.currentTarget.checked)} />
            </label>
          {/each}
        </div>
      </details>

      <details class="rounded-xl border border-slate-700 bg-slate-950/30 p-4">
        <summary class="cursor-pointer text-sm font-medium text-slate-100">GUI 应用</summary>
        <div class="mt-3 grid gap-2 md:grid-cols-3">
          {#each guiKeys as key (key)}
            <label class="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2 text-sm text-slate-200">
              <span>{key}</span>
              <input type="checkbox" class="h-4 w-4 accent-teal-500" checked={devTools.guiApps[key]} onchange={(e) => patchSection("guiApps", key, e.currentTarget.checked)} />
            </label>
          {/each}
        </div>
      </details>

      <details class="rounded-xl border border-slate-700 bg-slate-950/30 p-4">
        <summary class="cursor-pointer text-sm font-medium text-slate-100">AI 工具</summary>
        <div class="mt-3 grid gap-2 md:grid-cols-3">
          {#each aiKeys as key (key)}
            <label class="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2 text-sm text-slate-200">
              <span>{key}</span>
              <input type="checkbox" class="h-4 w-4 accent-teal-500" checked={devTools.aiTools[key]} onchange={(e) => patchSection("aiTools", key, e.currentTarget.checked)} />
            </label>
          {/each}
        </div>
      </details>

      <details class="rounded-xl border border-slate-700 bg-slate-950/30 p-4">
        <summary class="cursor-pointer text-sm font-medium text-slate-100">网络工具</summary>
        <div class="mt-3 grid gap-2 md:grid-cols-3">
          {#each networkKeys as key (key)}
            <label class={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${key === "proxyman" && !isMac ? "cursor-not-allowed border-slate-800 bg-slate-900/40 text-slate-500" : "border-slate-700 bg-slate-900/40 text-slate-200"}`} title={key === "proxyman" && !isMac ? "仅 macOS 可用" : ""}>
              <span>{key === "proxyman" ? "Proxyman（仅 Mac）" : key}</span>
              <input type="checkbox" class="h-4 w-4 accent-teal-500" checked={devTools.networkTools[key]} disabled={key === "proxyman" && !isMac} onchange={(e) => patchSection("networkTools", key, e.currentTarget.checked)} />
            </label>
          {/each}
        </div>
      </details>
    </div>
  </div>
</section>