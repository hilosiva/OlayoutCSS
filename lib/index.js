"use strict";
const olayout = "";
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
      xxl: "1480px"
    },
    layout: {
      "sm-content-width": 640,
      "md-content-width": 765,
      "lg-content-width": 1024,
      "xl-content-width": 1280,
      "xxl-content-width": 1440,
      "sm-design-width": 375,
      "md-design-width": 765,
      "lg-design-width": 1440,
      "scrollbar-width": 0,
      space: 8
    },
    colors: {
      "base-color": "#fff",
      "main-color": "#116ec5",
      "accent-color": "#e4d558",
      "light-color": "#efefef",
      "dark-color": "#1c1c1c",
      "primary-text-color": "#101010",
      "light-text-color": "#fff"
    },
    typos: {
      "primary-font-set": '-apple-system, BlinkMacSystemFont, "Yu Gothic", sans-serif',
      "en-font-set": '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
      "base-line-height": 1.5,
      "base-feature-settings": '"pkna"',
      "base-letter-spacing": "0.05em"
    },
    animations: {
      "scroll-behavior": "smooth",
      "ease-out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      duration: "0.6s"
    }
  }
};
module.exports = postcss.plugin("olayout", () => {
  const categories = ["layout", "colors", "typos", "animations"];
  return (root, result) => {
    const cssPath = path.resolve(__dirname, "assets/css/olayout.css");
    const pluginDir = path.dirname(result.opts.from);
    const projectRoot = findProjectRoot(pluginDir);
    const configPath = path.join(projectRoot, "olayout.config.cjs");
    const configFile = require(configPath);
    const config = deepMerge(defaultConfig, configFile);
    try {
      const css = fs.readFileSync(cssPath, "utf8");
      const insertNode = postcss.parse(css, { from: cssPath });
      try {
        insertNode.walkAtRules("media", (atrule) => {
          const screenKey = atrule.params.trim();
          if (config.theme.screens[screenKey]) {
            atrule.params = `screen and (min-width: ${config.theme.screens[screenKey]})`;
          }
        });
        insertNode.walkRules(":root", (rule) => {
          if (rule.parent.type !== "atrule" || rule.parent.name !== "media") {
            rule.walkDecls(/^--/, (decl) => {
              const prop = decl.prop.slice(5);
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
      root.prepend(insertNode);
    } catch (e) {
      return;
    }
  };
});
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
