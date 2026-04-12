<script lang="ts">
  import { type ModuleKey, MODULE_ORDER } from "$types/config";

  interface Props {
    currentModule: ModuleKey;
    onNavigate: (module: ModuleKey) => void;
  }

  let { currentModule, onNavigate }: Props = $props();

  const moduleLabels: Record<ModuleKey, string> = {
    "package-managers": "包管理器",
    "node": "Node.js",
    "python": "Python",
    "java": "Java",
    "other-languages": "其他语言",
    "developer-tools": "开发者工具",
  };

  function getModuleIndex(key: ModuleKey): number {
    return MODULE_ORDER.indexOf(key);
  }

  function getCurrentIndex(): number {
    return getModuleIndex(currentModule);
  }
</script>

<div class="flex items-center gap-0">
  {#each MODULE_ORDER as module, i (module)}
    {@const isActive = currentModule === module}
    {@const isPast = getCurrentIndex() > i}
    <button
      type="button"
      class="group flex flex-col items-center"
      onclick={() => onNavigate(module)}
    >
      <div class="relative flex items-center">
        {#if i > 0}
          <div class={`h-0.5 w-8 transition-colors ${isPast ? 'bg-teal-500' : 'bg-slate-700'}`}></div>
        {/if}
        <div 
          class={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all ${
            isActive 
              ? 'border-teal-400 bg-teal-500' 
              : isPast 
                ? 'border-teal-500 bg-teal-500/20' 
                : 'border-slate-600 bg-slate-800'
          }`}
        >
          {#if isPast}
            <svg class="h-3 w-3 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
          {/if}
        </div>
      </div>
      <span class={`mt-1 text-[10px] font-medium whitespace-nowrap transition-colors ${
        isActive ? 'text-teal-400' : 'text-slate-500'
      }`}>
        {moduleLabels[module]}
      </span>
    </button>
  {/each}
</div>