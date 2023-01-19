import { defineConfig } from "vite";
import { resolve } from "path";

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
  root: dir.src,
  publicDir: dir.publicDir,
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },

  server: {
    host: "0.0.0.0",
    open: true,
  },

  build: {
    outDir: dir.outDir,

    rollupOptions: {
      output: {
        assetFileNames: "olayout.[ext]",
      },
    },
  },
});
