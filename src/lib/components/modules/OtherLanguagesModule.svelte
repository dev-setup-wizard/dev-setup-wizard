<script lang="ts">
  import { fly } from "svelte/transition";
  import { configStore } from "$stores/configStore";

  const flutterChannels = ["stable", "beta", "master"] as const;

  const otherLanguages = $derived($configStore.otherLanguages);

  function setBoolean(
    key: "goEnabled" | "rustEnabled" | "flutterEnabled" | "dartEnabled" | "otherEnabled",
    value: boolean,
  ): void {
    configStore.patch({
      otherLanguages: {
        ...otherLanguages,
        [key]: value,
      },
    });
  }

  function setFlutterChannel(channel: "stable" | "beta" | "master"): void {
    configStore.patch({
      otherLanguages: {
        ...otherLanguages,
        flutter: {
          ...otherLanguages.flutter,
          channel,
        },
      },
    });
  }

  function setOtherName(name: string): void {
    configStore.patch({
      otherLanguages: {
        ...otherLanguages,
        otherName: name,
      },
    });
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
      <p class="mt-2 text-sm text-slate-400">按需启用 Go、Rust、Flutter、Dart 或自定义语言。</p>
    </div>
  </div>

  <div class="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
    <article class="rounded-xl border border-slate-700 bg-slate-950/30 p-4">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-medium text-slate-100">Go</h3>
        <input
          type="checkbox"
          role="switch"
          class="h-4 w-4 accent-teal-500"
          checked={otherLanguages.goEnabled}
          onchange={(event) => setBoolean("goEnabled", event.currentTarget.checked)}
        />
      </div>
      <p class="mt-2 text-xs text-slate-400">适合后端服务与 CLI 工具开发。</p>
    </article>

    <article class="rounded-xl border border-slate-700 bg-slate-950/30 p-4">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-medium text-slate-100">Rust</h3>
        <input
          type="checkbox"
          role="switch"
          class="h-4 w-4 accent-teal-500"
          checked={otherLanguages.rustEnabled}
          onchange={(event) => setBoolean("rustEnabled", event.currentTarget.checked)}
        />
      </div>
      <p class="mt-2 text-xs text-slate-400">高性能系统编程与现代后端场景。</p>
    </article>

    <article class="rounded-xl border border-slate-700 bg-slate-950/30 p-4">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-medium text-slate-100">Flutter（含 Dart）</h3>
        <input
          type="checkbox"
          role="switch"
          class="h-4 w-4 accent-teal-500"
          checked={otherLanguages.flutterEnabled}
          onchange={(event) => setBoolean("flutterEnabled", event.currentTarget.checked)}
        />
      </div>
      <p class="mt-2 text-xs text-slate-400">跨平台移动/桌面 UI 开发。</p>
      {#if otherLanguages.flutterEnabled}
        <div class="mt-3">
          <p class="mb-2 text-xs text-slate-300">Flutter 渠道</p>
          <div class="flex flex-wrap gap-2">
            {#each flutterChannels as channel (channel)}
              <label
                class={`cursor-pointer rounded-md border px-2.5 py-1 text-xs transition ${
                  otherLanguages.flutter.channel === channel
                    ? "border-teal-500 bg-teal-500/10 text-teal-300"
                    : "border-slate-700 text-slate-300 hover:border-teal-500/50"
                }`}
              >
                <input
                  type="radio"
                  name="flutter-channel"
                  class="sr-only"
                  checked={otherLanguages.flutter.channel === channel}
                  onchange={() => setFlutterChannel(channel)}
                />
                {channel}
              </label>
            {/each}
          </div>
        </div>
      {/if}
    </article>

    <article class="rounded-xl border border-slate-700 bg-slate-950/30 p-4">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-medium text-slate-100">Dart（独立）</h3>
        <input
          type="checkbox"
          role="switch"
          class="h-4 w-4 accent-teal-500"
          checked={otherLanguages.dartEnabled}
          onchange={(event) => setBoolean("dartEnabled", event.currentTarget.checked)}
        />
      </div>
      <p class="mt-2 text-xs text-slate-400">仅需要 Dart SDK 时可单独开启。</p>
    </article>

    <article class="rounded-xl border border-slate-700 bg-slate-950/30 p-4 md:col-span-2 xl:col-span-1">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-medium text-slate-100">其他（自定义）</h3>
        <input
          type="checkbox"
          role="switch"
          class="h-4 w-4 accent-teal-500"
          checked={otherLanguages.otherEnabled}
          onchange={(event) => setBoolean("otherEnabled", event.currentTarget.checked)}
        />
      </div>
      <p class="mt-2 text-xs text-slate-400">例如 Elixir、Haskell、Lua 等。</p>
      <input
        type="text"
        class="mt-3 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 outline-none transition focus:border-teal-500"
        placeholder="输入自定义语言名称"
        disabled={!otherLanguages.otherEnabled}
        value={otherLanguages.otherName}
        oninput={(event) => setOtherName(event.currentTarget.value)}
      />
    </article>
  </div>
</section>
