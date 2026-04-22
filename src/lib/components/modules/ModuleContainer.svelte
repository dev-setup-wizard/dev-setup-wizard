<script lang="ts">
  import { fly } from "svelte/transition";
  import type { Snippet } from "svelte";

  interface Props {
    id: string;
    title: string;
    description: string;
    children: Snippet;
    headerAction?: Snippet;
    className?: string;
  }

  let { id, title, description, children, headerAction, className = "" }: Props = $props();
</script>

<section
  {id}
  class="mt-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 md:p-6 {className}"
  in:fly={{ y: 18, duration: 350 }}
>
  <div class="flex items-start justify-between gap-3">
    <div>
      <h2 class="mt-1 text-xl font-semibold text-slate-100 md:text-2xl">{title}</h2>
      <p class="mt-2 text-sm text-slate-400">{description}</p>
    </div>
    {#if headerAction}
      {@render headerAction()}
    {/if}
  </div>

  <div class="mt-5">
    {@render children()}
  </div>
</section>
