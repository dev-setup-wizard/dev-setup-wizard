<script lang="ts">
  import { onMount } from "svelte";
  import Timeline from "$components/Timeline.svelte";
  import ScriptPreviewPanel from "$components/ScriptPreviewPanel.svelte";
  import DeveloperToolsModule from "$components/modules/DeveloperToolsModule.svelte";
  import JavaModule from "$components/modules/JavaModule.svelte";
  import NodeJsModule from "$components/modules/NodeJsModule.svelte";
  import OtherLanguagesModule from "$components/modules/OtherLanguagesModule.svelte";
  import PackageManagersModule from "$components/modules/PackageManagersModule.svelte";
  import PythonModule from "$components/modules/PythonModule.svelte";
  import { configStore } from "$stores/configStore";
  import { generateShellScript } from "$utils/generateShellScript";
  import { type ModuleKey, MODULE_ORDER } from "$types/config";

  const title = "开发者环境一键配置器";
  let currentModule = $state<ModuleKey>("package-managers");
  let scriptOutput = $state("");
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  $effect(() => {
    const cfg = $configStore;
    if (cfg) {
      scriptOutput = generateShellScript(cfg);
    }
  });

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace('module-', '') as ModuleKey;
            if (MODULE_ORDER.includes(id)) {
              currentModule = id;
              configStore.setCurrentModule(id);
            }
            break;
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );
    
    MODULE_ORDER.forEach(key => {
      const el = document.getElementById(`module-${key}`);
      if (el) observer.observe(el);
    });
    
    return () => observer.disconnect();
  });

  $effect(() => {
    const cfg = $configStore;
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      scriptOutput = generateShellScript(cfg);
    }, 300);
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  });

  function handleNavigate(module: ModuleKey) {
    const element = document.getElementById(`module-${module}`);
    if (element) {
      const header = document.querySelector('header');
      const headerHeight = header ? header.offsetHeight + 20 : 100;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - headerHeight,
        behavior: "smooth"
      });
    }
  }
</script>

<main class="mx-auto min-h-screen w-full max-w-[1400px] px-4 py-4">
  <header class="sticky top-4 z-20 mb-4 rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-4 backdrop-blur">
    <div class="flex items-center justify-between gap-4">
      <div>
        <p class="text-xs font-medium tracking-wide text-teal-400">dev-setup-wizard</p>
        <h1 class="text-lg font-semibold text-slate-100 md:text-xl">{title}</h1>
      </div>
      <div class="mt-4 flex justify-center">
      <Timeline {currentModule} onNavigate={handleNavigate} />
    </div>
    </div>
    
  </header>

  <div class="grid gap-6 lg:grid-cols-[1fr_420px]">
    <div>
      <PackageManagersModule />
      <NodeJsModule />
      <PythonModule />
      <JavaModule />
      <OtherLanguagesModule />
      <DeveloperToolsModule />
    </div>
    <div class="lg:sticky lg:top-[128px] lg:self-start h-[calc(100vh-145px)] overflow-y-auto flex flex-col">    
     <ScriptPreviewPanel script={scriptOutput} />
    </div>
  </div>
</main>