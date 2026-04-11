<script lang="ts">
  import { fly } from "svelte/transition";
  import { configStore } from "$stores/configStore";

  const devTools = $derived($configStore.developerTools.shellCustomization);

  function setBoolean(key: "ohMyZsh" | "ohMyPosh" | "installRecommendedPlugins", value: boolean): void {
    const currentDevTools = $configStore.developerTools;
    configStore.patch({
      developerTools: {
        ...currentDevTools,
        shellCustomization: {
          ...currentDevTools.shellCustomization,
          [key]: value,
        },
      },
    });
  }
</script>

<section
  id="module-shell"
  class="mt-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 md:p-6"
  in:fly={{ y: 18, duration: 350 }}
>
  <div class="flex items-start justify-between gap-3">
    <div>
      <p class="text-xs font-medium tracking-wide text-teal-400">模块 6 / 6</p>
      <h2 class="mt-1 text-xl font-semibold text-slate-100 md:text-2xl">Shell 美化</h2>
      <p class="mt-2 text-sm text-slate-400">配置终端主题和提示符。</p>
    </div>
  </div>

  <div class="mt-5 space-y-3">
    <button
      type="button"
      class={`flex w-full items-center justify-between rounded-lg border p-4 text-left transition ${
        devTools.ohMyZsh
          ? "border-teal-500 bg-teal-500/10"
          : "border-slate-700 bg-slate-950/30 hover:border-teal-500/50"
      }`}
      onclick={() => setBoolean("ohMyZsh", !devTools.ohMyZsh)}
    >
      <div>
        <h3 class="text-sm font-medium text-slate-100">Oh My Zsh</h3>
        <p class="mt-1 text-xs text-slate-400">终端美化框架，推荐安装</p>
      </div>
      <span class={`h-4 w-4 rounded-full border ${devTools.ohMyZsh ? "bg-teal-500 border-teal-500" : "border-slate-600"}`}></span>
    </button>

    <button
      type="button"
      class={`flex w-full items-center justify-between rounded-lg border p-4 text-left transition ${
        devTools.ohMyPosh
          ? "border-teal-500 bg-teal-500/10"
          : "border-slate-700 bg-slate-950/30 hover:border-teal-500/50"
      }`}
      onclick={() => setBoolean("ohMyPosh", !devTools.ohMyPosh)}
    >
      <div>
        <h3 class="text-sm font-medium text-slate-100">Oh My Posh</h3>
        <p class="mt-1 text-xs text-slate-400">终端提示符美化</p>
      </div>
      <span class={`h-4 w-4 rounded-full border ${devTools.ohMyPosh ? "bg-teal-500 border-teal-500" : "border-slate-600"}`}></span>
    </button>

    {#if devTools.ohMyZsh}
      <button
        type="button"
        class={`flex w-full items-center justify-between rounded-lg border p-4 text-left transition ${
          devTools.installRecommendedPlugins
            ? "border-teal-500 bg-teal-500/10"
            : "border-slate-700 bg-slate-950/30 hover:border-teal-500/50"
        }`}
        onclick={() => setBoolean("installRecommendedPlugins", !devTools.installRecommendedPlugins)}
      >
        <div>
          <h3 class="text-sm font-medium text-slate-100">推荐插件</h3>
          <p class="mt-1 text-xs text-slate-400">自动安装 zsh-syntax-highlighting 等插件</p>
        </div>
        <span class={`h-4 w-4 rounded-full border ${devTools.installRecommendedPlugins ? "bg-teal-500 border-teal-500" : "border-slate-600"}`}></span>
      </button>
    {/if}
  </div>
</section>