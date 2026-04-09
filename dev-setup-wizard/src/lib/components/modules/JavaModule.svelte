<script lang="ts">
  import { fly } from "svelte/transition";
  import { configStore } from "$stores/configStore";
  import type { JdkDistribution, JdkVersion } from "$types/config";

  const javaConfig = $derived($configStore.java);

  const distributionOptions: Array<{ key: JdkDistribution; label: string; tooltip: string }> = [
    { key: "openjdk", label: "OpenJDK", tooltip: "开源标准实现，兼容性好。" },
    { key: "oracle", label: "Oracle JDK", tooltip: "Oracle 官方发行版，企业场景常见。" },
    { key: "temurin", label: "Temurin JDK", tooltip: "Adoptium 发行版，社区推荐度高。" },
  ];

  const versionOptions: Array<{ key: JdkVersion; label: string; tooltip: string }> = [
    { key: "25-lts", label: "LTS 25", tooltip: "最新长期支持版本。" },
    { key: "21-lts", label: "LTS 21", tooltip: "当前主流长期支持版本。" },
    { key: "17-lts", label: "LTS 17", tooltip: "兼容大量现有生产项目。" },
    { key: "11-lts", label: "LTS 11", tooltip: "老项目常见基线版本。" },
    { key: "newest", label: "Newest", tooltip: "安装最新可用版本（非 LTS 优先）。" },
  ];

  function setDistribution(next: JdkDistribution): void {
    configStore.patch({
      java: {
        ...javaConfig,
        jdkDistribution: next,
      },
    });
  }

  function toggleVersion(version: JdkVersion, checked: boolean): void {
    const current = javaConfig.jdkVersions;
    const next = checked
      ? Array.from(new Set([...current, version]))
      : current.filter((item) => item !== version);

    configStore.patch({
      java: {
        ...javaConfig,
        jdkVersions: next,
      },
    });
  }

  function setTool(key: "installMaven" | "installGradle" | "installSdkman", value: boolean): void {
    configStore.patch({
      java: {
        ...javaConfig,
        [key]: value,
      },
    });
  }
</script>

<section
  id="module-java"
  class="mt-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 md:p-6"
  in:fly={{ y: 18, duration: 350 }}
>
  <div class="flex items-start justify-between gap-3">
    <div>
      <p class="text-xs font-medium tracking-wide text-teal-400">模块 4 / 6</p>
      <h2 class="mt-1 text-xl font-semibold text-slate-100 md:text-2xl">Java 模块</h2>
      <p class="mt-2 text-sm text-slate-400">选择 JDK 发行版、目标版本，以及 Java 生态工具。</p>
    </div>
  </div>

  <div class="mt-5">
    <h3 class="text-sm font-medium text-slate-200">JDK 类型</h3>
    <div class="mt-3 grid gap-2 md:grid-cols-3">
      {#each distributionOptions as option (option.key)}
        <label
          class="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm text-slate-200 transition hover:border-teal-500/50"
          title={option.tooltip}
        >
          <input
            type="radio"
            name="jdk-distribution"
            class="h-4 w-4 accent-teal-500"
            checked={javaConfig.jdkDistribution === option.key}
            onchange={() => setDistribution(option.key)}
          />
          <span>{option.label}</span>
        </label>
      {/each}
    </div>
  </div>

  <div class="mt-5">
    <h3 class="text-sm font-medium text-slate-200">版本（可多选）</h3>
    <div class="mt-3 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
      {#each versionOptions as option (option.key)}
        <label
          class="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm text-slate-200 transition hover:border-teal-500/50"
          title={option.tooltip}
        >
          <input
            type="checkbox"
            class="h-4 w-4 accent-teal-500"
            checked={javaConfig.jdkVersions.includes(option.key)}
            onchange={(event) => toggleVersion(option.key, event.currentTarget.checked)}
          />
          <span>{option.label}</span>
        </label>
      {/each}
    </div>
  </div>

  <div class="mt-5 grid gap-3 md:grid-cols-3">
    <label
      class="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-950/30 px-3 py-2"
      title="Java 项目构建与依赖管理工具。"
    >
      <span class="text-sm text-slate-200">安装 Maven</span>
      <input
        type="checkbox"
        class="h-4 w-4 accent-teal-500"
        checked={javaConfig.installMaven}
        onchange={(event) => setTool("installMaven", event.currentTarget.checked)}
      />
    </label>
    <label
      class="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-950/30 px-3 py-2"
      title="灵活的构建系统，Android 与后端项目常用。"
    >
      <span class="text-sm text-slate-200">安装 Gradle</span>
      <input
        type="checkbox"
        class="h-4 w-4 accent-teal-500"
        checked={javaConfig.installGradle}
        onchange={(event) => setTool("installGradle", event.currentTarget.checked)}
      />
    </label>
    <label
      class="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-950/30 px-3 py-2"
      title="Java 生态版本管理器，适合多 JDK 切换。"
    >
      <span class="text-sm text-slate-200">安装 sdkman!</span>
      <input
        type="checkbox"
        class="h-4 w-4 accent-teal-500"
        checked={javaConfig.installSdkman}
        onchange={(event) => setTool("installSdkman", event.currentTarget.checked)}
      />
    </label>
  </div>
</section>
