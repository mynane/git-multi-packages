#!/usr/bin/env node

const program = require("commander");
const chalk = require("chalk");
const xu = require("../src/generate");
const init = require("../src/init");

/**
 * Usage.
 */
program
  .command("init")
  .option("-f, --force", "force initialize")
  .description("initialize your project")
  .alias("i")
  .action(function (type, name) {
    init.run(type, name);
  });
