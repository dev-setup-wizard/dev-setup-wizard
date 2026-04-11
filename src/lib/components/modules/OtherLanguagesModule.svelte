<script lang="ts">
  import { fly } from "svelte/transition";
  import { configStore } from "$stores/configStore";

  const flutterChannels = ["stable", "beta", "master"] as const;

  const otherLanguages = $derived($configStore.otherLanguages);

  function setBoolean(key: "goEnabled" | "rustEnabled" | "flutterEnabled" | "dartEnabled", value: boolean): void {
    configStore.patch({otherLanguages: {...otherLanguages, [key]: value}});
  }

  function setFlutterChannel(channel: "stable" | "beta" | "master"): void {
    configStore.patch({
      otherLanguages: {...otherLanguages, flutter: {...otherLanguages.flutter, channel}},
    });
  }

  function toggleFlutter(e: MouseEvent): void {
    e.stopPropagation();
    setBoolean("flutterEnabled", !otherLanguages.flutterEnabled);
  }

  function selectFlutterChannel(e: MouseEvent, ch: "stable" | "beta" | "master"): void {
    e.stopPropagation();
    setFlutterChannel(ch);
  }
</script>

<section
  id="module-other-languages"
  class="mt-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 md:p-6"
  in:fly={{ y: 18, duration: 350 }}
>
  <div class="flex items-start justify-between gap-3">
    <div>
      <p class="text-xs font-medium tracking-wide text-teal-400">模块 5 / 6</p>
      <h2 class="mt-1 text-xl font-semibold text-slate-100 md:text-2xl">其他语言模块</h2>
      <p class="mt-2 text-sm text-slate-400">选择需要安装的编程语言。</p>
    </div>
  </div>

  <div class="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
    <button
      type="button"
      class={`rounded-xl border p-4 text-left transition ${
        otherLanguages.goEnabled
          ? "border-teal-500 bg-teal-500/10"
          : "border-slate-700 bg-slate-950/30 hover:border-teal-500/50"
      }`}
      onclick={() => setBoolean("goEnabled", !otherLanguages.goEnabled)}
    >
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-medium text-slate-100">Go</h3>
        <span class={`h-4 w-4 rounded-full border ${otherLanguages.goEnabled ? "bg-teal-500 border-teal-500" : "border-slate-600"}`}></span>
      </div>
      <p class="mt-2 text-xs text-slate-400">后端服务与 CLI 工具</p>
    </button>

    <button
      type="button"
      class={`rounded-xl border p-4 text-left transition ${
        otherLanguages.rustEnabled
          ? "border-teal-500 bg-teal-500/10"
          : "border-slate-700 bg-slate-950/30 hover:border-teal-500/50"
      }`}
      onclick={() => setBoolean("rustEnabled", !otherLanguages.rustEnabled)}
    >
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-medium text-slate-100">Rust</h3>
        <span class={`h-4 w-4 rounded-full border ${otherLanguages.rustEnabled ? "bg-teal-500 border-teal-500" : "border-slate-600"}`}></span>
      </div>
      <p class="mt-2 text-xs text-slate-400">系统编程与后端</p>
    </button>

    <button
      type="button"
      class={`rounded-xl border p-4 text-left transition ${
        otherLanguages.flutterEnabled
          ? "border-teal-500 bg-teal-500/10"
          : "border-slate-700 bg-slate-950/30 hover:border-teal-500/50"
      }`}
      onclick={toggleFlutter}
    >
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-medium text-slate-100">Flutter</h3>
        <span class={`h-4 w-4 rounded-full border ${otherLanguages.flutterEnabled ? "bg-teal-500 border-teal-500" : "border-slate-600"}`}></span>
      </div>
      <p class="mt-2 text-xs text-slate-400">跨平台 UI 开发</p>
      {#if otherLanguages.flutterEnabled}
        <div class="mt-3 flex gap-1">
          {#each flutterChannels as ch}
            <div
              role="button"
              class={`cursor-pointer rounded px-2 py-0.5 text-xs ${
                otherLanguages.flutter.channel === ch
                  ? "bg-teal-500 text-slate-900"
                  : "bg-slate-800 text-slate-300"
              }`}
              onclick={() => setFlutterChannel(ch)}
            >
              {ch}
            </div>
          {/each}
        </div>
      {/if}
    </button>

    <button
      type="button"
      class={`rounded-xl border p-4 text-left transition ${
        otherLanguages.dartEnabled
          ? "border-teal-500 bg-teal-500/10"
          : "border-slate-700 bg-slate-950/30 hover:border-teal-500/50"
      }`}
      onclick={() => setBoolean("dartEnabled", !otherLanguages.dartEnabled)}
    >
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-medium text-slate-100">Dart</h3>
        <span class={`h-4 w-4 rounded-full border ${otherLanguages.dartEnabled ? "bg-teal-500 border-teal-500" : "border-slate-600"}`}></span>
      </div>
      <p class="mt-2 text-xs text-slate-400">独立 Dart SDK</p>
    </button>
  </div>
</section>