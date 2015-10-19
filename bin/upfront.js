#!/usr/bin/env node

'use strict';

var path = require('path');
var CWD = path.resolve('..');
var ROOT_PATH = path.resolve(__dirname, '..');

var argv = require('minimist')(process.argv.slice(2));
var components = require(path.resolve(ROOT_PATH, 'lib/components'));


var defaults = require(path.resolve(ROOT_PATH, 'defaults.json'));

var projectOptions = {};

try {
  projectOptions = require(path.resolve(ROOT_PATH, 'styleguide.json'));
} catch (e) {
  console.log("No project config given, running with defaults", defaults);
}


var options = Object.assign({
  cwd: CWD
}, defaults, projectOptions);

var Cli = {
  run(args) {
    console.log("Cli::run");
    console.log("with Args", args);
    console.log("and Options", options);

    var componentConfig = components.search();
  }
};

Cli.run(argv._);
