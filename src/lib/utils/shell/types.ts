import type { Config } from "$types/config";

export interface ScriptGeneratorContext {
  config: Config;
  preferredPm: "homebrew" | "macports" | "none";
  out: string[];
}

export type ModuleGenerator = (ctx: ScriptGeneratorContext) => void;
