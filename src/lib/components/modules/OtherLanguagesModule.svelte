<script lang="ts">
  import { configStore } from "$stores/config.svelte";
  import ModuleContainer from "./ModuleContainer.svelte";
  import type { LanguageInstallMethod, OtherLanguagesConfig } from "$types/config";

  const otherLanguages = $derived(configStore.value.otherLanguages);
  const selectedManagers = $derived(configStore.value.packageManagers.packageManagers);
  const hasHomebrew = $derived(selectedManagers.includes("homebrew"));
  const hasPorts = $derived(selectedManagers.includes("macports"));

  type SupportLang = "go" | "rust" | "dart";

  function setLanguageEnabled(lang: SupportLang, enabled: boolean): void {
    configStore.patch({ otherLanguages: { [lang]: { enabled } } });
  }

  function setInstallMethod(lang: SupportLang, method: LanguageInstallMethod): void {
    configStore.patch({ otherLanguages: { [lang]: { installMethod: method } } });
  }
</script>

<ModuleContainer
  id="module-other-languages"
  title="其他语言模块"
  description="选择需要安装的编程语言及其安装方式。"
>
  <div class="grid grid-cols-1 gap-3">
    {#each ["go", "rust", "dart"] as lang (lang)}
      {@const config = otherLanguages[lang as SupportLang]}
      <label
        class="flex cursor-pointer items-center justify-between rounded-lg border border-slate-700 bg-slate-950/30 px-3 py-2 transition hover:border-teal-500/50 has-[:checked]:border-teal-500/50"
      >
        <div class="flex items-center gap-2">
          <input
            type="checkbox"
            class="h-4 w-4 accent-teal-500"
            checked={config.enabled}
            onchange={(e) => setLanguageEnabled(lang as SupportLang, e.currentTarget.checked)}
          />
          <span class="text-sm capitalize text-slate-200">{lang}</span>
        </div>
        {#if config.enabled}
          <select
            class="rounded bg-slate-800 px-2 py-1 text-xs text-slate-200"
            value={config.installMethod}
            onchange={(e) =>
              setInstallMethod(lang as SupportLang, e.currentTarget.value as LanguageInstallMethod)}
          >
            {#if hasHomebrew}<option value="brew">Homebrew</option>{/if}
            {#if hasPorts}<option value="ports">MacPorts</option>{/if}
            <option value="mise">mise</option>
          </select>
        {/if}
      </label>
    {/each}
  </div>
</ModuleContainer>
