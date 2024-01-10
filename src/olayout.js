const fs = require("fs");
const path = require("path");
const postcss = require("postcss");

const defaultConfig = {
  prefix: "ol",
  theme: {
    screens: {
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
      "md-content-width": 768,
      "lg-content-width": 1024,
      "xl-content-width": 1280,
      "xxl-content-width": 1440,
      "sm-design-width": 375,
      "md-design-width": 768,
      "lg-design-width": 1440,
      space: 8,
    },
    colors: {
      "base-color": "#fff",
      "main-color": "#116ec5",
      "accent-color": "#e4d558",
      "light-color": "#efefef",
      "dark-color": "#1c1c1c",
      "border-color-1": "#dedede",
      "border-color-2": "#303030",
      "border-color-3": "#fafafa",
      "text-color-1": "#101010",
      "text-color-2": "#606060",
      "text-color-3": "#f0f0f0",
    },
    typos: {
      "font-set-1": '-apple-system, BlinkMacSystemFont, "Yu Gothic", sans-serif',
      "font-set-2": '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
      "font-set-3": '"Times New Roman", "YuMincho", "Yu Mincho", serif',
      "base-line-height": 1.5,
      "base-feature-settings": '"pkna"',
      "base-letter-spacing": "0.05em",
    },
    effects: {
      "shadow-1": "0 0 8px rgba(0, 0, 0, 0.16)",
      "shadow-2": "2px 4px 24px -1px rgba(0, 0, 0, 0.1)",
      "shadow-3": "8px 16px 32px -4px rgba(0, 0, 0, 0.05)",
    },
    animations: {
      "scroll-behavior": "smooth",
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
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

const getRem = (px) => {
  return `${px / 16}rem`;
};
const getEm = (px, base = 16) => {
  return `${px / base}em`;
};

// Clampを計算する関数
const getFluid = (minSize, maxSize, minViewPort = defaultConfig.theme.layout["sm-design-width"], maxViewPort = defaultConfig.theme.layout["lg-design-width"]) => {
  const valiablePart = (maxSize - minSize) / (maxViewPort - minViewPort);
  const constant = maxSize - maxViewPort * valiablePart;

  return `clamp(${getRem(minSize)}, ${getRem(constant)} + ${100 * valiablePart}vw, ${getRem(maxSize)})`;
};

const plugin = (opts = {}) => {
  const categories = ["layout", "colors", "typos", "effects", "animations"];

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

          // Olayoutの挿入場所を確認
          let isOlayoutRoot = false;
          root.walkAtRules((atrule) => {
            if (atrule.name === "olayoutcss" || atrule.name === "olayout") {
              isOlayoutRoot = true;
              atrule.remove();
            }
          });

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

          if (isOlayoutRoot) {
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

            // @charsetやWebフォントを一旦避ける

            const prependNodes = [];
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
          }

          // 既存のCSSファイルを含むカスタムメディアをメディアクエリに置き換え
          root.walkAtRules("media", (atrule) => {
            const screenKey = atrule.params.trim().replace(/[()]/g, "");

            if (mediaQueries.has(screenKey)) {
              atrule.params = mediaQueries.get(screenKey);
            }
          });

          // 既存のCSSファイルに含むオリジナル関数の処理
          root.walkDecls((decl) => {
            // fluid関数
            const fluidMatch = /fluid\(([^)]+)\)/.exec(decl.value);
            if (fluidMatch) {
              const [minSize, maxSize, minViewPort, maxViewPort] = fluidMatch[1]
                .replace(/\s/g, "")
                .split(",")
                .map((value) => {
                  if (value === "") {
                    return undefined; // 空文字列があれば undefined とする
                  }

                  const numericValue = parseFloat(value);

                  if (isNaN(numericValue)) {
                    throw new Error(`Invalid argument '${value}' in fluid() function.`);
                  }

                  return numericValue;
                }); // () の中の文字列

              decl.value = decl.value.replace(
                fluidMatch[0],
                getFluid(minSize, maxSize, minViewPort ? minViewPort : config.theme.layout["sm-design-width"], maxViewPort ? maxViewPort : config.theme.layout["lg-design-width"])
              );
            }

            // rem関数
            const remMatch = /rem\(([^)]+)\)/.exec(decl.value);

            if (remMatch) {
              const px = parseFloat(remMatch[1]);
              if (isNaN(px)) {
                throw new Error(`Invalid argument '${remMatch[1]}' in rem() function.`);
              }

              decl.value = decl.value.replace(remMatch[0], getRem(px));
            }

            // em関数
            const emMatch = /em\(([^)]+)\)/.exec(decl.value);
            if (emMatch) {
              const [px, basePx] = emMatch[1]
                .replace(/\s/g, "")
                .split(",")
                .map((value) => {
                  if (value === "") {
                    return undefined; // 空文字列があれば undefined とする
                  }

                  const numericValue = parseFloat(value);

                  if (isNaN(numericValue)) {
                    throw new Error(`Invalid argument '${value}' in em() function.`);
                  }

                  return numericValue;
                }); // () の中の文字列;

              decl.value = decl.value.replace(emMatch[0], getEm(px, basePx ? basePx : 16));
            }

            // vw関数
            const vwMatch = /vw\(([^)]+)\)/.exec(decl.value);
            if (vwMatch) {
              const [px, viewPort] = vwMatch[1]
                .replace(/\s/g, "")
                .split(",")
                .map((value) => {
                  if (value === "") {
                    return undefined; // 空文字列があれば undefined とする
                  }

                  const numericValue = parseFloat(value);

                  if (isNaN(numericValue)) {
                    throw new Error(`Invalid argument '${value}' in vw() function.`);
                  }

                  return numericValue;
                }); // () の中の文字列;
              decl.value = decl.value.replace(vwMatch[0], `calc(${px} / ${viewPort ? viewPort : `var(--${config.prefix}-view-point)`} * 100vw)`);
            }

            // vh関数
            const vhMatch = /vh\(([^)]+)\)/.exec(decl.value);
            if (vhMatch) {
              const [px, viewPort] = vhMatch[1]
                .replace(/\s/g, "")
                .split(",")
                .map((value) => {
                  if (value === "") {
                    return undefined; // 空文字列があれば undefined とする
                  }

                  const numericValue = parseFloat(value);

                  if (isNaN(numericValue)) {
                    throw new Error(`Invalid argument '${value}' in vh() function.`);
                  }

                  return numericValue;
                }); // () の中の文字列;

              decl.value = decl.value.replace(vhMatch[0], `calc(${px} / ${viewPort ? viewPort : `var(--${config.prefix}-view-point)`} * 100vh)`);
            }
          });
        } catch (e) {
          console.error(e.message);
        }
      } catch (e) {
        console.error(e.message);
        return;
      }
    },
  };
};

plugin.postcss = true;

module.exports = plugin;
