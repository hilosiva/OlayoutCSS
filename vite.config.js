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
  root: process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test" ? "example" : process.cwd(),
  publicDir: dir.publicDir,

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
    outDir: process.env.NODE_ENV === "test" ? "../test" : "./lib",
    lib: {
      entry: [resolve(__dirname, "src/index.ts")],
      name: "index",
      fileName: "index",
      formats: ["cjs"],
    },
    emptyOutDir: true,
    rollupOptions: {
      external: ["vite", "fs", "path", "postcss"],

      output: {
        // assetFileNames: "olayout.[ext]",
        assetFileNames: ({ name }) => {
          if (/\.css$/.test(name ?? "")) {
            return "assets/css/olayout[extname]";
          }
          if (/\.js$/.test(name ?? "")) {
            return "assets/js/olayout[extname]";
          }
          return "assets/olayout[extname]";
        },

        globals: {
          path: "path",
          postcss: "postcss",
          fs: "fs",
        },
      },
    },
    // minify: false,
  },
});
