import path from "path";

export function ViteOlayout(): any {
  return {
    name: "ViteOlayout",
    config: () => ({
      build: {
        rollupOptions: {
          input: {
            main: path.resolve(__dirname, "input.ts"),
          },
        },
      },
      optimizeDeps: {
        include: [path.resolve(__dirname, "input.ts")],
      },
    }),
    configResolved(_config: any) {
      console.log(_config.build.rollupOptions);
    },
  };
}

// // my-plugin.js
// // my-plugin.js
// const postcss = require("postcss");
// const fs = require("fs");

// function olayout() {
//   return function (root, result) {
//     // CSSファイルのパス
//     const cssFilePath = result.opts.from;

//     // 開発時は追加しない
//     if (process.env.NODE_ENV === "production") {
//       // olayout.cssの内容を取得
//       const olayoutCSS = fs.readFileSync("./olayout.css", "utf-8");

//       // olayout.cssをASTに変換して先頭に追加
//       const olayoutAST = postcss.parse(olayoutCSS);
//       root.prepend(olayoutAST);
//     }
//   };
// }

// module.exports = olayout;
