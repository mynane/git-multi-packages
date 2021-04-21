const fs = require("fs-extra");
const chalk = require("chalk");

function init(doc = "") {
  fs.ensureDirSync("./.gm");
  fs.writeFileSync("./.gm/config", doc);
  console.log(chalk.green("initialized"));
}

class Config {
  cpath = "./.gm/config";
  temp = {
    repositories: {},
    branchs: {},
    current: "",
  };

  constructor() {
    try {
      this.temp = JSON.parse(fs.readFileSync(this.cpath).toString());
    } catch (error) {}
  }

  register(contxt) {
    contxt.Config = this;
  }

  get sTemp() {
    return JSON.stringify(this.temp);
  }

  save() {
    fs.writeFileSync(this.cpath, JSON.stringify(this.temp));
  }

  init(force = false) {
    try {
      fs.statSync("./.gm/config");
      if (!force) {
        return;
      }
      init(this.sTemp);
    } catch (error) {
      init(this.sTemp);
    }
  }

  /**
   * 添加项目
   * @param {*} name
   * @param {*} config
   * @returns
   */
  addRepositority(name, config) {
    if (!name || !config) {
      return console.log(chalk.red("repository name or config not found"));
    }
    this.temp.repositories[name] = config;
    this.save();
  }

  /**
   * 添加分支
   * @param {*} name
   * @param {*} config
   * @returns
   */
  addBranch(name, config) {
    if (!name || !config) {
      return console.log(chalk.red("branch name or config not found"));
    }
    this.temp.branchs[name] = config;
    this.save();
  }

  /**
   * 删除分支
   * @param {*} name
   * @param {*} config
   * @returns
   */
  removeBranch(name) {
    if (!name) {
      return console.log(chalk.red("branch name or config not found"));
    }
    delete this.temp.branchs[name];
    this.save();
  }

  /**
   * 设置当前分支
   * @param {*} current
   * @returns
   */
  setCurrent(current) {
    if (!current) {
      return console.log(chalk.red("branch name or config not found"));
    }
    this.temp.current = current;
    this.save();
  }
}

module.exports = Config;
