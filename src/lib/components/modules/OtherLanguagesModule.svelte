<script lang="ts">
  import { fly } from "svelte/transition";
  import { configStore } from "$stores/configStore";
  import type { LanguageInstallMethod } from "$types/config";

  const otherLanguages = $derived({
    go: $configStore.otherLanguages?.go ?? { enabled: false, installMethod: "brew" },
    rust: $configStore.otherLanguages?.rust ?? { enabled: false, installMethod: "brew" },
    dart: $configStore.otherLanguages?.dart ?? { enabled: false, installMethod: "brew" },
    otherEnabled: $configStore.otherLanguages?.otherEnabled ?? false,
    otherName: $configStore.otherLanguages?.otherName ?? "",
  });

  const selectedManagers = $derived($configStore.packageManagers.packageManagers ?? ["none"]);
  const hasHomebrew = $derived(selectedManagers.includes("homebrew"));
  const hasPorts = $derived(selectedManagers.includes("macports"));

  function setLanguageEnabled(lang: "go" | "rust" | "dart", enabled: boolean): void {
    configStore.patch({
      otherLanguages: {
        ...otherLanguages,
        [lang]: {
          ...otherLanguages[lang],
          enabled,
        },
      },
    });
  }

  function setInstallMethod(lang: "go" | "rust" | "dart", method: LanguageInstallMethod): void {
    configStore.patch({
      otherLanguages: {
        ...otherLanguages,
        [lang]: {
          ...otherLanguages[lang],
          installMethod: method,
        },
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
      
      <h2 class="mt-1 text-xl font-semibold text-slate-100 md:text-2xl">其他语言模块</h2>
      <p class="mt-2 text-sm text-slate-400">选择需要安装的编程语言及其安装方式。</p>
    </div>
  </div>

  <div class="mt-5 grid grid-cols-1 gap-3">
    <label
      class="flex cursor-pointer items-center justify-between rounded-lg border border-slate-700 bg-slate-950/30 px-3 py-2 transition hover:border-teal-500/50 has-[:checked]:border-teal-500/50"
    >
      <div class="flex items-center gap-2">
        <input
          type="checkbox"
          class="h-4 w-4 accent-teal-500"
          checked={otherLanguages.go.enabled}
          onchange={(event) => setLanguageEnabled("go", event.currentTarget.checked)}
        />
        <span class="text-sm text-slate-200">Go</span>
      </div>
      {#if otherLanguages.go.enabled}
        <select
          class="rounded bg-slate-800 px-2 py-1 text-xs text-slate-200"
          value={otherLanguages.go.installMethod}
          onchange={(e) => setInstallMethod("go", e.currentTarget.value as LanguageInstallMethod)}
        >
          {#if hasHomebrew}<option value="brew">Homebrew</option>{/if}
          {#if hasPorts}<option value="ports">MacPorts</option>{/if}
          <option value="mise">mise</option>
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
          checked={otherLanguages.rust.enabled}
          onchange={(event) => setLanguageEnabled("rust", event.currentTarget.checked)}
        />
        <span class="text-sm text-slate-200">Rust</span>
      </div>
      {#if otherLanguages.rust.enabled}
        <select
          class="rounded bg-slate-800 px-2 py-1 text-xs text-slate-200"
          value={otherLanguages.rust.installMethod}
          onchange={(e) => setInstallMethod("rust", e.currentTarget.value as LanguageInstallMethod)}
        >
          {#if hasHomebrew}<option value="brew">Homebrew</option>{/if}
          {#if hasPorts}<option value="ports">MacPorts</option>{/if}
          <option value="mise">mise</option>
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
          checked={otherLanguages.dart.enabled}
          onchange={(event) => setLanguageEnabled("dart", event.currentTarget.checked)}
        />
        <span class="text-sm text-slate-200">Dart</span>
      </div>
      {#if otherLanguages.dart.enabled}
        <select
          class="rounded bg-slate-800 px-2 py-1 text-xs text-slate-200"
          value={otherLanguages.dart.installMethod}
          onchange={(e) => setInstallMethod("dart", e.currentTarget.value as LanguageInstallMethod)}
        >
          {#if hasHomebrew}<option value="brew">Homebrew</option>{/if}
          {#if hasPorts}<option value="ports">MacPorts</option>{/if}
          <option value="mise">mise</option>
        </select>
      {/if}
    </label>
  </div>
</section>
