<script lang="ts">
  import { configStore } from "$stores/config.svelte";
  import ModuleContainer from "./ModuleContainer.svelte";

  const options = [
    {
      key: "homebrew",
      title: "Homebrew",
      description: "macOS 与 Linux 常用包管理器",
      tooltip: "推荐大多数开发者选择，生态最完整。",
    },
    {
      key: "macports",
      title: "MacPorts",
      description: "偏稳定路线的 macOS 包管理器",
      tooltip: "适合已有 MacPorts 使用习惯的用户。",
    },
    {
      key: "none",
      title: "不使用任何包管理器",
      description: "使用官方安装脚本或手动安装",
      tooltip: "会影响后续可选项，可用性会下降。",
    },
  ] as const;

  const selectedPm = $derived(configStore.value.packageManagers.packageManagers[0] ?? "none");

  function selectPm(key: (typeof options)[number]["key"]): void {
    configStore.patch({
      packageManagers: {
        packageManagers: key === "none" ? ["none"] : [key],
      },
    });
  }
</script>

{#snippet headerAction()}
  <span
    class="rounded-full border border-teal-500/40 bg-teal-500/10 px-2.5 py-1 text-xs text-teal-300"
  >
    必选
  </span>
{/snippet}

<ModuleContainer
  id="module-package-managers"
  title="包管理器偏好（必选）"
  description="这将决定后续所有软件的安装方式。"
  className="mt-0"
  {headerAction}
>
  <div class="grid gap-3 md:grid-cols-3">
    {#each options as opt (opt.key)}
      {@const isActive = selectedPm === opt.key}
      <button
        type="button"
        class="group relative flex cursor-pointer flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg {isActive
          ? 'border-teal-500 bg-teal-500/10 shadow-teal-900/30'
          : 'border-slate-700 bg-slate-950/40 hover:border-teal-500/50 hover:shadow-teal-900/30'}"
        onclick={() => selectPm(opt.key)}
        title={opt.tooltip}
      >
        <div class="flex h-4 w-4 items-center justify-center">
          <div
            class="h-4 w-4 rounded-full border-2 {isActive ? 'border-teal-500 bg-teal-500' : 'border-slate-600'}"
          ></div>
        </div>
        <div class="flex flex-col">
          <span class="text-sm font-medium text-slate-100">{opt.title}</span>
          <span class="mt-1 block text-xs text-slate-400">{opt.description}</span>
          <span
            class="mt-2 block text-[11px] text-teal-300/90 opacity-0 transition group-hover:opacity-100"
          >
            提示：{opt.tooltip}
          </span>
        </div>
      </button>
    {/each}
  </div>

  {#if selectedPm === "none"}
    <p
      class="mt-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-300"
    >
      注意：不使用包管理器将影响后续安装选项。部分工具可能需要手动安装或使用官方脚本。
    </p>
  {/if}
</ModuleContainer>
