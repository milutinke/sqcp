class SuperAdminMiddleware {
  async handle(req, res, next) {
    if (!req.user.isSuperAdmin) return res.status(403).json({ forbidden: true, error: 'Insufficent permissions!' });

    next();
  }
}

module.exports = new SuperAdminMiddleware();
