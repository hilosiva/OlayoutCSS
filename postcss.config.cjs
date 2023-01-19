module.exports = {
  plugins: {
    autoprefixer: {
      grid: "autoplace", // IE11対応
    },
    "css-declaration-sorter": {
      order: "smacss",
    },
    "css-mqpacker": {
      sort: true, // スマホファーストに並び替え
    },
  },
};
