<script lang="ts">
  import { fly } from "svelte/transition";
  import { configStore } from "$stores/configStore";
  import type { Config, DeveloperToolsConfig } from "$types/config";
  import { DEV_TOOLS_SECTIONS } from "$lib/constants/devTools";

  const devTools = $derived($configStore.developerTools);
  const targetOs = $derived($configStore.ui.targetOs);
  const isMac = $derived(targetOs === "macos");
  const packageManager = $derived($configStore.packageManagers.packageManagers[0] ?? "none");
  const canInstallTools = $derived(packageManager !== "none");

  // Filter sections and tools based on package manager
  const filteredSections = $derived(
    DEV_TOOLS_SECTIONS.map((section) => {
      const tools = section.tools.filter((tool) => {
        // Mac only check
        if (tool.isMacOnly && !isMac) return false;
        // Package manager specific check
        if (packageManager === "macports" && tool.notInPorts) return false;
        return true;
      });

      return { ...section, tools };
    }).filter((section) => section.tools.length > 0),
  );

  function patchSection<T extends keyof DeveloperToolsConfig>(
    section: T,
    key: string,
    value: boolean,
  ): void {
    configStore.patch({
      developerTools: {
        ...devTools,
        [section]: { ...devTools[section], [key]: value },
      },
    });
  }
</script>

<section
  id="module-developer-tools"
  class="mt-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 md:p-6"
  in:fly={{ y: 18, duration: 350 }}
>
  <div class="flex items-start justify-between gap-3">
    <div>
      <h2 class="mt-1 text-xl font-semibold text-slate-100 md:text-2xl">其他开发者工具</h2>
      <p class="mt-2 text-sm text-slate-400">按分组选择需要安装的工具。</p>
    </div>
  </div>

  <div class="mt-5 space-y-3">
    {#if packageManager === "none"}
      <div class="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4">
        <p class="text-sm text-amber-300">
          当前未选择包管理器，暂不支持安装其他开发者工具。请在第一个模块中选择 Homebrew 或
          MacPorts。
        </p>
      </div>
    {:else}
      {#each filteredSections as section}
        <details
          class="rounded-xl border border-slate-700 bg-slate-950/30 p-4"
          open={section.key === "cliTools"}
        >
          <summary class="cursor-pointer text-sm font-medium text-slate-100"
            >{section.title}</summary
          >
          <div class="mt-3 grid gap-2 md:grid-cols-3">
            {#each section.tools as tool (tool.id)}
              <label
                class="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2 text-sm text-slate-200"
              >
                <span>{tool.name}{tool.isMacOnly ? "（仅 Mac）" : ""}</span>
                <input
                  type="checkbox"
                  class="h-4 w-4 accent-teal-500"
                  checked={(devTools[section.key] as any)[tool.id]}
                  onchange={(e) =>
                    patchSection(section.key as any, tool.id, e.currentTarget.checked)}
                />
              </label>
            {/each}
          </div>
        </details>
      {/each}
    {/if}
  </div>
</section>
