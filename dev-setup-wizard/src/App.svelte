<script lang="ts">
  import { onMount } from "svelte";
  import ScriptPreviewPanel from "$components/ScriptPreviewPanel.svelte";
  import DeveloperToolsModule from "$components/modules/DeveloperToolsModule.svelte";
  import JavaModule from "$components/modules/JavaModule.svelte";
  import NodeJsModule from "$components/modules/NodeJsModule.svelte";
  import OtherLanguagesModule from "$components/modules/OtherLanguagesModule.svelte";
  import PackageManagersModule from "$components/modules/PackageManagersModule.svelte";
  import PythonModule from "$components/modules/PythonModule.svelte";
  import { completionPercentStore, configStore } from "$stores/configStore";
  import { generateShellScript } from "$utils/generateShellScript";

  const title = "开发者环境一键配置器";
  const completionPercent = $derived($completionPercentStore);
  let scriptOutput = $state(generateShellScript($configStore));
  let isGenerating = $state(false);
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  onMount(() => {
    configStore.setCurrentModule("package-managers");
  });

  $effect(() => {
    const cfg = $configStore;
    isGenerating = true;
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      scriptOutput = generateShellScript(cfg);
      isGenerating = false;
    }, 300);

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  });
</script>

<main class="mx-auto min-h-screen w-full max-w-[1400px] px-4 py-8 md:px-6">
  <header class="sticky top-4 z-20 mb-6 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 backdrop-blur">
    <div class="flex items-center justify-between gap-4">
      <div>
        <p class="text-xs font-medium tracking-wide text-teal-400">dev-setup-wizard</p>
        <h1 class="text-lg font-semibold text-slate-100 md:text-xl">{title}</h1>
      </div>
      <button
        type="button"
        class="rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-teal-400"
      >
        生成脚本
      </button>
    </div>
    <div class="mt-3">
      <div class="mb-1 flex items-center justify-between text-xs text-slate-400">
        <span>当前进度</span>
        <span>{completionPercent}%</span>
      </div>
      <div class="h-2 rounded-full bg-slate-800">
        <div
          class="h-2 rounded-full bg-teal-500 transition-all duration-300"
          style={`width: ${completionPercent}%`}
        ></div>
      </div>
    </div>
  </header>

  <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
    <div>
      <PackageManagersModule />
      <NodeJsModule />
      <PythonModule />
      <JavaModule />
      <OtherLanguagesModule />
      <DeveloperToolsModule />
    </div>
    <div class="lg:sticky lg:top-28 lg:self-start">
      <ScriptPreviewPanel script={scriptOutput} {isGenerating} />
    </div>
  </div>
</main>
