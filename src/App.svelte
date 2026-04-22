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
  import { configStore } from "$stores/config.svelte";
  import { generateShellScript } from "$utils/generateShellScript";
  import { type ModuleKey, MODULE_ORDER } from "$types/config";

  const title = "开发者环境一键配置器";
  let currentModule = $state<ModuleKey>("package-managers");
  let scriptOutput = $state("");
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  // Reactive script generation with debouncing
  $effect(() => {
    const cfg = configStore.value;
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      scriptOutput = generateShellScript(cfg);
    }, 150); // Reduced debounce for better responsiveness
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  });

  onMount(() => {
    // Sync current module with scroll position
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace("module-", "") as ModuleKey;
            if (MODULE_ORDER.includes(id)) {
              currentModule = id;
              configStore.setCurrentModule(id);
            }
            break;
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px" },
    );

    MODULE_ORDER.forEach((key) => {
      const el = document.getElementById(`module-${key}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  });

  function handleNavigate(module: ModuleKey) {
    const element = document.getElementById(`module-${module}`);
    if (element) {
      const header = document.querySelector("header");
      const headerHeight = header ? header.offsetHeight + 20 : 100;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - headerHeight,
        behavior: "smooth",
      });
    }
  }
</script>

<main class="mx-auto min-h-screen w-full max-w-[1400px] px-4 py-4">
  <header
    class="sticky top-4 z-20 mb-4 rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-4 backdrop-blur"
  >
    <div class="flex items-center justify-between gap-4">
      <div class="flex flex-col">
        <p class="text-xs font-medium tracking-wide text-teal-400">dev-setup-wizard</p>
        <div class="flex items-center gap-3">
          <h1 class="text-lg font-semibold text-slate-100 md:text-xl">{title}</h1>
          <a
            href="https://github.com/dev-setup-wizard/dev-setup-wizard"
            target="_blank"
            rel="noopener noreferrer"
            class="text-slate-400 transition-colors hover:text-teal-400"
            title="View on GitHub"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-github"
            >
              <path
                d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
              />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
          </a>
        </div>
      </div>

      <div class="flex items-center gap-6">
        <div class="hidden md:block">
          <Timeline {currentModule} onNavigate={handleNavigate} />
        </div>
      </div>
    </div>
    <div class="mt-4 flex justify-center md:hidden">
      <Timeline {currentModule} onNavigate={handleNavigate} />
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
    <div
      class="flex h-[calc(100vh-145px)] flex-col overflow-y-auto lg:sticky lg:top-[128px] lg:self-start"
    >
      <ScriptPreviewPanel script={scriptOutput} />
    </div>
  </div>
</main>
