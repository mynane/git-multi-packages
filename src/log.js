/**
 * Created by xushaoping on 17/10/11.
 */

const fs = require("fs-extra");
const { exec, spawn, execSync } = require("child_process");
const path = require("path");
const chalk = require("chalk");
const Config = require("git-multi-packages/src/utils/config");

class Log {
  static modules = [];

  constructor() {
    for (let i = 0; i < Log.modules.length; i++) {
      Log.modules[i].register(this);
    }
  }

  static reject(module) {
    Log.modules.push(module);
  }

  get branchs() {
    return this.Config.temp.branchs;
  }

  run(type, name) {
    const branchs = Object.values(this.branchs).sort(
      (a, b) => new Date(b.create_at) - new Date(a.create_at)
    );

    branchs.forEach((b) => {
      console.log(chalk.yellow(`gmid: ${b.gmid}`));
      console.log(`Name: ${b.name}`);
      console.log(`Brach: ${b.repositories.join(" ")}`);
      console.log(`Date: ${b.create_at}`);
      b.address && console.log(`Address: ${chalk.blue(b.address || "")}`);
      console.log();
      console.log(`    ${b.describe || ""}`);
      console.log();
    });
  }
}

Log.reject(new Config());

module.exports = new Log();
