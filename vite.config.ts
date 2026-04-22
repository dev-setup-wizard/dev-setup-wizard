import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [svelte(), tailwindcss()],
  resolve: {
    alias: {
      $lib: path.resolve("./src/lib"),
      $components: path.resolve("./src/lib/components"),
      $utils: path.resolve("./src/lib/utils"),
      $stores: path.resolve("./src/lib/stores"),
      $types: path.resolve("./src/lib/types"),
    },
  },
});
