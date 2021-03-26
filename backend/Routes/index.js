const FileSystem = require('fs');
const Path = require('path');
const Config = require('../Config');
const Logger = require('../Utils/Logger');

module.exports = (expressInstance) => {
  Config.API_VERSIONS.forEach((apiVersion) => {
    FileSystem.readdirSync(Path.join(process.cwd(), 'Routes', apiVersion))
      .filter((file) => !(file === 'index.js' || file.substr(file.lastIndexOf('.') + 1) !== 'js'))
      .forEach((file) => {
        Logger.verbose('Express', 1, `Registered routes from: ${apiVersion}/${file}`);
        require(`./${apiVersion}/${file.substr(0, file.lastIndexOf('.'))}`)(expressInstance);
      });
  });
};
