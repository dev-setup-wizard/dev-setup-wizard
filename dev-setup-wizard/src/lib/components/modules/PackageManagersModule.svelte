<script lang="ts">
  import { fly } from "svelte/transition";
  import { configStore } from "$stores/configStore";
  import type { PackageManager } from "$types/config";

  type PackageOption = {
    key: PackageManager;
    title: string;
    description: string;
    tooltip: string;
  };

  const options: PackageOption[] = [
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
      description: "后续将尽量使用官方安装脚本",
      tooltip: "会影响后续可选项，可用性会下降。",
    },
  ];

  const selectedManagers = $derived($configStore.packageManagers.packageManagers);
  const isValid = $derived(selectedManagers.length > 0);

  function toggleManager(key: PackageManager, checked: boolean): void {
    const current = $configStore.packageManagers.packageManagers;
    let next: PackageManager[] = current;

    if (key === "none") {
      next = checked ? ["none"] : [];
    } else if (checked) {
      next = current.filter((item) => item !== "none");
      if (!next.includes(key)) next = [...next, key];
    } else {
      next = current.filter((item) => item !== key);
    }

    configStore.patch({
      packageManagers: {
        packageManagers: next,
      },
    });
  }
</script>

<section
  id="module-package-managers"
  class="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 md:p-6"
  in:fly={{ y: 18, duration: 350 }}
>
  <div class="flex items-start justify-between gap-3">
    <div>
      <p class="text-xs font-medium tracking-wide text-teal-400">模块 1 / 6</p>
      <h2 class="mt-1 text-xl font-semibold text-slate-100 md:text-2xl">包管理器偏好（必选）</h2>
      <p class="mt-2 text-sm text-slate-400">这将决定后续所有软件的安装方式。</p>
    </div>
    <span class="rounded-full border border-teal-500/40 bg-teal-500/10 px-2.5 py-1 text-xs text-teal-300">
      必选
    </span>
  </div>

  <div class="mt-5 grid gap-3 md:grid-cols-3">
    {#each options as option (option.key)}
      <label
        class="group relative flex cursor-pointer items-start gap-3 rounded-xl border border-slate-700 bg-slate-950/40 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-500/50 hover:shadow-lg hover:shadow-teal-900/30"
        title={option.tooltip}
      >
        <input
          type="checkbox"
          class="mt-0.5 h-4 w-4 accent-teal-500"
          checked={selectedManagers.includes(option.key)}
          onchange={(event) => toggleManager(option.key, event.currentTarget.checked)}
        />
        <span>
          <span class="text-sm font-medium text-slate-100">{option.title}</span>
          <span class="mt-1 block text-xs text-slate-400">{option.description}</span>
          <span class="mt-2 block text-[11px] text-teal-300/90 opacity-0 transition group-hover:opacity-100">
            提示：{option.tooltip}
          </span>
        </span>
      </label>
    {/each}
  </div>

  {#if !isValid}
    <p class="mt-3 text-sm text-rose-400">请至少选择一个包管理器选项，才能继续下一步。</p>
  {/if}
</section>
