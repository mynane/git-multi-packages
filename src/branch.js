/**
 * Created by xushaoping on 17/10/11.
 */

const fs = require("fs-extra");
const { exec, spawn, execSync } = require("child_process");
const path = require("path");
const chalk = require("chalk");
const inquirer = require("inquirer");
const { v4: uuidv4 } = require("uuid");
const Config = require("./utils/config");

function terminalBranchs(data, defaultBranchs = []) {
  return new Promise((resolve, reject) => {
    inquirer
      .prompt([
        {
          name: "checkbox",
          type: "checkbox",
          message: "please select projects",
          choices: data,
          default: defaultBranchs,
        },
      ])
      .then((res) => {
        const checkbox = res.checkbox.toString();
        if (!checkbox) {
          console.log(chalk.red("branch not found"));
          return reject("branch not found");
        }
        resolve(checkbox.split(","));
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function terminalName() {
  return new Promise((resolve, reject) => {
    inquirer
      .prompt([
        {
          name: "input",
          type: "input",
          message: "please input branch name:",
          // default: ,
        },
      ])
      .then((res) => {
        const name = res.input.toString();
        if (!name) {
          return reject("branch name not found");
        }
        resolve(name);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function terminalAddress() {
  return new Promise((resolve, reject) => {
    inquirer
      .prompt([
        {
          name: "input",
          type: "input",
          message: "please input demand address:",
          // default: ,
        },
      ])
      .then((res) => {
        const name = res.input.toString();

        resolve(name);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function terminalDescribe() {
  return new Promise((resolve, reject) => {
    inquirer
      .prompt([
        {
          name: "input",
          type: "input",
          message: "please input branch describe:",
          // default: ,
        },
      ])
      .then((res) => {
        const name = res.input.toString();

        resolve(name);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function cleans(branchs) {
  return branchs.map(
    (name) =>
      new Promise((resolve, reject) => {
        const res = execSync(`cd ${name} && git status`).toString();
        if (!res.includes("nothing to commit, working tree clean")) {
          return reject(`${name} working tree not clean`);
        }
        resolve(true);
      })
  );
}

function checkout(branchs, branchName) {
  return branchs.map(
    (name) =>
      new Promise((resolve, reject) => {
        const res = execSync(
          `cd ${name} && git checkout ${branchName}`
        ).toString();
        resolve(true);
      })
  );
}

function deleteBranch(branchs, branchName) {
  return branchs.map(
    (name) =>
      new Promise((resolve, reject) => {
        try {
          const res = execSync(
            `cd ${name} && git branch -d ${branchName}`
          ).toString();
          resolve(true);
        } catch (error) {}
      })
  );
}

function branchs(branchs, branchName) {
  return branchs.map(
    (name) =>
      new Promise((resolve, reject) => {
        try {
          const result = execSync(
            `cd ${name} && git checkout -b ${branchName}`
          ).toString();
          resolve(true);
        } catch (error) {
          reject(
            `project ${chalk.red(name)}: branch named '${chalk.red(
              branchName
            )}' already exists.`
          );
        }
      })
  );
}

function setUpstream(branchs, branchName) {
  return branchs.map(
    (name) =>
      new Promise((resolve, reject) => {
        try {
          const result = execSync(
            `cd ${name} && git push --set-upstream origin ${branchName}`
          ).toString();
          resolve(true);
        } catch (error) {
          reject(
            `project ${chalk.red(name)}: branch named '${chalk.red(
              branchName
            )}' already exists.`
          );
        }
      })
  );
}

class Branch {
  static modules = [];

  constructor() {
    for (let i = 0; i < Branch.modules.length; i++) {
      Branch.modules[i].register(this);
    }
  }

  static reject(module) {
    Branch.modules.push(module);
  }

  get repositories() {
    return this.Config.temp.repositories;
  }

  get branchs() {
    return this.Config.temp.branchs;
  }

  async run(type) {
    try {
      const { name: bn, upstream, remove } = type;
      const name = bn || remove;
      const [branch] = Object.values(this.branchs).filter(
        (b) => b.name === name
      );
      if (!branch) {
        console.log(chalk.gray(`branch ${name} not found`));
        console.log(chalk.gray(`create branch ${name}`));
      }
      if (remove) {
        if (branch) {
          await deleteBranch(branch.repositories, remove);
          this.Config.removeBranch(branch.gmid);
          console.log(chalk.green(`remove branch ${name} success`));
        }
        return;
      }

      if (name && branch) {
        await cleans(branch.repositories);
        await checkout(branch.repositories, name);
        console.log(chalk.green(`checkout ${name} success`));
        branch.describe &&
          console.log(chalk.green(`decribe: ${branch.describe}`));
        return;
      }
      const repositories = Object.keys(this.repositories);
      const res = await terminalBranchs(repositories);
      const branchName = name || (await terminalName());
      const address = await terminalAddress();
      const describe = await terminalDescribe();
      await cleans(res);
      await checkout(res, "master");
      await cleans(res);
      await branchs(res, branchName);
      upstream && (await setUpstream(res, branchName));

      const gmid = uuidv4();

      this.Config.addBranch(gmid, {
        gmid,
        address,
        describe,
        repositories: res,
        name: branchName,
        upstream: !!upstream,
        create_at: new Date(),
      });

      this.Config.setCurrent(branchName);

      console.log(
        chalk.green(
          `${res.join("、")} branch ${branchName} create success gmid: ${gmid}`
        )
      );
    } catch (error) {
      console.log(chalk.red(error));
    }
  }
}

Branch.reject(new Config());

module.exports = new Branch();
