<script lang="ts">
  import { configStore } from "$stores/config.svelte";
  import ModuleContainer from "./ModuleContainer.svelte";
  import type { PythonInstallMethod } from "$types/config";

  const installMethods: { key: PythonInstallMethod; label: string }[] = [
    { key: "uv", label: "uv (推荐)" },
    { key: "pyenv", label: "pyenv" },
    { key: "conda", label: "conda" },
    { key: "mise", label: "mise" },
    { key: "asdf", label: "asdf" },
    { key: "brew", label: "Homebrew" },
    { key: "ports", label: "MacPorts" },
    { key: "none", label: "不安装 Python" },
  ];

  const selectedManagers = $derived(configStore.value.packageManagers.packageManagers);
  const pythonConfig = $derived(configStore.value.python);
  const hasHomebrew = $derived(selectedManagers.includes("homebrew"));
  const hasPorts = $derived(selectedManagers.includes("macports"));

  const filteredInstallMethods = $derived(
    installMethods.filter((opt) => {
      if (opt.key === "brew" && !hasHomebrew) return false;
      if (opt.key === "ports" && !hasPorts) return false;
      return true;
    }),
  );

  function setMethod(method: PythonInstallMethod): void {
    configStore.patch({ python: { pythonInstallMethod: method } });
  }

  function patchPython(patch: Partial<typeof pythonConfig>) {
    configStore.patch({ python: patch });
  }
</script>

<ModuleContainer
  id="module-python"
  title="Python 模块"
  description="选择 Python 安装方式和选项。"
>
  <div class="space-y-6">
    <!-- Install Method -->
    <div>
      <h3 class="text-sm font-medium text-slate-200">Python 安装方式</h3>
      <select
        class="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm text-slate-200"
        value={pythonConfig.pythonInstallMethod}
        onchange={(e) => setMethod(e.currentTarget.value as PythonInstallMethod)}
      >
        {#each filteredInstallMethods as opt (opt.key)}
          <option value={opt.key}>{opt.label}</option>
        {/each}
      </select>
    </div>

    <!-- Options -->
    {#if pythonConfig.pythonInstallMethod !== "none"}
      <div class="space-y-3">
        <h3 class="text-sm font-medium text-slate-200">Python 选项</h3>
        <div class="grid gap-3 md:grid-cols-2">
          <label
            class="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-950/30 px-3 py-2"
          >
            <span class="text-sm text-slate-200">安装 Python 最新版</span>
            <input
              type="checkbox"
              class="h-4 w-4 accent-teal-500"
              checked={pythonConfig.installPythonLatest}
              onchange={(e) => patchPython({ installPythonLatest: e.currentTarget.checked })}
            />
          </label>

          <label
            class="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-950/30 px-3 py-2"
          >
            <span class="text-sm text-slate-200">alias python=python3</span>
            <input
              type="checkbox"
              class="h-4 w-4 accent-teal-500"
              checked={pythonConfig.aliasPythonToPython3}
              onchange={(e) => patchPython({ aliasPythonToPython3: e.currentTarget.checked })}
            />
          </label>

          <label
            class="flex items-center justify-between rounded-lg border border-amber-700/40 bg-amber-950/20 px-3 py-2"
          >
            <span class="text-sm text-amber-200">Python 2 (已 EOL)</span>
            <input
              type="checkbox"
              class="h-4 w-4 accent-amber-400"
              checked={pythonConfig.installPython2}
              onchange={(e) => patchPython({ installPython2: e.currentTarget.checked })}
            />
          </label>
        </div>
      </div>
    {/if}
  </div>
</ModuleContainer>
