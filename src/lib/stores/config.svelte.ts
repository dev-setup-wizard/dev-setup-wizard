import {
  defaultConfig,
  MODULE_ORDER,
  type Config,
  type ModuleKey,
  type PackageManager,
} from "$types/config";

const STORAGE_KEY = "dev-setup-wizard-config-v1";

// Recursive partial type for deep merging
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? Array<DeepPartial<U>>
    : T[P] extends object
      ? DeepPartial<T[P]>
      : T[P];
};

/**
 * Deep merge two objects.
 */
function deepMerge<T extends object>(target: T, source: DeepPartial<T>): T {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      const targetValue = (target as any)[key];
      const sourceValue = (source as any)[key];

      if (isObject(targetValue) && isObject(sourceValue)) {
        (output as any)[key] = deepMerge(targetValue, sourceValue);
      } else {
        (output as any)[key] = sourceValue;
      }
    });
  }
  return output;
}

function isObject(item: any): item is object {
  return item && typeof item === "object" && !Array.isArray(item);
}

class ConfigStore {
  // Svelte 5 reactive state
  #config = $state<Config>(defaultConfig);

  constructor() {
    this.#config = this.#loadInitialConfig();
  }

  // Getters
  get value() {
    return this.#config;
  }

  // Derived states in Svelte 5
  get completedModules() {
    return MODULE_ORDER.filter((module) => this.#hasModuleSelection(module));
  }

  get completionPercentage() {
    return Math.round((this.completedModules.length / MODULE_ORDER.length) * 100);
  }

  // Actions
  patch(patch: DeepPartial<Config>) {
    this.#config = deepMerge(this.#config, patch);
    // Specific logic for package managers normalization
    if (patch.packageManagers?.packageManagers) {
      this.#config.packageManagers.packageManagers = this.#normalizePackageManagers(
        this.#config.packageManagers.packageManagers,
      );
    }
    this.#config.ui.lastUpdatedAt = Date.now();
    this.#persist();
  }

  setCurrentModule(moduleKey: ModuleKey) {
    this.#config.ui.currentModuleKey = moduleKey;
    this.#config.ui.lastUpdatedAt = Date.now();
    this.#persist();
  }

  reset() {
    this.#config = { ...defaultConfig, ui: { ...defaultConfig.ui, lastUpdatedAt: Date.now() } };
    this.#persist();
  }

  // Private helpers
  #loadInitialConfig(): Config {
    if (typeof window === "undefined") return defaultConfig;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultConfig;
    try {
      const parsed = JSON.parse(stored);
      // Deep merge with defaultConfig to handle schema changes
      return deepMerge(defaultConfig, parsed);
    } catch {
      return defaultConfig;
    }
  }

  #persist() {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.#config));
  }

  #normalizePackageManagers(input: PackageManager[]): PackageManager[] {
    if (input.length === 0) return ["none"];
    if (input.includes("none")) return ["none"];
    return Array.from(new Set(input));
  }

  #hasModuleSelection(module: ModuleKey): boolean {
    const c = this.#config;
    switch (module) {
      case "package-managers":
        return c.packageManagers.packageManagers.some((pm) => pm !== "none");
      case "node":
        return (
          c.node.nodeVersions.length > 0 ||
          c.node.installYarn ||
          c.node.installPnpm ||
          c.node.installDeno ||
          c.node.installBun
        );
      case "python":
        return (
          c.python.pythonInstallMethod !== "none" ||
          c.python.installPythonLatest ||
          c.python.aliasPythonToPython3 ||
          c.python.installPython2
        );
      case "java":
        return c.java.jdkInstallMethod !== "none" || c.java.jdkVersions.length > 0;
      case "other-languages":
        return (
          c.otherLanguages.go.enabled ||
          c.otherLanguages.rust.enabled ||
          c.otherLanguages.dart.enabled ||
          (c.otherLanguages.otherEnabled && c.otherLanguages.otherName.trim().length > 0)
        );
      case "developer-tools":
        return true;
      default:
        return false;
    }
  }
}

// Export a singleton instance
export const configStore = new ConfigStore();
export type { DeepPartial };
