#!/usr/bin/env node

const program = require("commander");
const store = require("../src/store");

/**
 * Usage.
 */
program
  .command("store")
  .description("store data")
  .alias("s")
  .action(function (type, name) {
    store.run(type, name);
  });
