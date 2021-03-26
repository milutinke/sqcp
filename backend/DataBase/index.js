// Libraries
const Sequelize = require('sequelize');
const Config = require('../Config');
const Logger = require('../Utils/Logger');

// Connection CLass
class Connection {
  constructor() {
    this.establish();
    this.auth();
  }

  establish() {
    this.connection = new Sequelize(Config.DATABASE.database, Config.DATABASE.user, Config.DATABASE.password, {
      host: Config.DATABASE.host,
      port: Config.DATABASE.port,
      dialect: Config.DATABASE.dialect,
      logging: Config.MODE === 'production' ? false : true,

      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    });
  }

  auth() {
    this.connection
      .authenticate()
      .then(() => Logger.verbose('DataBase', 1, 'Data Base Connection Successfully Established'))
      .catch((error) => {
        Logger.verbose('DataBase', 1, `Failed to connect to the Data Base: ${error}`);
        process.exit(0);
      });
  }

  getConnection() {
    return this.connection;
  }
}

// Module Exports
module.exports = new Connection().getConnection();
