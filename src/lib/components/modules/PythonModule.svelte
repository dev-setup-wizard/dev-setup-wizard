<script lang="ts">
  import { fly } from "svelte/transition";
  import { configStore } from "$stores/configStore";
  import type { PythonInstallMethod, PythonToolInstallMethod } from "$types/config";

  type InstallMethodOption = {
    key: PythonInstallMethod;
    label: string;
  };

  const installMethodOptions: InstallMethodOption[] = [
    { key: "uv", label: "uv (推荐)" },
    { key: "pyenv", label: "pyenv" },
    { key: "conda", label: "conda" },
    { key: "mise", label: "mise" },
    { key: "asdf", label: "asdf" },
    { key: "brew", label: "Homebrew" },
    { key: "ports", label: "MacPorts" },
    { key: "none", label: "不安装 Python" },
  ];

  const toolInstallOptions: { key: PythonToolInstallMethod; label: string }[] = [
    { key: "pip", label: "pip 安装" },
    { key: "brew", label: "Homebrew" },
    { key: "ports", label: "MacPorts" },
    { key: "script", label: "脚本安装" },
  ];

  const selectedManagers = $derived($configStore.packageManagers.packageManagers);
  const pythonConfig = $derived($configStore.python);

  const hasHomebrew = $derived(selectedManagers.includes("homebrew"));
  const hasPorts = $derived(selectedManagers.includes("macports"));

  const canSelectOptions = $derived(
    pythonConfig.pythonInstallMethod !== "none",
  );

  const filteredInstallMethods = $derived(
    installMethodOptions.map((opt) => {
      if (opt.key === "brew" && !hasHomebrew) return null;
      if (opt.key === "ports" && !hasPorts) return null;
      return opt;
    }).filter(Boolean) as InstallMethodOption[],
  );

  function setInstallMethod(next: PythonInstallMethod): void {
    configStore.patch({
      python: {
        ...pythonConfig,
        pythonInstallMethod: next,
      },
    });
  }

  function setBoolean(key: "installPythonLatest" | "aliasPythonToPython3" | "installPipx" | "installPoetry" | "installPython2", value: boolean): void {
    configStore.patch({
      python: {
        ...pythonConfig,
        [key]: value,
      },
    });
  }

  function setToolMethod(key: "pipxInstallMethod" | "poetryInstallMethod", next: PythonToolInstallMethod): void {
    configStore.patch({
      python: {
        ...pythonConfig,
        [key]: next,
      },
    });
  }
</script>

<section
  id="module-python"
  class="mt-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 md:p-6"
  in:fly={{ y: 18, duration: 350 }}
>
  <div class="flex items-start justify-between gap-3">
    <div>
      <p class="text-xs font-medium tracking-wide text-teal-400">模块 3 / 6</p>
      <h2 class="mt-1 text-xl font-semibold text-slate-100 md:text-2xl">Python 模块</h2>
      <p class="mt-2 text-sm text-slate-400">选择 Python 安装方式和工具。</p>
    </div>
  </div>

  <div class="mt-5">
    <h3 class="text-sm font-medium text-slate-200">Python 安装方式</h3>
    <div class="mt-2">
      <select
        class="w-full rounded-lg border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm text-slate-200"
        value={pythonConfig.pythonInstallMethod}
        onchange={(e) => setInstallMethod(e.currentTarget.value as PythonInstallMethod)}
      >
        {#each filteredInstallMethods as option (option.key)}
          <option value={option.key}>{option.label}</option>
        {/each}
      </select>
    </div>
  </div>

  <div class="mt-5" class:opacity-50={!canSelectOptions} class:pointer-events-none={!canSelectOptions}>
    <h3 class="text-sm font-medium text-slate-200">Python 选项</h3>
    <div class="mt-3 space-y-3">
      <label class="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-950/30 px-3 py-2">
        <span class="text-sm text-slate-200">安装 Python 最新版</span>
        <input
          type="checkbox"
          class="h-4 w-4 accent-teal-500"
          checked={pythonConfig.installPythonLatest}
          disabled={!canSelectOptions}
          onchange={(event) => setBoolean("installPythonLatest", event.currentTarget.checked)}
        />
      </label>

      <label class="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-950/30 px-3 py-2">
        <span class="text-sm text-slate-200">alias python=python3</span>
        <input
          type="checkbox"
          class="h-4 w-4 accent-teal-500"
          checked={pythonConfig.aliasPythonToPython3}
          disabled={!canSelectOptions}
          onchange={(event) => setBoolean("aliasPythonToPython3", event.currentTarget.checked)}
        />
      </label>
    </div>
  </div>

  <div class="mt-6 border-t border-slate-700 pt-5">
    <h3 class="text-sm font-medium text-slate-200">Python 工具</h3>
  </div>

  <div class="mt-4 space-y-3">
    <!-- pipx -->
    <div class="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-950/30 px-3 py-2">
      <label class="flex items-center gap-2">
        <input
          type="checkbox"
          class="h-4 w-4 accent-teal-500"
          checked={pythonConfig.installPipx}
          onchange={(event) => setBoolean("installPipx", event.currentTarget.checked)}
        />
        <span class="text-sm text-slate-200">pipx</span>
      </label>
      {#if pythonConfig.installPipx}
        <select
          class="rounded bg-slate-800 px-2 py-1 text-sm text-slate-200"
          value={pythonConfig.pipxInstallMethod}
          onchange={(e) => setToolMethod("pipxInstallMethod", e.currentTarget.value as PythonToolInstallMethod)}
        >
          {#each toolInstallOptions as opt}
            <option value={opt.key}>{opt.label}</option>
          {/each}
        </select>
      {/if}
    </div>

    <!-- poetry -->
    <div class="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-950/30 px-3 py-2">
      <label class="flex items-center gap-2">
        <input
          type="checkbox"
          class="h-4 w-4 accent-teal-500"
          checked={pythonConfig.installPoetry}
          onchange={(event) => setBoolean("installPoetry", event.currentTarget.checked)}
        />
        <span class="text-sm text-slate-200">poetry</span>
      </label>
      {#if pythonConfig.installPoetry}
        <select
          class="rounded bg-slate-800 px-2 py-1 text-sm text-slate-200"
          value={pythonConfig.poetryInstallMethod}
          onchange={(e) => setToolMethod("poetryInstallMethod", e.currentTarget.value as PythonToolInstallMethod)}
        >
          {#each toolInstallOptions as opt}
            <option value={opt.key}>{opt.label}</option>
          {/each}
        </select>
      {/if}
    </div>

    <!-- Python 2 (deprecated) -->
    <div class="flex items-center justify-between rounded-lg border border-amber-700/40 bg-amber-950/20 px-3 py-2">
      <label class="flex items-center gap-2">
        <input
          type="checkbox"
          class="h-4 w-4 accent-amber-400"
          checked={pythonConfig.installPython2}
          onchange={(event) => setBoolean("installPython2", event.currentTarget.checked)}
        />
        <span class="text-sm text-amber-200">Python 2 (已 EOL)</span>
      </label>
    </div>
  </div>
</section>