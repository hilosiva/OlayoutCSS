module.exports = {
  plugins: [
    require("./src/olayout.js"),
    // require("./dist/index.js"),
    // require("postcss-preset-env")({
    //   features: {
    //     "nesting-rules": true,
    //     clamp: true,
    //     "custom-media-queries": false,
    //   },
    // }),
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
