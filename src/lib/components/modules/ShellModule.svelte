<script lang="ts">
  import { fly } from "svelte/transition";
  import { configStore } from "$stores/configStore";

  const shellConfig = $derived($configStore.developerTools.shellCustomization);

  function setShell(value: "ohMyZsh" | "ohMyPosh" | "none"): void {
    const currentDevTools = $configStore.developerTools;
    configStore.patch({
      developerTools: {
        ...currentDevTools,
        shellCustomization: {
          ...currentDevTools.shellCustomization,
          ohMyZsh: value === "ohMyZsh",
          ohMyPosh: value === "ohMyPosh",
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
      <p class="mt-2 text-sm text-slate-400">选择终端美化方案（二选一）。</p>
    </div>
  </div>

  <div class="mt-5 grid gap-3">
    <button
      type="button"
      class={`flex w-full items-center justify-between rounded-lg border p-4 text-left transition ${
        shellConfig.ohMyZsh
          ? "border-teal-500 bg-teal-500/10"
          : "border-slate-700 bg-slate-950/30 hover:border-teal-500/50"
      }`}
      onclick={() => setShell(shellConfig.ohMyZsh ? "none" : "ohMyZsh")}
    >
      <div>
        <h3 class="text-sm font-medium text-slate-100">Oh My Zsh</h3>
        <p class="mt-1 text-xs text-slate-400">终端美化框架</p>
      </div>
      <span
        class={`h-4 w-4 rounded-full border-2 ${shellConfig.ohMyZsh ? "border-teal-500 bg-teal-500" : "border-slate-600"}`}
      ></span>
    </button>

    <button
      type="button"
      class={`flex w-full items-center justify-between rounded-lg border p-4 text-left transition ${
        shellConfig.ohMyPosh
          ? "border-teal-500 bg-teal-500/10"
          : "border-slate-700 bg-slate-950/30 hover:border-teal-500/50"
      }`}
      onclick={() => setShell(shellConfig.ohMyPosh ? "none" : "ohMyPosh")}
    >
      <div>
        <h3 class="text-sm font-medium text-slate-100">Oh My Posh</h3>
        <p class="mt-1 text-xs text-slate-400">终端提示符美化</p>
      </div>
      <span
        class={`h-4 w-4 rounded-full border-2 ${shellConfig.ohMyPosh ? "border-teal-500 bg-teal-500" : "border-slate-600"}`}
      ></span>
    </button>

    <button
      type="button"
      class={`flex w-full items-center justify-between rounded-lg border p-4 text-left transition ${
        !shellConfig.ohMyZsh && !shellConfig.ohMyPosh
          ? "border-teal-500 bg-teal-500/10"
          : "border-slate-700 bg-slate-950/30 hover:border-teal-500/50"
      }`}
      onclick={() => setShell(!shellConfig.ohMyZsh && !shellConfig.ohMyPosh ? "none" : "none")}
    >
      <div>
        <h3 class="text-sm font-medium text-slate-100">不安装</h3>
        <p class="mt-1 text-xs text-slate-400">跳过 shell 美化</p>
      </div>
      <span
        class={`h-4 w-4 rounded-full border-2 ${!shellConfig.ohMyZsh && !shellConfig.ohMyPosh ? "border-teal-500 bg-teal-500" : "border-slate-600"}`}
      ></span>
    </button>
  </div>
</section>
