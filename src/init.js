/**
 * Created by xushaoping on 17/10/11.
 */

const fs = require("fs-extra");
const { exec, spawn, execSync } = require("child_process");
const path = require("path");
const chalk = require("chalk");
const Config = require("git-multi-packages/src/utils/config");

class Init {
  static modules = [];

  constructor() {
    for (let i = 0; i < Init.modules.length; i++) {
      Init.modules[i].register(this);
    }
  }

  static reject(module) {
    Init.modules.push(module);
  }

  get repositories() {
    return this.Config.temp.repositories;
  }

  run(type, name) {
    const { force } = type;
    this.Config.init(force);

    fs.readdirSync("./").forEach((name) => {
      var filePath = path.join("./", name);
      var stat = fs.statSync(filePath);
      if (stat.isDirectory() && !name.startsWith(".")) {
        try {
          const result = execSync(`cd ./${name} && git remote -v`).toString();
          const match = result.match(/origin\t(.+)\s\(fetch\)/);
          if (match && !this.repositories[name]) {
            this.Config.addRepositority(name, {
              path: name,
              origin: match[1],
              main: "master",
            });
          }
        } catch (error) {}
      }
    });
  }
}

Init.reject(new Config());

module.exports = new Init();
