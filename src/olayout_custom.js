const fs = require("fs");
const path = require("path");
const postcss = require("postcss");

module.exports = postcss.plugin("olayout", () => {
  const categories = ["layout", "color"];

  return async (root, result) => {
    const cssPath = path.resolve(__dirname, "assets/css/olayout.css");
    const pluginDir = path.dirname(result.opts.from);
    const projectRoot = findProjectRoot(pluginDir);

    const configPath = path.join(projectRoot, "olayout.config.cjs");
    const configFile = require(configPath);

    // ループ処理でscreensの値に基づいてスタイルを生成
    for (const device in configFile.theme.screens) {
      const breakpoint = configFile.theme.screens[device];

      // コンテナのスタイルを生成
      const containerRule = postcss.rule({
        selector: `.${configFile.prefix}-container:not([data-width])`,
      });

      // widthのスタイルを追加
      containerRule.append(
        postcss.decl({
          prop: "width",
          value: "90%",
        })
      );

      // 他のプロパティのスタイルを追加

      // メディアクエリを生成してルールに追加
      const mediaQuery = postcss.atRule({
        name: "media",
        params: `screen and (min-width: ${breakpoint})`,
      });
      mediaQuery.append(containerRule);
      root.append(mediaQuery);
    }

    const from = result.opts.from || "<unknown>";
    console.log("Processing CSS from:", from);
    return root;
  };
});

function findProjectRoot(dir) {
  // ディレクトリがルートディレクトリに到達したら終了
  if (dir === "/" || dir === "\\") {
    return dir;
  }

  // ディレクトリ内に olayout.config.cjs ファイルが存在する場合
  if (fileExists(path.join(dir, "olayout.config.cjs"))) {
    return dir;
  }

  // 親ディレクトリを再帰的に探索
  const parentDir = path.dirname(dir);
  return findProjectRoot(parentDir);
}

function fileExists(filePath) {
  try {
    fs.accessSync(filePath);
    return true;
  } catch (error) {
    return false;
  }
}
