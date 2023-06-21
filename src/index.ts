// import "./assets/scss/olayout.scss";

// import fs from "fs";
const fs = require("fs");
const postcss = require("postcss");
const insert = require("postcss-insert");
module.exports = postcss.plugin("olayout", () => {
  return (root) => {
    const css = fs.readFileSync("./assets/css/olayout.css", "utf8");
    const insertNode = postcss.parse(css);
    root.prepend(insertNode);
  };
});

// class Olayout {
//   private configFile: string;

//   constructor() {
//     this.configFile = "/olayout.config.json";
//     console.log(this.configFile);

//     this._init();
//   }

//   private _init() {
//     try {
//       const content = fs.readFileSync(this.configFile, "utf-8");
//       console.log(content);
//     } catch (error) {
//       console.error(error);
//     }
//   }
// }

// export default new Olayout();
