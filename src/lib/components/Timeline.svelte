<script lang="ts">
  import { configStore } from "$stores/configStore";
  import { MODULE_ORDER, type ModuleKey } from "$types/config";

  const moduleLabels: Record<ModuleKey, string> = {
    "package-managers": "包管理器",
    node: "Node.js",
    python: "Python",
    java: "Java",
    "other-languages": "其他语言",
    "developer-tools": "开发者工具",
  };

  const moduleIds: Record<ModuleKey, string> = {
    "package-managers": "module-package-managers",
    node: "module-node",
    python: "module-python",
    java: "module-java",
    "other-languages": "module-other-languages",
    "developer-tools": "module-developer-tools",
  };

  let currentSection = $state<ModuleKey>("package-managers");

  const completedModules = $derived(
    MODULE_ORDER.filter((module) => {
      const config = $configStore;
      switch (module) {
        case "package-managers":
          return config.packageManagers.packageManagers.length > 0;
        case "node":
          return (
            config.node.nodeVersions.length > 0 ||
            config.node.installYarn ||
            config.node.installPnpm ||
            config.node.installDeno ||
            config.node.installBun
          );
        case "python":
          return (
            config.python.pythonInstallMethod !== "none" ||
            config.python.installPythonLatest ||
            config.python.installPipx ||
            config.python.installPoetry
          );
        case "java":
          return (
            config.java.jdkInstallMethod !== "none" ||
            config.java.jdkVersions.length > 0 ||
            config.java.installMaven ||
            config.java.installGradle
          );
        case "other-languages":
          return (
            config.otherLanguages.goEnabled ||
            config.otherLanguages.rustEnabled ||
            config.otherLanguages.flutterEnabled ||
            config.otherLanguages.dartEnabled
          );
        case "developer-tools":
          return true;
        default:
          return false;
      }
    })
  );

  function getProgress(module: ModuleKey): number {
    const idx = MODULE_ORDER.indexOf(module);
    const completedIdx = completedModules.findIndex((m) => m === module);
    if (completedIdx !== -1) return 100;
    if (idx < completedModules.length) return Math.round((idx / MODULE_ORDER.length) * 100);
    return Math.min(Math.round(((idx + 0.5) / MODULE_ORDER.length) * 100), 99);
  }

  function scrollToSection(module: ModuleKey): void {
    const element = document.getElementById(moduleIds[module]);
    if (element) {
      const offset = 100;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }

  $effect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 2;
      for (const module of MODULE_ORDER) {
        const el = document.getElementById(moduleIds[module]);
        if (el) {
          const rect = el.getBoundingClientRect();
          const top = rect.top + window.scrollY;
          const bottom = top + rect.height;
          if (scrollPos >= top && scrollPos < bottom) {
            currentSection = module;
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  });
</script>

<aside class="fixed left-0 top-0 z-30 h-screen w-16 bg-slate-950/80 backdrop-blur lg:w-48">
  <div class="flex h-full flex-col items-center justify-center gap-1 py-8 lg:items-start lg:px-4">
    {#each MODULE_ORDER as module, index (module)}
      {@const isCompleted = completedModules.includes(module)}
      {@const isActive = currentSection === module}
      <button
        type="button"
        onclick={() => scrollToSection(module)}
        class="group relative flex items-center gap-2 rounded-lg p-2 transition-all lg:w-full"
        title={moduleLabels[module]}
      >
        <div
          class="flex h-6 w-6 items-center justify-center rounded-full border-2 text-xs font-medium transition-all lg:h-8 lg:w-8
            {isCompleted
              ? 'border-teal-500 bg-teal-500 text-slate-950'
              : isActive
                ? 'border-teal-400 bg-slate-800 text-teal-400'
                : 'border-slate-600 bg-slate-900 text-slate-500'}"
        >
          {#if isCompleted}
            <svg class="h-3.5 w-3.5 lg:h-4 lg:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          {:else}
            {index + 1}
          {/if}
        </div>
        <span
          class="absolute left-10 whitespace-nowrap text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100 group-hover:pointer-events-none pointer-events-none lg:static lg:left-auto lg:opacity-100 lg:pointer-events-auto
            {isActive ? 'text-slate-100' : 'text-slate-400'}"
        >
          {moduleLabels[module]}
        </span>
        {#if isActive}
          <div class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 rounded-r bg-teal-400 lg:left-0"></div>
        {/if}
      </button>
    {/each}
  </div>
</aside>