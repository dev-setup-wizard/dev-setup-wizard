<script lang="ts">
  import { configStore } from "$stores/config.svelte";
  import ModuleContainer from "./ModuleContainer.svelte";
  import type { JdkInstallMethod, JdkVersion, JdkDistribution } from "$types/config";

  const installMethods: { key: JdkInstallMethod; label: string }[] = [
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

  const javaConfig = $derived(configStore.value.java);
  const selectedManagers = $derived(configStore.value.packageManagers.packageManagers);
  const hasHomebrew = $derived(selectedManagers.includes("homebrew"));
  const hasPorts = $derived(selectedManagers.includes("macports"));

  const filteredInstallMethods = $derived(
    installMethods.filter((opt) => {
      if (opt.key === "brew" && !hasHomebrew) return false;
      if (opt.key === "ports" && !hasPorts) return false;
      return true;
    }),
  );

  function setMethod(next: JdkInstallMethod): void {
    configStore.patch({ java: { jdkInstallMethod: next } });
  }

  function toggleVersion(version: JdkVersion, checked: boolean): void {
    const current = javaConfig.jdkVersions;
    const next = checked ? [...new Set([...current, version])] : current.filter((v) => v !== version);
    configStore.patch({ java: { jdkVersions: next } });
  }

  function setDistribution(dist: JdkDistribution): void {
    configStore.patch({ java: { jdkDistribution: dist } });
  }
</script>

<ModuleContainer
  id="module-java"
  title="Java 模块"
  description="选择 JDK 安装方式、版本和发行版。"
>
  <div class="space-y-6">
    <!-- Install Method -->
    <div>
      <h3 class="text-sm font-medium text-slate-200">Java 安装方式</h3>
      <select
        class="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm text-slate-200"
        value={javaConfig.jdkInstallMethod}
        onchange={(e) => setMethod(e.currentTarget.value as JdkInstallMethod)}
      >
        {#each filteredInstallMethods as opt (opt.key)}
          <option value={opt.key}>{opt.label}</option>
        {/each}
      </select>
    </div>

    {#if javaConfig.jdkInstallMethod !== "none"}
      <!-- Versions -->
      <div class="space-y-2">
        <h3 class="text-sm font-medium text-slate-200">JDK 版本</h3>
        <div class="flex flex-wrap gap-2">
          {#each versionOptions as opt (opt.key)}
            <label
              class="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm text-slate-200"
            >
              <input
                type="checkbox"
                class="h-4 w-4 accent-teal-500"
                checked={javaConfig.jdkVersions.includes(opt.key)}
                onchange={(e) => toggleVersion(opt.key, e.currentTarget.checked)}
              />
              {opt.label}
            </label>
          {/each}
        </div>
      </div>

      <!-- Distributions -->
      <div class="space-y-2">
        <h3 class="text-sm font-medium text-slate-200">JDK 发行版</h3>
        <div class="flex flex-wrap gap-2">
          {#each distributionOptions as opt (opt.key)}
            <label
              class="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm text-slate-200"
            >
              <input
                type="radio"
                name="jdk-distribution"
                class="h-4 w-4 accent-teal-500"
                checked={javaConfig.jdkDistribution === opt.key}
                onchange={() => setDistribution(opt.key)}
              />
              {opt.label}
            </label>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</ModuleContainer>
