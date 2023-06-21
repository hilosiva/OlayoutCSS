const fs = require("fs");
const path = require("path");
const postcss = require("postcss");

module.exports = postcss.plugin("olayout", () => {
  const categories = ["layout", "color"];

  return (root, result) => {
    const cssPath = path.resolve(__dirname, "assets/css/olayout.css");
    const pluginDir = path.dirname(result.opts.from);
    const projectRoot = findProjectRoot(pluginDir);

    const configPath = path.join(projectRoot, "olayout.config.cjs");
    const configFile = require(configPath);

    try {
      const css = fs.readFileSync(cssPath, "utf8");

      const insertNode = postcss.parse(css, { from: cssPath });

      try {
        insertNode.walkRules(":root", (rule) => {
          if (rule.parent.type !== "atrule" || rule.parent.name !== "media") {
            rule.walkDecls(/^--/, (decl) => {
              const prop = decl.prop.slice(5);

              if (configFile.theme.layout[prop]) {
                decl.value = String(configFile.theme.layout[prop]);
              }
            });
          }
        });
      } catch (e) {
        console.error(e.message);
      }

      root.prepend(insertNode);
    } catch (e) {
      return;
    }
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
