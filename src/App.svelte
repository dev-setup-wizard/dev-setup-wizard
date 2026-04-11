<script lang="ts">
  import { onMount } from "svelte";
  import ScriptPreviewPanel from "$components/ScriptPreviewPanel.svelte";
  import Timeline from "$components/Timeline.svelte";
  import DeveloperToolsModule from "$components/modules/DeveloperToolsModule.svelte";
  import JavaModule from "$components/modules/JavaModule.svelte";
  import NodeJsModule from "$components/modules/NodeJsModule.svelte";
  import OtherLanguagesModule from "$components/modules/OtherLanguagesModule.svelte";
  import PackageManagersModule from "$components/modules/PackageManagersModule.svelte";
  import PythonModule from "$components/modules/PythonModule.svelte";
  import { configStore } from "$stores/configStore";
  import { generateShellScript } from "$utils/generateShellScript";

  const title = "开发者环境一键配置器";
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

<div class="flex">
  <Timeline />
  <main class="mx-auto min-h-screen w-full max-w-[1400px] flex-1 px-4 py-8 md:px-6 pl-16 lg:pl-48">
    <header class="sticky top-4 z-20 mb-6 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 backdrop-blur">
      <div class="flex items-center justify-between gap-4">
        <div>
          <p class="text-xs font-medium tracking-wide text-teal-400">dev-setup-wizard</p>
          <h1 class="text-lg font-semibold text-slate-100 md:text-xl">{title}</h1>
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
</div>
