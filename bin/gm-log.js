#!/usr/bin/env node

const program = require("commander");
const chalk = require("chalk");
const log = require("../src/log");

/**
 * Usage.
 */
program
  .command("log")
  .description("show the branch lists")
  .alias("l")
  .action(function (type, name) {
    log.run(type, name);
  });
