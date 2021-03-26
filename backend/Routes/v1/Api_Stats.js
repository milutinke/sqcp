const AuthMiddleware = require('../../Middleware/AuthMiddleware');
const { sequelize } = require('../../Models');

module.exports = (expressInstance) => {
  // WhoAmI
  expressInstance.get(
    '/api/v1/statistics',

    // Auth middleware
    AuthMiddleware.handle,

    async (req, res) => {
      res.json({
        statistics: {
          users: await sequelize.models.User.count(),
          serverRoles: await sequelize.models.Role.count(),
          serverAdmins: await sequelize.models.Admin.count(),
          bans: await sequelize.models.Ban.count(),
          actions: await sequelize.models.ActionLog.count(),
        },
      });
    }
  );
};
