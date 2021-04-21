#!/usr/bin/env node
const program = require("commander");
process.title = "gm";

program.version(require("../package").version).usage("<command> [options]");

// require("./gm-generate");
require("./gm-init");
require("./gm-branch");
require("./gm-log");
require("./gm-store");

program.parse(process.argv);
