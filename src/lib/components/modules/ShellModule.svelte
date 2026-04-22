<script lang="ts">
  import { configStore } from "$stores/config.svelte";
  import ModuleContainer from "./ModuleContainer.svelte";

  const shellConfig = $derived(configStore.value.developerTools.shellCustomization);

  function setShell(value: "ohMyZsh" | "ohMyPosh" | "none"): void {
    configStore.patch({
      developerTools: {
        shellCustomization: {
          ohMyZsh: value === "ohMyZsh",
          ohMyPosh: value === "ohMyPosh",
        },
      } as any,
    });
  }
</script>

<ModuleContainer id="module-shell" title="Shell 美化" description="选择终端美化方案（二选一）。">
  <div class="grid gap-3">
    {#each [{ key: "ohMyZsh", title: "Oh My Zsh", desc: "终端美化框架" }, { key: "ohMyPosh", title: "Oh My Posh", desc: "终端提示符美化" }, { key: "none", title: "不安装", desc: "跳过 shell 美化" }] as opt (opt.key)}
      {@const isActive =
        opt.key === "none" ? !shellConfig.ohMyZsh && !shellConfig.ohMyPosh : (shellConfig as any)[opt.key]}
      <button
        type="button"
        class="flex w-full items-center justify-between rounded-lg border p-4 text-left transition {isActive
          ? 'border-teal-500 bg-teal-500/10'
          : 'border-slate-700 bg-slate-950/30 hover:border-teal-500/50'}"
        onclick={() => setShell(opt.key as any)}
      >
        <div>
          <h3 class="text-sm font-medium text-slate-100">{opt.title}</h3>
          <p class="mt-1 text-xs text-slate-400">{opt.desc}</p>
        </div>
        <span
          class="h-4 w-4 rounded-full border-2 {isActive
            ? 'border-teal-500 bg-teal-500'
            : 'border-slate-600'}"
        ></span>
      </button>
    {/each}
  </div>
</ModuleContainer>
