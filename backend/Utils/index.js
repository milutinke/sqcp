const Config = require('../Config');
const Logger = require('./Logger');
const SquadRcon = require('../Rcon/SquadRcon');

class Utils {
  static async executeRcon(actionCallback, finishCallback) {
    const squadRcon = new SquadRcon(Config.RCON);

    try {
      await squadRcon.start();
      const response = await actionCallback(squadRcon);
      await squadRcon.stop();

      await finishCallback(response);
    } catch (error) {
      throw error;
    }
  }

  static async handleRconRequest(res, actionCallback) {
    try {
      await Utils.executeRcon(
        async (squadRcon) => await actionCallback(squadRcon),
        async (response) => {
          res.status(200).json({ response });
        }
      );
    } catch (error) {
      Logger.verbose('Express', 1, `ERROR: ${error.stack}`);
      return res.json({ error: error.message });
    }
  }

  static formatSequelizeError(error) {
    for (let i = 0; i < error.errors.length; i++) {
      let fieldName = error.errors[i].message.split('.')[1].split(' ')[0].trim();
      fieldName = fieldName[0].toUpperCase() + fieldName.substr(1);

      if (error.errors[i].type === 'notNull Violation') error.errors[i].message = fieldName + ' can not be empty!';
      else if (error.errors[i].type === 'unique violation') error.errors[i].message = fieldName + ' is alerady used!';
    }

    return error.errors[0].message;
  }
}

module.exports = Utils;
