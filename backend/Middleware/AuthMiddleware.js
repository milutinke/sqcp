const JWT = require('jsonwebtoken');
const Config = require('../Config');
const { sequelize } = require('../Models');

class AuthMiddleware {
  async handle(req, res, next) {
    if (
      !req.headers.authorization ||
      (req.headers.authorization && !req.headers.authorization.toLowerCase().startsWith('bearer '))
    )
      return res.status(401).json({ forbidden: true, error: 'Please provide a valid Authorization header' });

    const token = req.headers.authorization.trim().split(' ')[1];

    if (!token || (token && token.length === 0))
      return res.status(401).json({
        forbidden: true,
        error: 'You have provided the Authorization header, but the format does not match the: Bearer <token>',
      });

    JWT.verify(token, Config.JWT.Secret, async (error, decoded) => {
      if (error) {
        let errorMessage =
          error instanceof JWT.TokenExpiredError ? 'Your session has expired!' : 'Mailformed token provided!';
        return res.status(401).json({ forbidden: true, error: errorMessage });
      }

      const dbUser = await sequelize.models.User.findOne({ where: { id: decoded.user.id } });

      if (!dbUser) return res.status(401).json({ forbidden: true, error: 'Invalid or deleted user!' });

      dbUser.password = undefined;
      req.user = dbUser;
      next();
    });
  }
}

module.exports = new AuthMiddleware();
