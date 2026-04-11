<script lang="ts">
  import { fly } from "svelte/transition";
  import { configStore } from "$stores/configStore";
  import type { PythonInstallMethod, PythonVersionManager } from "$types/config";

  type VmOption = {
    key: PythonVersionManager;
    label: string;
    tooltip: string;
  };

  const vmOptions: VmOption[] = [
    { key: "pyenv", label: "pyenv", tooltip: "经典 Python 多版本管理方案。" },
    { key: "uv", label: "uv", tooltip: "现代高速 Python 工具链，依赖与虚拟环境体验优秀。" },
    { key: "conda", label: "conda", tooltip: "数据科学场景常见，环境隔离能力强。" },
    { key: "asdf", label: "asdf", tooltip: "多语言统一版本管理。" },
    { key: "mise", label: "mise", tooltip: "现代化多语言版本管理器。" },
    { key: "none", label: "不使用", tooltip: "不使用版本管理器，采用系统级安装。" },
  ];

  const installMethodOptions: Array<{ key: PythonInstallMethod; label: string; tooltip: string }> = [
    {
      key: "package-manager",
      label: "通过 brew/macports 安装",
      tooltip: "可与系统包管理策略保持一致。",
    },
    {
      key: "python-org",
      label: "通过 python.org 官方方式",
      tooltip: "适合不依赖包管理器的安装路径。",
    },
  ];

  const pythonConfig = $derived($configStore.python);

  function setVersionManager(next: PythonVersionManager): void {
    configStore.patch({
      python: {
        ...pythonConfig,
        pythonVersionManager: next,
      },
    });
  }

  function setInstallMethod(next: PythonInstallMethod): void {
    configStore.patch({
      python: {
        ...pythonConfig,
        pythonInstallMethod: next,
      },
    });
  }

  function setBoolean(key: "aliasPythonToPython3" | "installPython2", value: boolean): void {
    configStore.patch({
      python: {
        ...pythonConfig,
        [key]: value,
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
      <p class="mt-2 text-sm text-slate-400">配置 Python 安装策略与兼容选项。</p>
    </div>
  </div>

  <div class="mt-5">
    <h3 class="text-sm font-medium text-slate-200">Python 版本管理器</h3>
    <div class="mt-3 grid gap-2 md:grid-cols-3">
      {#each vmOptions as option (option.key)}
        <label
          class="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm text-slate-200 transition hover:border-teal-500/50"
          title={option.tooltip}
        >
          <input
            type="radio"
            name="python-vm"
            class="h-4 w-4 accent-teal-500"
            checked={pythonConfig.pythonVersionManager === option.key}
            onchange={() => setVersionManager(option.key)}
          />
          <span>{option.label}</span>
        </label>
      {/each}
    </div>
  </div>

  {#if pythonConfig.pythonVersionManager === "none"}
    <div class="mt-5 rounded-xl border border-slate-700 bg-slate-950/30 p-4">
      <h3 class="text-sm font-medium text-slate-200">安装方式</h3>
      <div class="mt-3 grid gap-2 md:grid-cols-2">
        {#each installMethodOptions as option (option.key)}
          <label
            class="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-slate-200 transition hover:border-teal-500/50"
            title={option.tooltip}
          >
            <input
              type="radio"
              name="python-install-method"
              class="h-4 w-4 accent-teal-500"
              checked={pythonConfig.pythonInstallMethod === option.key}
              onchange={() => setInstallMethod(option.key)}
            />
            <span>{option.label}</span>
          </label>
        {/each}
      </div>
    </div>
  {/if}

  <div class="mt-5 grid gap-3 md:grid-cols-2">
    <label
      class="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-950/30 px-3 py-2"
      title="建议大多数开发者开启，减少命令差异。"
    >
      <span class="text-sm text-slate-200">将 python3 设为默认 python</span>
      <input
        type="checkbox"
        role="switch"
        class="h-4 w-4 accent-teal-500"
        checked={pythonConfig.aliasPythonToPython3}
        onchange={(event) => setBoolean("aliasPythonToPython3", event.currentTarget.checked)}
      />
    </label>
    <label
      class="flex items-center justify-between rounded-lg border border-amber-700/40 bg-amber-950/20 px-3 py-2"
      title="Python 2 已停止维护，除非必要不建议安装。"
    >
      <span class="text-sm text-amber-200">安装 Python 2（已停止维护）</span>
      <input
        type="checkbox"
        class="h-4 w-4 accent-amber-400"
        checked={pythonConfig.installPython2}
        onchange={(event) => setBoolean("installPython2", event.currentTarget.checked)}
      />
    </label>
  </div>
</section>
