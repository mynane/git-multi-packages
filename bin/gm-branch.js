#!/usr/bin/env node

const program = require("commander");
const branch = require("git-multi-packages/src/branch");

/**
 * Usage.
 */
program
  .command("branch")
  .description("switch branches")
  .option("-n, --name <name>", "branch name")
  .option("-u, --upstream", "--set-upstream")
  .option("-r, --remove <name>", "remove branch")
  .alias("b")
  .action(function (type, name) {
    branch.run(type, name);
  });
