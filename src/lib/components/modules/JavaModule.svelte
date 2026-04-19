<script lang="ts">
  import { fly } from "svelte/transition";
  import { configStore } from "$stores/configStore";
  import type { JdkInstallMethod, JdkVersion, JdkDistribution } from "$types/config";

  type InstallMethodOption = {
    key: JdkInstallMethod;
    label: string;
  };

  const installMethodOptions: InstallMethodOption[] = [
    { key: "sdkman", label: "SDKMAN! (推荐)" },
    { key: "mise", label: "mise" },
    { key: "asdf", label: "asdf" },
    { key: "brew", label: "Homebrew" },
    { key: "ports", label: "MacPorts" },
    { key: "none", label: "不安装 Java" },
  ];

  const versionOptions: { key: JdkVersion; label: string }[] = [
    { key: "25", label: "JDK 25" },
    { key: "24", label: "JDK 24" },
    { key: "21", label: "JDK 21 (LTS)" },
    { key: "17", label: "JDK 17 (LTS)" },
    { key: "11", label: "JDK 11 (LTS)" },
  ];

  const distributionOptions: { key: JdkDistribution; label: string }[] = [
    { key: "temurin", label: "Temurin" },
    { key: "openjdk", label: "OpenJDK" },
    { key: "oracle", label: "Oracle" },
  ];

  const selectedManagers = $derived($configStore.packageManagers.packageManagers);
  const javaConfig = $derived($configStore.java);

  const hasHomebrew = $derived(selectedManagers.includes("homebrew"));
  const hasPorts = $derived(selectedManagers.includes("macports"));

  const canSelectOptions = $derived(javaConfig.jdkInstallMethod !== "none");

  const filteredInstallMethods = $derived(
    installMethodOptions.map((opt) => {
      if (opt.key === "brew" && !hasHomebrew) return null;
      if (opt.key === "ports" && !hasPorts) return null;
      return opt;
    }).filter(Boolean) as InstallMethodOption[],
  );

  function setInstallMethod(next: JdkInstallMethod): void {
    configStore.patch({
      java: {...javaConfig, jdkInstallMethod: next},
    });
  }

  function toggleVersion(version: JdkVersion, checked: boolean): void {
    const current = javaConfig.jdkVersions;
    const next = checked
      ? Array.from(new Set([...current, version]))
      : current.filter((item) => item !== version);
    configStore.patch({java: {...javaConfig, jdkVersions: next}});
  }

  function setDistribution(next: JdkDistribution): void {
    configStore.patch({
      java: {
        ...javaConfig,
        jdkDistribution: next,
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
      <p class="mt-2 text-sm text-slate-400">选择 JDK 安装方式、版本和发行版。</p>
    </div>
  </div>

  <div class="mt-5">
    <h3 class="text-sm font-medium text-slate-200">Java 安装方式</h3>
    <div class="mt-2">
      <select
        class="w-full rounded-lg border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm text-slate-200"
        value={javaConfig.jdkInstallMethod}
        onchange={(e) => setInstallMethod(e.currentTarget.value as JdkInstallMethod)}
      >
        {#each filteredInstallMethods as option (option.key)}
          <option value={option.key}>{option.label}</option>
        {/each}
      </select>
    </div>
  </div>

  <div class="mt-5" class:opacity-50={!canSelectOptions} class:pointer-events-none={!canSelectOptions}>
    <h3 class="text-sm font-medium text-slate-200">JDK 版本</h3>
    <div class="mt-2 flex flex-wrap gap-2">
      {#each versionOptions as option (option.key)}
        <label class="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm text-slate-200">
          <input
            type="checkbox"
            class="h-4 w-4 accent-teal-500"
            checked={javaConfig.jdkVersions.includes(option.key)}
            disabled={!canSelectOptions}
            onchange={(event) => toggleVersion(option.key, event.currentTarget.checked)}
          />
          {option.label}
        </label>
      {/each}
    </div>
  </div>

  <div class="mt-5" class:opacity-50={!canSelectOptions} class:pointer-events-none={!canSelectOptions}>
    <h3 class="text-sm font-medium text-slate-200">JDK 发行版</h3>
    <div class="mt-2 flex flex-wrap gap-2">
      {#each distributionOptions as option (option.key)}
        <label class="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm text-slate-200">
          <input
            type="radio"
            name="jdk-distribution"
            class="h-4 w-4 accent-teal-500"
            checked={javaConfig.jdkDistribution === option.key}
            disabled={!canSelectOptions}
            onchange={() => setDistribution(option.key)}
          />
          {option.label}
        </label>
      {/each}
    </div>
  </div>
</section>