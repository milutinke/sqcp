const { sequelize } = require('../Models');
const chalk = require('chalk');

(async () => {
      try {
        if (await sequelize.models.User.findOne({ where: { username: "admin" } }))
          throw new Error('You already have the default admin account generated!');

        await sequelize.models.User.create({
          name: "Default Admin",
          username: "admin",
          password: "admin",
          isSuperAdmin: true,
        });

        await sequelize.models.ActionLog.create({
          username: "System",
          log: `Has created a new user: "Default Admin", with username: "admin" as "Super Admin".`,
        });

        console.log(chalk.greenBright(`Created a default users with credentials:\n\nUsername: ${chalk.cyanBright('admin')}\nPassword: ${chalk.cyanBright('admin')}`));
      } catch (error) {
        console.log(chalk.bgRed(chalk.white(`ERROR: ${error.message}`)));
      } finally {
        process.exit();
      }
    }
)();