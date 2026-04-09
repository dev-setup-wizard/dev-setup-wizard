<script lang="ts">
  import { fly } from "svelte/transition";
  import { configStore } from "$stores/configStore";
  import type { NodeVersionManager } from "$types/config";

  type VmOption = {
    key: NodeVersionManager;
    label: string;
    tooltip: string;
  };

  const vmOptions: VmOption[] = [
    { key: "fnm", label: "fnm", tooltip: "启动快，配置轻量，推荐优先。" },
    { key: "nvm", label: "nvm", tooltip: "生态最广，社区资料丰富。" },
    { key: "n", label: "n", tooltip: "使用简单，适合偏命令式习惯。" },
    { key: "asdf", label: "asdf", tooltip: "多语言统一版本管理。" },
    { key: "mise", label: "mise", tooltip: "现代化多语言工具链管理器。" },
    { key: "none", label: "不使用", tooltip: "将使用官方方式安装最新稳定版 Node。" },
  ];

  const selectedManagers = $derived($configStore.packageManagers.packageManagers);
  const nodeConfig = $derived($configStore.node);

  const denoBunDisabled = $derived(
    selectedManagers.includes("none") &&
      selectedManagers.length === 1 &&
      nodeConfig.nodeVersionManager !== "asdf" &&
      nodeConfig.nodeVersionManager !== "mise",
  );

  const denoBunDisabledTip = "需先选择包管理器或使用 asdf/mise。";

  function setVersionManager(next: NodeVersionManager): void {
    configStore.patch({
      node: {
        ...nodeConfig,
        nodeVersionManager: next,
      },
    });
  }

  function toggleNodeVersion(version: "latest" | "lts", checked: boolean): void {
    const current = nodeConfig.nodeVersions;
    const next = checked
      ? Array.from(new Set([...current, version]))
      : current.filter((item) => item !== version);

    configStore.patch({
      node: {
        ...nodeConfig,
        nodeVersions: next,
      },
    });
  }

  function setBoolean(key: "installYarn" | "installPnpm" | "installDeno" | "installBun", value: boolean): void {
    configStore.patch({
      node: {
        ...nodeConfig,
        [key]: value,
      },
    });
  }
</script>

<section
  id="module-node"
  class="mt-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 md:p-6"
  in:fly={{ y: 18, duration: 350 }}
>
  <div class="flex items-start justify-between gap-3">
    <div>
      <p class="text-xs font-medium tracking-wide text-teal-400">模块 2 / 6</p>
      <h2 class="mt-1 text-xl font-semibold text-slate-100 md:text-2xl">Node.js / JavaScript 模块</h2>
      <p class="mt-2 text-sm text-slate-400">选择版本管理器、Node 版本以及常用 JS 生态工具。</p>
    </div>
  </div>

  <div class="mt-5">
    <h3 class="text-sm font-medium text-slate-200">Node 版本管理器</h3>
    <div class="mt-3 grid gap-2 md:grid-cols-3">
      {#each vmOptions as option (option.key)}
        <label
          class="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm text-slate-200 transition hover:border-teal-500/50"
          title={option.tooltip}
        >
          <input
            type="radio"
            name="node-vm"
            class="h-4 w-4 accent-teal-500"
            checked={nodeConfig.nodeVersionManager === option.key}
            onchange={() => setVersionManager(option.key)}
          />
          <span>{option.label}</span>
        </label>
      {/each}
    </div>
  </div>

  <div class="mt-5">
    <h3 class="text-sm font-medium text-slate-200">希望安装的 Node 版本（可不选）</h3>
    <div class="mt-3 flex flex-wrap gap-3">
      <label class="flex items-center gap-2 text-sm text-slate-200" title="最新版本，适合尝鲜。">
        <input
          type="checkbox"
          class="h-4 w-4 accent-teal-500"
          checked={nodeConfig.nodeVersions.includes("latest")}
          onchange={(event) => toggleNodeVersion("latest", event.currentTarget.checked)}
        />
        Node Latest
      </label>
      <label class="flex items-center gap-2 text-sm text-slate-200" title="长期支持版本，推荐大多数开发者。">
        <input
          type="checkbox"
          class="h-4 w-4 accent-teal-500"
          checked={nodeConfig.nodeVersions.includes("lts")}
          onchange={(event) => toggleNodeVersion("lts", event.currentTarget.checked)}
        />
        Node LTS
      </label>
    </div>
  </div>

  <div class="mt-5 grid gap-3 md:grid-cols-2">
    <label class="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-950/30 px-3 py-2">
      <span class="text-sm text-slate-200" title="为 npm 生态补充 yarn 命令支持。">全局安装 yarn</span>
      <input
        type="checkbox"
        role="switch"
        class="h-4 w-4 accent-teal-500"
        checked={nodeConfig.installYarn}
        onchange={(event) => setBoolean("installYarn", event.currentTarget.checked)}
      />
    </label>
    <label class="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-950/30 px-3 py-2">
      <span class="text-sm text-slate-200" title="高性能包管理器，推荐多数现代项目。">全局安装 pnpm</span>
      <input
        type="checkbox"
        role="switch"
        class="h-4 w-4 accent-teal-500"
        checked={nodeConfig.installPnpm}
        onchange={(event) => setBoolean("installPnpm", event.currentTarget.checked)}
      />
    </label>
  </div>

  <div class="mt-5 grid gap-3 md:grid-cols-2">
    <label
      class={`flex items-center justify-between rounded-lg border px-3 py-2 ${
        denoBunDisabled
          ? "cursor-not-allowed border-slate-800 bg-slate-900/40 text-slate-500"
          : "border-slate-700 bg-slate-950/30"
      }`}
      title={denoBunDisabled ? denoBunDisabledTip : "安装 Deno 运行时与工具链。"}
    >
      <span class="text-sm">安装 Deno</span>
      <input
        type="checkbox"
        class="h-4 w-4 accent-teal-500"
        checked={nodeConfig.installDeno}
        disabled={denoBunDisabled}
        onchange={(event) => setBoolean("installDeno", event.currentTarget.checked)}
      />
    </label>
    <label
      class={`flex items-center justify-between rounded-lg border px-3 py-2 ${
        denoBunDisabled
          ? "cursor-not-allowed border-slate-800 bg-slate-900/40 text-slate-500"
          : "border-slate-700 bg-slate-950/30"
      }`}
      title={denoBunDisabled ? denoBunDisabledTip : "安装 Bun 运行时与包管理能力。"}
    >
      <span class="text-sm">安装 Bun</span>
      <input
        type="checkbox"
        class="h-4 w-4 accent-teal-500"
        checked={nodeConfig.installBun}
        disabled={denoBunDisabled}
        onchange={(event) => setBoolean("installBun", event.currentTarget.checked)}
      />
    </label>
  </div>

  {#if denoBunDisabled}
    <p class="mt-3 text-xs text-amber-300">{denoBunDisabledTip}</p>
  {/if}
</section>
