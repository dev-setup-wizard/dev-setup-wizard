<script lang="ts">
  import { onMount } from "svelte";
  import NodeJsModule from "$components/modules/NodeJsModule.svelte";
  import PackageManagersModule from "$components/modules/PackageManagersModule.svelte";
  import { completionPercentStore, configStore } from "$stores/configStore";

  const title = "开发者环境一键配置器";
  const completionPercent = $derived($completionPercentStore);

  onMount(() => {
    configStore.setCurrentModule("package-managers");
  });
</script>

<main class="mx-auto min-h-screen w-full max-w-6xl px-4 py-8 md:px-6">
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

  <PackageManagersModule />
  <NodeJsModule />
</main>
