<script lang="ts">
  let {
    script = "",
  }: {
    script: string;
  } = $props();

  let copied = $state(false);

  async function copyScript(): Promise<void> {
    if (!script.trim()) return;
    await navigator.clipboard.writeText(script);
    copied = true;
    setTimeout(() => {
      copied = false;
    }, 1200);
  }

  function downloadScript(): void {
    if (!script.trim()) return;
    const blob = new Blob([script], {
      type: "text/x-shellscript;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "setup.sh";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }
</script>

<aside
  class="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur"
>
  <div class="mb-3 flex items-center justify-between">
    <h3 class="text-sm font-medium text-slate-100">脚本预览</h3>

    <div class="flex items-center gap-2">
      <button
        type="button"
        class="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 transition hover:border-teal-500/60"
        onclick={copyScript}
      >
        {copied ? "已复制" : "复制"}
      </button>
      <button
        type="button"
        class="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 transition hover:border-teal-500/60"
        onclick={downloadScript}
      >
        下载 setup.sh
      </button>
    </div>
  </div>

  <pre
    class="min-h-0 flex-1 overflow-auto rounded-xl border border-slate-700 bg-slate-950/70 p-3 text-xs leading-5 text-slate-300"><code
      >{script}</code
    ></pre>
</aside>
