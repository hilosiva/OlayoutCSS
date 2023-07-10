const fs = require("fs");
const path = require("path");
const postcss = require("postcss");

const defaultConfig = {
  prefix: "ol",
  theme: {
    screens: {
      min: "0",
      xxs: "375px",
      xs: "414px",
      sm: "576px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      xxl: "1480px",
    },
    layout: {
      "sm-offset": "2.5vw",
      "md-offset": "5vw",
      "lg-offset": "10vw",
      "xl-offset": "15vw",
      "sm-content-width": 640,
      "md-content-width": 765,
      "lg-content-width": 1024,
      "xl-content-width": 1280,
      "xxl-content-width": 1440,
      "sm-design-width": 375,
      "md-design-width": 765,
      "lg-design-width": 1440,
      "scrollbar-width": 0,
      space: 8,
    },
    colors: {
      "base-color": "#fff",
      "main-color": "#116ec5",
      "accent-color": "#e4d558",
      "light-color": "#efefef",
      "dark-color": "#1c1c1c",
      "primary-text-color": "#101010",
      "light-text-color": "#fff",
    },
    typos: {
      "primary-font-set": '-apple-system, BlinkMacSystemFont, "Yu Gothic", sans-serif',
      "en-font-set": '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
      "base-line-height": 1.5,
      "base-feature-settings": '"pkna"',
      "base-letter-spacing": "0.05em",
    },
    animations: {
      "scroll-behavior": "smooth",
      "ease-out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      duration: "0.6s",
    },
  },
};

function findProjectRoot(dir) {
  if (dir === "/" || dir === "\\") {
    return dir;
  }

  if (fileExists(path.join(dir, "olayout.config.cjs"))) {
    return dir;
  }

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

function deepMerge(target, source) {
  if (typeof target !== "object" || typeof source !== "object") {
    return source;
  }

  const keys = Object.keys(source);

  for (const key of keys) {
    if (!(key in target)) {
      target[key] = source[key];
    } else if (typeof target[key] === "object" && typeof source[key] === "object") {
      target[key] = deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }

  return target;
}

const plugin = (opts = {}) => {
  const categories = ["layout", "colors", "typos", "animations"];

  return {
    postcssPlugin: "olayout",
    Once(root, { result }) {
      const cssPath = path.resolve(__dirname, "assets/css/olayout.css");

      const pluginDir = path.dirname(result.opts.from);
      const projectRoot = findProjectRoot(pluginDir);

      const configPath = path.join(projectRoot, "olayout.config.cjs");

      const configFile = fileExists(configPath) ? require(configPath) : {};

      const config = deepMerge(defaultConfig, configFile);

      const mediaQueries = new Map();

      try {
        const css = fs.readFileSync(cssPath, "utf8");

        const insertNode = postcss.parse(css, { from: cssPath });

        try {
          // ｐrefixの置き換え
          // insertNode.walkRules((rule) => {
          //   rule.selector = rule.selector.replace(/.ol-/g, `.${config.prefix}-`);

          //   rule.walkDecls((decl) => {
          //     decl.value.replace("--ol-", `--${config.prefix}-`);
          //   });
          // });

          // カスタムメディアの処理
          insertNode.walkAtRules("custom-media", (atrule) => {
            const match = /--ol-(\w+)/.exec(atrule.params);

            if (match) {
              const screenKey = match[1];

              if (config.theme.screens[screenKey]) {
                const minWidthValue = config.theme.screens[screenKey];
                const mediaValue = `screen and (min-width: ${minWidthValue})`;
                atrule.params = `${match[0]} ${mediaValue}`;

                mediaQueries.set(match[0], mediaValue);

                atrule.remove();
              }
            }
          });

          // カスタムプロパティの処理
          insertNode.walkRules(":root", (rule) => {
            if (rule.parent.type !== "atrule" || rule.parent.name !== "media") {
              rule.walkDecls(/^--/, (decl) => {
                const prop = decl.prop.slice(config.prefix.length + 3);
                categories.forEach((category) => {
                  if (config.theme[category][prop]) {
                    decl.value = String(config.theme[category][prop]);
                  }
                });
              });
            }
          });
        } catch (e) {
          console.error(e.message);
        }

        const prependNodes = [];

        // @charsetやWebフォントを一旦避ける

        root.walkAtRules((atrule) => {
          if (atrule.name === "charset" || (atrule.name === "import" && atrule.params.includes("//")) || atrule.name === "font-face") {
            // @charset、フォント関連のルールを prependNodes に追加

            prependNodes.push(atrule);
            atrule.remove();
          }
        });

        // 先頭に追加
        root.prepend(insertNode);

        // prependNodes 配列の要素を root の先頭に順番に挿入
        prependNodes.reverse().forEach((node) => {
          root.prepend(node);
        });

        // 既存のCSSファイルを含むカスタムメディアをメディアクエリに置き換え
        root.walkAtRules("media", (atrule) => {
          const screenKey = atrule.params.trim().replace(/[()]/g, "");

          if (mediaQueries.has(screenKey)) {
            atrule.params = mediaQueries.get(screenKey);
          }
        });
      } catch (e) {
        return;
      }
    },
  };
};

plugin.postcss = true;

module.exports = plugin;
