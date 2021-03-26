const Config = require('../../Config');
const { sequelize } = require('../../Models');
const JWT = require('jsonwebtoken');
const Logger = require('../../Utils/Logger');

module.exports = (expressInstance) => {
  // Login
  expressInstance.post(
    '/api/v1/auth/login',

    async (req, res) => {
      const { username, password } = req.body;

      try {
        if (!username) throw new Error('You must provide a valid username!');

        if (!password) throw new Error('You must provide a valid password!');

        const user = await sequelize.models.User.findOne({ where: { username } });

        if (!user) throw new Error('User with this username does not exists!');

        if (!(await sequelize.models.User.comparePasswords(user, password))) throw new Error('Wrond password!');

        // Remove the password from the response
        user.password = undefined;

        JWT.sign(
          { user },
          Config.JWT.Secret,
          { algorithm: Config.JWT.Algorithm, expiresIn: Config.JWT.Expiration },
          (error, token) => {
            if (error) {
              Logger.verbose('JWT', 1, `ERROR: ${error}`);
              throw new Error('Could not sing a JWT token, please try again later!');
            }

            res.json({
              user,
              token,
            });
          }
        );
      } catch (error) {
        if (error.message.includes('Validation error: '))
          error.message = error.message.replace('Validation error: ', '').trim();

        res.status(401).json({ error: error.message });
      }
    }
  );
};
