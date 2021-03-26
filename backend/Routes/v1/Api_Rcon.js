const AuthMiddleware = require('../../Middleware/AuthMiddleware');
const SuperAdminMiddleware = require('../../Middleware/SuperAdminMiddleware');
const Logger = require('../../Utils/Logger');
const Utils = require('../../Utils');
const { sequelize } = require('../../Models');

module.exports = (expressInstance) => {
  // Execute raw RCON commands
  expressInstance.post(
    '/api/v1/rcon/execute',

    // Auth middleware
    AuthMiddleware.handle,

    // Super Admin Middleware
    SuperAdminMiddleware.handle,

    async (req, res) => {
      const { command } = req.body;

      if (!command || (command && command.trim().length === 0))
        return res.json({
          error: 'Please provide the command in the POST request body!',
        });

      Logger.verbose('Express', 1, `Get a new request for Command Execution with data: ${req.body.command}`);

      await sequelize.models.ActionLog.create({
        username: req.user.username,
        log: `Has executed a RCON command: '${command}'`,
      });

      await Utils.handleRconRequest(res, async (squadRcon) => await squadRcon.execute(req.body.command));
    }
  );

  // Get the server population
  expressInstance.get(
    '/api/v1/rcon/server-population',

    async (req, res) => {
      Logger.verbose('Express', 1, `Get a new request for Server population`);
      await Utils.handleRconRequest(res, async (squadRcon) => await squadRcon.getServerPopulation());
    }
  );

  // Get offline players
  expressInstance.get(
    '/api/v1/rcon/disconnected-players',

    async (req, res) => {
      Logger.verbose('Express', 1, `Get a new request for disconnected players`);
      await Utils.handleRconRequest(res, async (squadRcon) => await squadRcon.getListDisconnectedPlayers());
    }
  );

  // Get the current and the next map and layer
  expressInstance.get(
    '/api/v1/rcon/layer',

    async (req, res) => {
      Logger.verbose('Express', 1, `Get a new request for Server current map, layer and next map and layer`);
      await Utils.handleRconRequest(res, async (squadRcon) => {
        return {
          current: await squadRcon.getCurrentMap(),
          next: await squadRcon.getNextMap(),
        };
      });
    }
  );
};
