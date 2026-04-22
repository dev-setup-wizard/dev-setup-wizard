<script lang="ts">
  import { configStore } from "$stores/config.svelte";
  import ModuleContainer from "./ModuleContainer.svelte";
  import type { NodeInstallMethod, NodeVersion, JsRuntimeInstallMethod } from "$types/config";

  const installMethods: { key: NodeInstallMethod; label: string }[] = [
    { key: "fnm", label: "fnm (推荐)" },
    { key: "nvm", label: "nvm" },
    { key: "n", label: "n" },
    { key: "mise", label: "mise" },
    { key: "brew", label: "Homebrew" },
    { key: "ports", label: "MacPorts" },
    { key: "none", label: "不安装 Node" },
  ];

  const versionOptions: { key: NodeVersion; label: string }[] = [
    { key: "v25", label: "v25 (Current)" },
    { key: "v24", label: "v24 (LTS)" },
    { key: "v22", label: "v22 (LTS)" },
  ];

  const nodeConfig = $derived(configStore.value.node);
  const selectedManagers = $derived(configStore.value.packageManagers.packageManagers);
  const hasHomebrew = $derived(selectedManagers.includes("homebrew"));
  const hasPorts = $derived(selectedManagers.includes("macports"));

  const filteredInstallMethods = $derived(
    installMethods.filter((opt) => {
      if (opt.key === "brew" && !hasHomebrew) return false;
      if (opt.key === "ports" && !hasPorts) return false;
      return true;
    }),
  );

  const getOtherRuntimeInstallMethods = $derived(() => {
    const methods: { key: JsRuntimeInstallMethod; label: string }[] = [];
    if (hasHomebrew) methods.push({ key: "brew", label: "Homebrew" });
    else if (hasPorts) methods.push({ key: "ports", label: "MacPorts" });
    methods.push({ key: "script", label: "官方脚本安装" });
    return methods;
  });

  function setMethod(method: NodeInstallMethod): void {
    configStore.patch({
      node: {
        nodeInstallMethod: method,
        ...(method === "none"
          ? { nodeVersions: [], enableCorepack: false, installYarn: false, installPnpm: false }
          : {}),
      },
    });
  }

  function toggleVersion(version: NodeVersion, checked: boolean): void {
    const current = nodeConfig.nodeVersions;
    const next = checked ? [...new Set([...current, version])] : current.filter((v) => v !== version);
    configStore.patch({ node: { nodeVersions: next } });
  }

  function patchNode(patch: Partial<typeof nodeConfig>) {
    configStore.patch({ node: patch });
  }
</script>

<ModuleContainer
  id="module-node"
  title="Node.js / JavaScript 模块"
  description="选择 Node.js 安装方式、版本以及常用 JS 生态工具。"
>
  <div class="space-y-6">
    <!-- Install Method -->
    <div>
      <h3 class="text-sm font-medium text-slate-200">Node.js 安装方式</h3>
      <select
        class="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm text-slate-200"
        value={nodeConfig.nodeInstallMethod}
        onchange={(e) => setMethod(e.currentTarget.value as NodeInstallMethod)}
      >
        {#each filteredInstallMethods as opt (opt.key)}
          <option value={opt.key}>{opt.label}</option>
        {/each}
      </select>
    </div>

    {#if nodeConfig.nodeInstallMethod !== "none"}
      <!-- Versions -->
      <div class="space-y-2">
        <h3 class="text-sm font-medium text-slate-200">希望安装的 Node 版本</h3>
        <div class="flex flex-wrap gap-3">
          {#each versionOptions as opt (opt.key)}
            <label class="flex items-center gap-2 text-sm text-slate-200">
              <input
                type="checkbox"
                class="h-4 w-4 accent-teal-500"
                checked={nodeConfig.nodeVersions.includes(opt.key)}
                onchange={(e) => toggleVersion(opt.key, e.currentTarget.checked)}
              />
              {opt.label}
            </label>
          {/each}
        </div>
      </div>

      <!-- Package Managers -->
      {#if nodeConfig.nodeVersions.length > 0}
        <div class="space-y-2">
          <h3 class="text-sm font-medium text-slate-200">npm 全局安装包管理器</h3>
          <div class="flex flex-wrap gap-4">
            <label class="flex items-center gap-2 text-sm text-slate-200">
              <input
                type="checkbox"
                class="h-4 w-4 accent-teal-500"
                checked={nodeConfig.enableCorepack}
                onchange={(e) => patchNode({ enableCorepack: e.currentTarget.checked })}
              />
              corepack enable
            </label>
            <label class="flex items-center gap-2 text-sm text-slate-200">
              <input
                type="checkbox"
                class="h-4 w-4 accent-teal-500"
                checked={nodeConfig.installYarn}
                onchange={(e) => patchNode({ installYarn: e.currentTarget.checked })}
              />
              yarn
            </label>
            <label class="flex items-center gap-2 text-sm text-slate-200">
              <input
                type="checkbox"
                class="h-4 w-4 accent-teal-500"
                checked={nodeConfig.installPnpm}
                onchange={(e) => patchNode({ installPnpm: e.currentTarget.checked })}
              />
              pnpm
            </label>
          </div>
        </div>
      {/if}
    {/if}

    <!-- Other Runtimes -->
    <div class="border-t border-slate-700 pt-5">
      <h3 class="text-sm font-medium text-slate-200">其它 JavaScript 运行时</h3>
      <div class="mt-4 grid gap-3 md:grid-cols-2">
        <!-- Bun -->
        <label
          class="flex cursor-pointer items-center justify-between rounded-lg border border-slate-700 bg-slate-950/30 px-3 py-2 transition hover:border-teal-500/50 has-[:checked]:border-teal-500/50"
        >
          <div class="flex items-center gap-2">
            <input
              type="checkbox"
              class="h-4 w-4 accent-teal-500"
              checked={nodeConfig.installBun}
              onchange={(e) => patchNode({ installBun: e.currentTarget.checked })}
            />
            <span class="text-sm text-slate-200">Bun</span>
          </div>
          {#if nodeConfig.installBun}
            <select
              class="rounded bg-slate-800 px-2 py-1 text-xs text-slate-200"
              value={nodeConfig.bunInstallMethod}
              onchange={(e) =>
                patchNode({ bunInstallMethod: e.currentTarget.value as JsRuntimeInstallMethod })}
            >
              {#each getOtherRuntimeInstallMethods() as opt (opt.key)}
                <option value={opt.key}>{opt.label}</option>
              {/each}
            </select>
          {/if}
        </label>

        <!-- Deno -->
        <label
          class="flex cursor-pointer items-center justify-between rounded-lg border border-slate-700 bg-slate-950/30 px-3 py-2 transition hover:border-teal-500/50 has-[:checked]:border-teal-500/50"
        >
          <div class="flex items-center gap-2">
            <input
              type="checkbox"
              class="h-4 w-4 accent-teal-500"
              checked={nodeConfig.installDeno}
              onchange={(e) => patchNode({ installDeno: e.currentTarget.checked })}
            />
            <span class="text-sm text-slate-200">Deno</span>
          </div>
          {#if nodeConfig.installDeno}
            <select
              class="rounded bg-slate-800 px-2 py-1 text-xs text-slate-200"
              value={nodeConfig.denoInstallMethod}
              onchange={(e) =>
                patchNode({ denoInstallMethod: e.currentTarget.value as JsRuntimeInstallMethod })}
            >
              {#each getOtherRuntimeInstallMethods() as opt (opt.key)}
                <option value={opt.key}>{opt.label}</option>
              {/each}
            </select>
          {/if}
        </label>
      </div>
    </div>
  </div>
</ModuleContainer>
