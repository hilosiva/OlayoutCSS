module.exports = {
  plugins: [
    // require("./src/olayout.js"), // ビルド時に ON
    // require("./dist/index.js"), // CDN作成時に ON
    // require("postcss-preset-env")({
    //   features: {
    //     "nesting-rules": true,
    //     clamp: true,
    //     "custom-media-queries": false,
    //   },
    // }),
    // CDN作成時に ON
    // require("autoprefixer")({
    //   grid: "autoplace", // IE11対応
    // }),
    require("css-declaration-sorter")({
      order: "smacss", // alphabetical/ smacss / concentric-css
    }),
    require("css-mqpacker")({
      sort: true, // スマホファーストに並び替え
    }),
  ],
};
