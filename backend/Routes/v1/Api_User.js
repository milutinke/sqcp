const AuthMiddleware = require('../../Middleware/AuthMiddleware');
const SuperAdminMiddleware = require('../../Middleware/SuperAdminMiddleware');
const { sequelize } = require('../../Models');

module.exports = (expressInstance) => {
  // WhoAmI
  expressInstance.get(
    '/api/v1/user/whoami',

    // Auth middleware
    AuthMiddleware.handle,

    async (req, res) => res.json({ user: req.user })
  );

  // Add a user
  expressInstance.post(
    '/api/v1/user/add',

    // Auth middleware
    AuthMiddleware.handle,

    // Super Admin Middleware
    SuperAdminMiddleware.handle,

    async (req, res) => {
      let { name, username, password, confirmPassword, isSuperAdmin } = req.body;

      isSuperAdmin = !isSuperAdmin ? false : isSuperAdmin;

      try {
        if (!name) throw new Error('You must provide a valid name!');

        if (!username) throw new Error('You must provide a valid username!');

        if (!password) throw new Error('You must provide a valid password!');

        if (!confirmPassword) throw new Error('You must confirm the password!');

        if (password && (password.length < 3 || password.length > 16))
          throw new Error('The password must be between 3 and 16 characters long!');

        if (password && !/^[a-zA-Z0-9]+$/.test(password))
          throw new Error('Password can contain only English alphabet letters and numbers!');

        if (password !== confirmPassword) throw new Error('Passwords do not match!');

        if (await sequelize.models.User.findOne({ where: { username } }))
          throw new Error('User with this username already exists!');

        const user = await sequelize.models.User.create({
          name,
          username,
          password,
          isSuperAdmin,
        });

        user.password = undefined;

        await sequelize.models.ActionLog.create({
          username: req.user.username,
          log: `Has created a new User: "${name}", with username: "${username}" as "${
            isSuperAdmin ? 'Super Admin' : 'Normal Admin'
          }".`,
        });

        res.json({ user });
      } catch (error) {
        if (error.message.includes('Validation error: '))
          error.message = error.message.replace('Validation error: ', '').trim();

        res.status(400).json({ error: error.message });
      }
    }
  );

  // List of users
  expressInstance.get(
    '/api/v1/user/list',

    // Auth middleware
    AuthMiddleware.handle,

    // Super Admin Middleware
    SuperAdminMiddleware.handle,

    async (req, res) => {
      res.json({
        users: await sequelize.models.User.findAll({
          attributes: ['id', 'name', 'username', 'isSuperAdmin'],
        }),
      });
    }
  );

  // Update
  expressInstance.put(
    '/api/v1/user/:id',

    // Auth middleware
    AuthMiddleware.handle,

    // Super Admin Middleware
    SuperAdminMiddleware.handle,

    async (req, res) => {
      let { name, username, password, confirmPassword, isSuperAdmin } = req.body;

      try {
        if (!name) throw new Error('You must provide a valid name!');

        if (!username) throw new Error('You must provide a valid username!');

        if (password && password.trim().length > 0) {
          if (password.length < 3 || password.length > 16)
            throw new Error('The password must be between 3 and 16 characters long!');

          if (!(/([a-zA-Z0-9]+)/.test(password)))
            throw new Error('Password can contain only English alphabet letters and numbers!');

          if (!confirmPassword || !(confirmPassword && confirmPassword.trim().length > 0))
            throw new Error('You must confirm the password!');
          else {
            if (password !== confirmPassword) throw new Error('Passwords do not match!');
          }
        }

        isSuperAdmin = !isSuperAdmin ? false : isSuperAdmin;

        const user = await sequelize.models.User.findOne({
          where: { id: req.params.id },
        });

        if (!user) throw new Error('User does not exists!');

        const userObjectClone = Object.assign({}, user.dataValues);

        let log = `Has updated the user "${userObjectClone.name}"`;

        if (user.name !== name) {
          log += ` name to "${name}"`;
          user.name = name;
        }

        if (user.username !== username) {
          log += `${user.name !== name ? ' and ' : ' '}username from "${userObjectClone.name}" to "${username}"`;
          user.username = username;
        }

        if (password && password.trim().length > 0) {
          log += `${user.name !== name || user.username !== username ? ' and ' : ' '}password`;
          user.password = password;
        } else user.__noChange = true;

        if (user.isSuperAdmin !== isSuperAdmin) {
          log += `${
            user.name !== name || user.username !== username || user.password !== password ? ' and ' : ' '
          }admin status from "${userObjectClone.isSuperAdmin ? 'Super Admin' : 'Admin'}" to "${
            isSuperAdmin ? 'Super Admin' : 'Admin'
          }"`;
          user.isSuperAdmin = isSuperAdmin;
        }

        let modifiedUser = await user.save();

        modifiedUser.password = undefined;

        await sequelize.models.ActionLog.create({
          username: req.user.username,
          log,
        });

        res.json({ user });
      } catch (error) {
        if (error.message.includes('Validation error: '))
          error.message = error.message.replace(/Validation error: /g, '').trim();

        res.status(400).json({ error: error.message });
      }
    }
  );

  // Delete
  expressInstance.delete(
    '/api/v1/user/:id',

    // Auth middleware
    AuthMiddleware.handle,

    // Super Admin Middleware
    SuperAdminMiddleware.handle,

    async (req, res) => {
      try {
        const user = await sequelize.models.User.findOne({
          where: { id: req.params.id },
        });

        if (!user) throw new Error('The requested user already does not exists!');

        const userObjectClone = Object.assign({}, user.dataValues);
        userObjectClone.password = undefined;
        await user.destroy();

        await sequelize.models.ActionLog.create({
          username: req.user.username,
          log: `Has deleted the user: "${userObjectClone.name}", with username: "${
            userObjectClone.username
          }" who was a "${userObjectClone.isSuperAdmin ? 'Super Admin' : 'Normal Admin'}".`,
        });

        res.json({ user: userObjectClone });
      } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
      }
    }
  );
};
