// Taken from: https://github.com/Thomas-Smyth/SquadJS
// Author: Thomas Smyth

const chalk = require('chalk');

class Logger {
  constructor() {
    this.verboseness = {};
    this.colors = {};
  }

  verbose(module, verboseness, message, ...extras) {
    let colorFunc = chalk[this.colors[module] || 'white'];
    if (typeof colorFunc !== 'function') colorFunc = chalk.white;

    if ((this.verboseness[module] || 0) >= verboseness)
      console.log(`[${colorFunc(module)}][${verboseness}] ${message}`, ...extras);
  }

  setVerboseness(module, verboseness) {
    this.verboseness[module] = verboseness;
  }

  setColor(module, color) {
    this.colors[module] = color;
  }
}

module.exports = new Logger();
