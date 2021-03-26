const Express = require('express');
const Logger = require('./Utils/Logger');
const Config = require('./Config');
const Cors = require('cors');
const Path = require('path');
const History = require('connect-history-api-fallback');

class App {
  constructor() {
    this.express = null;

    this.configureLogger();
    this.configureExpress();
    this.startExpress();
  }

  configureLogger() {
    // Configure the logger
    for (let module in Config.LOGGER_MODULES) {
      Logger.setVerboseness(module, Config.LOGGER_MODULES[module].verboseness);
      Logger.setColor(module, Config.LOGGER_MODULES[module].color);
    }
  }

  configureExpress() {
    this.express = Express();

    // Middlewares
    this.express.use(Cors());

    // Router
    this.express.use(Express.json());
    require('./Routes')(this.express);

    // Static files
    this.express.use('/js', Express.static(Path.join(__dirname, '/dist/js')));
    this.express.use('/css', Express.static(Path.join(__dirname, '/dist/css')));
    this.express.use('/', Express.static(Path.join(__dirname, '/dist')));

    this.express.use(History());

    // Double (fixes bug with connect-history-api-fallback)
    this.express.use('/js', Express.static(Path.join(__dirname, '/dist/js')));
    this.express.use('/css', Express.static(Path.join(__dirname, '/dist/css')));
    this.express.use('/', Express.static(Path.join(__dirname, '/dist')));
  }

  startExpress() {
    this.express.listen(Config.EXPRESS_PORT, () =>
      Logger.verbose('Express', 1, `Listening on port: ${Config.EXPRESS_PORT}`)
    );
  }
}

new App();
