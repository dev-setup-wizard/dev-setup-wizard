<script lang="ts">
  import { fly } from "svelte/transition";
  import { configStore } from "$stores/configStore";
  import type {
    NodeInstallMethod,
    NodeVersion,
    JsRuntimeInstallMethod,
  } from "$types/config";

  type VmOption = {
    key: NodeInstallMethod;
    label: string;
  };

  const installMethods: VmOption[] = [
    { key: "fnm", label: "fnm (推荐)" },
    { key: "nvm", label: "nvm" },
    { key: "n", label: "n" },
    { key: "asdf", label: "asdf" },
    { key: "mise", label: "mise" },
    { key: "brew", label: "Homebrew" },
    { key: "ports", label: "MacPorts" },
    { key: "none", label: "不安装 Node" },
  ];

  const nodeVersionOptions: { key: NodeVersion; label: string }[] = [
    { key: "v25", label: "v25 (Current)" },
    { key: "v24", label: "v24 (LTS)" },
    { key: "v22", label: "v22 (LTS)" },
  ];

  const selectedManagers = $derived(
    $configStore.packageManagers.packageManagers,
  );
  const nodeConfig = $derived($configStore.node);

  const hasHomebrew = $derived(selectedManagers.includes("homebrew"));
  const hasPorts = $derived(selectedManagers.includes("macports"));
  const hasPackageManager = $derived(hasHomebrew || hasPorts);

  const isBrewOrPorts = $derived(
    nodeConfig.nodeInstallMethod === "brew" ||
      nodeConfig.nodeInstallMethod === "ports",
  );
  const isNodeInstalled = $derived(nodeConfig.nodeInstallMethod !== "none");
  const isVersionManager = $derived(
    ["fnm", "nvm", "n", "asdf", "mise"].includes(nodeConfig.nodeInstallMethod),
  );
  const hasSelectedVersion = $derived(nodeConfig.nodeVersions.length > 0);

  const filteredInstallMethods = $derived(
    installMethods
      .map((opt) => {
        if (opt.key === "brew" && !hasHomebrew) return null;
        if (opt.key === "ports" && !hasPorts) return null;
        return opt;
      })
      .filter(Boolean) as VmOption[],
  );

  const canSelectVersions = $derived(isNodeInstalled);
  const canInstallPm = $derived(isNodeInstalled && hasSelectedVersion);

  const filteredRuntimeMethods = $derived(() => {
    const methods: { key: JsRuntimeInstallMethod; label: string }[] = [];

    if (hasPackageManager) {
      if (hasHomebrew) {
        methods.push({ key: "brew", label: "Homebrew" });
      } else if (hasPorts) {
        methods.push({ key: "ports", label: "MacPorts" });
      }
    }
    methods.push({ key: "script", label: "官方脚本安装" });

    return methods;
  });

  function setInstallMethod(next: NodeInstallMethod): void {
    const updates: any = {
      nodeInstallMethod: next,
    };

    if (next === "none") {
      updates.nodeVersions = [];
      updates.enableCorepack = false;
      updates.installYarn = false;
      updates.installPnpm = false;
    }

    configStore.patch({
      node: {
        ...nodeConfig,
        ...updates,
      },
    });
  }

  function toggleNodeVersion(version: NodeVersion, checked: boolean): void {
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

  function setSingleVersion(version: NodeVersion): void {
    configStore.patch({
      node: {
        ...nodeConfig,
        nodeVersions: [version],
      },
    });
  }

  function setBoolean(
    key:
      | "enableCorepack"
      | "installYarn"
      | "installPnpm"
      | "installDeno"
      | "installBun",
    value: boolean,
  ): void {
    configStore.patch({
      node: {
        ...nodeConfig,
        [key]: value,
      },
    });
  }

  function setMethod(
    key: "denoInstallMethod" | "bunInstallMethod",
    next: JsRuntimeInstallMethod,
  ): void {
    configStore.patch({
      node: {
        ...nodeConfig,
        [key]: next,
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
      <h2 class="mt-1 text-xl font-semibold text-slate-100 md:text-2xl">
        Node.js / JavaScript 模块
      </h2>
      <p class="mt-2 text-sm text-slate-400">
        选择 Node.js 安装方式、版本以及常用 JS 生态工具。
      </p>
    </div>
  </div>

  <div class="mt-5">
    <h3 class="text-sm font-medium text-slate-200">Node.js 安装方式</h3>
    <div class="mt-2">
      <select
        class="w-full rounded-lg border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm text-slate-200"
        value={nodeConfig.nodeInstallMethod}
        onchange={(e) =>
          setInstallMethod(e.currentTarget.value as NodeInstallMethod)}
      >
        {#each filteredInstallMethods as option (option.key)}
          <option value={option.key}>{option.label}</option>
        {/each}
      </select>
    </div>
  </div>

  <div class="mt-5">
    <h3 class="text-sm font-medium text-slate-200">希望安装的 Node 版本</h3>
    <div
      class="mt-2 flex flex-wrap gap-3"
      class:opacity-50={!canSelectVersions}
      class:pointer-events-none={!canSelectVersions}
    >
      {#each nodeVersionOptions as option (option.key)}
        <label class="flex items-center gap-2 text-sm text-slate-200">
          <input
            type="checkbox"
            class="h-4 w-4 accent-teal-500"
            checked={nodeConfig.nodeVersions.includes(option.key)}
            disabled={!canSelectVersions}
            onchange={(event) =>
              toggleNodeVersion(option.key, event.currentTarget.checked)}
          />
          {option.label}
        </label>
      {/each}
    </div>
  </div>

  <div class="mt-5">
    <h3 class="text-sm font-medium text-slate-200">npm 全局安装包管理器</h3>
    <div
      class="mt-2 flex flex-wrap gap-3"
      class:opacity-50={!canInstallPm}
      class:pointer-events-none={!canInstallPm}
    >
      <label class="flex items-center gap-2 text-sm text-slate-200">
        <input
          type="checkbox"
          class="h-4 w-4 accent-teal-500"
          checked={canInstallPm && nodeConfig.enableCorepack}
          disabled={!canInstallPm}
          onchange={(event) =>
            setBoolean("enableCorepack", event.currentTarget.checked)}
        />
        corepack enable
      </label>
      <label class="flex items-center gap-2 text-sm text-slate-200">
        <input
          type="checkbox"
          class="h-4 w-4 accent-teal-500"
          checked={canInstallPm && nodeConfig.installYarn}
          disabled={!canInstallPm}
          onchange={(event) =>
            setBoolean("installYarn", event.currentTarget.checked)}
        />
        yarn
      </label>
      <label class="flex items-center gap-2 text-sm text-slate-200">
        <input
          type="checkbox"
          class="h-4 w-4 accent-teal-500"
          checked={canInstallPm && nodeConfig.installPnpm}
          disabled={!canInstallPm}
          onchange={(event) =>
            setBoolean("installPnpm", event.currentTarget.checked)}
        />
        pnpm
      </label>
    </div>
  </div>

  <div class="mt-6 border-t border-slate-700 pt-5">
    <h3 class="text-sm font-medium text-slate-200">其它 JavaScript 运行时</h3>
  </div>

  <div class="mt-4 grid grid-cols-1 gap-3">
    <label
      class="flex cursor-pointer items-center justify-between rounded-lg border border-slate-700 bg-slate-950/30 px-3 py-2 transition hover:border-teal-500/50 has-[:checked]:border-teal-500/50"
    >
      <div class="flex items-center gap-2">
        <input
          type="checkbox"
          class="h-4 w-4 accent-teal-500"
          checked={nodeConfig.installBun}
          onchange={(event) =>
            setBoolean("installBun", event.currentTarget.checked)}
        />
        <span class="text-sm text-slate-200">Bun</span>
      </div>
      {#if nodeConfig.installBun}
        <select
          class="rounded bg-slate-800 px-2 py-1 text-xs text-slate-200"
          value={nodeConfig.bunInstallMethod}
          onchange={(e) =>
            setMethod(
              "bunInstallMethod",
              e.currentTarget.value as JsRuntimeInstallMethod,
            )}
        >
          {#each filteredRuntimeMethods() as opt}
            <option value={opt.key}>{opt.label}</option>
          {/each}
        </select>
      {/if}
    </label>

    <label
      class="flex cursor-pointer items-center justify-between rounded-lg border border-slate-700 bg-slate-950/30 px-3 py-2 transition hover:border-teal-500/50 has-[:checked]:border-teal-500/50"
    >
      <div class="flex items-center gap-2">
        <input
          type="checkbox"
          class="h-4 w-4 accent-teal-500"
          checked={nodeConfig.installDeno}
          onchange={(event) =>
            setBoolean("installDeno", event.currentTarget.checked)}
        />
        <span class="text-sm text-slate-200">Deno</span>
      </div>
      {#if nodeConfig.installDeno}
        <select
          class="rounded bg-slate-800 px-2 py-1 text-xs text-slate-200"
          value={nodeConfig.denoInstallMethod}
          onchange={(e) =>
            setMethod(
              "denoInstallMethod",
              e.currentTarget.value as JsRuntimeInstallMethod,
            )}
        >
          {#each filteredRuntimeMethods() as opt}
            <option value={opt.key}>{opt.label}</option>
          {/each}
        </select>
      {/if}
    </label>
  </div>
</section>
