/**
 * Created by xushaoping on 17/10/11.
 */

const fs = require("fs-extra");
const { exec, spawn, execSync } = require("child_process");
const path = require("path");
const chalk = require("chalk");
const inquirer = require("inquirer");
const { v4: uuidv4 } = require("uuid");
const Config = require("../src/utils/config");

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

function commitMessage() {
  return new Promise((resolve, reject) => {
    inquirer
      .prompt([
        {
          name: "input",
          type: "input",
          message: "please input commit message:",
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

function addAll(branchs) {
  return branchs.map(
    (name) =>
      new Promise((resolve, reject) => {
        try {
          const result = execSync(`cd ${name} && git add .`).toString();
          resolve(true);
        } catch (error) {
          reject(error);
        }
      })
  );
}

function commit(branchs, message = "") {
  return branchs.map(
    (name) =>
      new Promise((resolve, reject) => {
        try {
          const result = execSync(
            `cd ${name} && git commit -m "${message}"`
          ).toString();
          resolve(true);
        } catch (error) {
          resolve(error);
        }
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

function checkBranch(branchs, branch) {
  return branchs.map(
    (name) =>
      new Promise(async (resolve, reject) => {
        try {
          const result = execSync(
            `cd ${name} && git rev-parse --abbrev-ref HEAD`
          ).toString();
          if (result.trim() === branch) {
            resolve(true);
          } else {
            await cleans([name]);
            await checkout([name], branch);
          }
        } catch (error) {
          resolve(error);
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

function push(branchs) {
  return branchs.map(
    (name) =>
      new Promise((resolve, reject) => {
        try {
          const result = execSync(`cd ${name} && git push`).toString();
          resolve(true);
        } catch (error) {
          reject(error);
        }
      })
  );
}

class Store {
  static modules = [];

  constructor() {
    for (let i = 0; i < Store.modules.length; i++) {
      Store.modules[i].register(this);
    }
  }

  static reject(module) {
    Store.modules.push(module);
  }

  get repositories() {
    return this.Config.temp.repositories;
  }

  get branchs() {
    return this.Config.temp.branchs;
  }

  get current() {
    return this.Config.temp.current;
  }

  async run(type, name) {
    try {
      if (!this.current) {
        console.log(chalk.gray(`current branch not found`));
        return;
      }

      const [branch] = Object.values(this.branchs).filter(
        (b) => b.name === this.current
      );

      if (!branch) {
        console.log(chalk.gray(`branch ${this.current} not found`));
        return;
      }

      console.log(
        chalk.yellow(
          `projects: ${branch.repositories.join("、")} branch: ${branch.name}`
        )
      );
      branch.describe && console.log(`describe: ${branch.describe}`);

      await checkBranch(branch.repositories, branch.name);
      await addAll(branch.repositories);
      const message = await commitMessage();
      await commit(branch.repositories, `${branch.describe}${message}`);

      if (!branch.upstream) {
        await setUpstream(branch.repositories, branch.name);
      } else {
        await push(branch.repositories, branch.name);
      }
    } catch (error) {
      console.log(chalk.red(error));
    }
  }
}

Store.reject(new Config());

module.exports = new Store();
