import { derived, writable, type Readable } from "svelte/store";
import {
  defaultConfig,
  MODULE_ORDER,
  type Config,
  type ModuleKey,
  type PackageManager,
} from "$types/config";

const STORAGE_KEY = "dev-setup-wizard-config-v1";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function safeParseConfig(value: string | null): Config | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as Config;
  } catch {
    return null;
  }
}

function loadInitialConfig(): Config {
  if (!isBrowser()) return defaultConfig;
  const parsed = safeParseConfig(window.localStorage.getItem(STORAGE_KEY));
  return parsed ?? defaultConfig;
}

function persistConfig(config: Config): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

function normalizePackageManagers(input: PackageManager[]): PackageManager[] {
  if (input.length === 0) return ["none"];
  if (input.includes("none")) {
    return ["none"];
  }
  return Array.from(new Set(input));
}

function createConfigStore() {
  const { subscribe, set, update } = writable<Config>(loadInitialConfig());

  return {
    subscribe,
    setConfig(config: Config) {
      const next = {
        ...config,
        packageManagers: {
          packageManagers: normalizePackageManagers(config.packageManagers.packageManagers),
        },
        ui: { ...config.ui, lastUpdatedAt: Date.now() },
      } satisfies Config;
      set(next);
      persistConfig(next);
    },
    reset() {
      const next = {
        ...defaultConfig,
        ui: { ...defaultConfig.ui, lastUpdatedAt: Date.now() },
      } satisfies Config;
      set(next);
      persistConfig(next);
    },
    patch(patch: Partial<Config>) {
      update((current) => {
        
        const next: Config = {
          ...current,
          ...patch,
          packageManagers: {
            ...current.packageManagers,
            ...patch.packageManagers,
            packageManagers: normalizePackageManagers(
              patch.packageManagers?.packageManagers ?? current.packageManagers.packageManagers,
            ),
          },
          node: {...current.node, ...patch.node},
          python: { ...current.python, ...patch.python },
          java: { ...current.java, ...patch.java },
          otherLanguages: {
            ...current.otherLanguages,
            ...patch.otherLanguages,
            flutter: {
              ...current.otherLanguages.flutter,
              ...patch.otherLanguages?.flutter,
            },
          },
          developerTools: {
            ...current.developerTools,
            ...patch.developerTools,
            cliTools: { ...current.developerTools.cliTools, ...patch.developerTools?.cliTools },
            shellCustomization: {
              ...current.developerTools.shellCustomization,
              ...patch.developerTools?.shellCustomization,
            },
            servers: { ...current.developerTools.servers, ...patch.developerTools?.servers },
            databases: { ...current.developerTools.databases, ...patch.developerTools?.databases },
            containers: { ...current.developerTools.containers, ...patch.developerTools?.containers },
            guiApps: { ...current.developerTools.guiApps, ...patch.developerTools?.guiApps },
            aiTools: { ...current.developerTools.aiTools, ...patch.developerTools?.aiTools },
            networkTools: {
              ...current.developerTools.networkTools,
              ...patch.developerTools?.networkTools,
            },
          },
          ui: {
            ...current.ui,
            ...patch.ui,
            lastUpdatedAt: Date.now(),
          },
        };
        persistConfig(next);
        return next;
      });
    },
    setCurrentModule(moduleKey: ModuleKey) {
      update((current) => {
        const next = {
          ...current,
          ui: {
            ...current.ui,
            currentModuleKey: moduleKey,
            lastUpdatedAt: Date.now(),
          },
        };
        persistConfig(next);
        return next;
      });
    },
  };
}

export const configStore = createConfigStore();

function hasModuleSelection(config: Config, module: ModuleKey): boolean {
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
        config.python.aliasPythonToPython3 ||
        config.python.installPython2
      );
    case "java":
      return (
        config.java.jdkInstallMethod !== "none" ||
        config.java.jdkVersions.length > 0
      );
    case "other-languages":
      return (
        config.otherLanguages.goEnabled ||
        config.otherLanguages.rustEnabled ||
        config.otherLanguages.flutterEnabled ||
        config.otherLanguages.dartEnabled ||
        (config.otherLanguages.otherEnabled && config.otherLanguages.otherName.trim().length > 0)
      );
    case "developer-tools":
      return true;
    default:
      return false;
  }
}

export const completedModulesStore: Readable<ModuleKey[]> = derived(configStore, ($config) =>
  MODULE_ORDER.filter((module) => hasModuleSelection($config, module)),
);

export const completionPercentStore: Readable<number> = derived(
  completedModulesStore,
  ($completed) => Math.round(($completed.length / MODULE_ORDER.length) * 100),
);
