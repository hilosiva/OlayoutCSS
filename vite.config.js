import { defineConfig } from "vite";
import { resolve } from "path";

// import { ViteOlayout } from "./package/index";

// ==============================================
// 設定
// ==============================================
const dir = {
  src: "src",
  publicDir: "../public",
  outDir: "../dist",
};

// https://vitejs.dev/config/
export default defineConfig({
  root: "example",
  publicDir: dir.publicDir,

  lib: {
    entry: resolve(__dirname, "src/index.ts"),
    name: "Olayout",
    fileName: "Olayout",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },

  server: {
    open: true,
  },

  css: {},
  // plugins: [ViteOlayout()],

  build: {
    outDir: dir.outDir,
    emptyOutDir: true,
    rollupOptions: {
      output: {
        assetFileNames: "olayout.[ext]",
      },
    },
  },
});
