const AuthMiddleware = require('../../Middleware/AuthMiddleware');
const SuperAdminMiddleware = require('../../Middleware/SuperAdminMiddleware');
const { sequelize } = require('../../Models');
const { ValidationError } = require('sequelize');
const Utils = require('../../Utils');
const Logger = require('../../Utils/Logger');
const moment = require('moment');

module.exports = (expressInstance) => {
  // Get Roles
  expressInstance.get(
    '/api/v1/server/roles',

    // Auth middleware
    AuthMiddleware.handle,

    // Super Admin Middleware
    SuperAdminMiddleware.handle,

    async (req, res) => res.json({ roles: await sequelize.models.Role.findAll({}) })
  );

  // Create a role
  expressInstance.post(
    '/api/v1/server/roles',

    // Auth middleware
    AuthMiddleware.handle,

    // Super Admin Middleware
    SuperAdminMiddleware.handle,

    async (req, res) => {
      const { name, permissions } = req.body;

      try {
        if (!name) throw new Error('You must provide a valid name for the role!');

        if (!permissions) throw new Error('You must provide valid permissions for the role!');

        const role = await sequelize.models.Role.create({ name: name.trim(), permissions: permissions.trim() });

        await sequelize.models.ActionLog.create({
          username: req.user.username,
          log: `Has created a new Role: "${name}" with permissions: "${permissions}"`,
        });

        res.status(201).json({ role });
      } catch (error) {
        console.log(error);

        // God damn Sequelize and their error format
        if (error instanceof ValidationError) error.message = 'Role with this name already exists!';

        if (error.message.includes('Validation error: '))
          error.message = error.message.replace('Validation error: ', '').trim();

        res.status(400).json({ error: error.message });
      }
    }
  );

  // Update a role
  expressInstance.put(
    '/api/v1/server/roles/:id',

    // Auth middleware
    AuthMiddleware.handle,

    // Super Admin Middleware
    SuperAdminMiddleware.handle,

    async (req, res) => {
      const { name, permissions } = req.body;

      try {
        if (!name) throw new Error('You must provide a valid name for the role!');

        if (!permissions) throw new Error('You must provide valid permissions for the role!');

        const role = await sequelize.models.Role.findOne({ where: { id: req.params.id } });

        if (!role) throw new Error('The requested role does not exists!');

        const copyOfRole = {
          name: role.name,
          permissions: role.permissions,
        };

        if (name !== role.name) role.name = name;

        if (permissions !== role.permissions) role.permissions = permissions;

        await role.save();

        let log = `Has updated the role "${copyOfRole.name}"`;

        if (name !== copyOfRole.name) log += ` name to "${name}"`;

        if (permissions !== copyOfRole.permissions)
          log += `${name !== copyOfRole.name ? ' and ' : ' '}permissions from "${
            copyOfRole.permissions
          }" to "${permissions}"`;

        await sequelize.models.ActionLog.create({
          username: req.user.username,
          log,
        });

        res.status(201).json({ role });
      } catch (error) {
        console.log(error);

        // God damn Sequelize and their error format
        if (error instanceof ValidationError) error.message = 'Role with this name already exists!';

        if (error.message.includes('Validation error: '))
          error.message = error.message.replace('Validation error: ', '').trim();

        res.status(400).json({ error: error.message });
      }
    }
  );

  // Delete a role
  expressInstance.delete(
    '/api/v1/server/roles/:id',

    // Auth middleware
    AuthMiddleware.handle,

    // Super Admin Middleware
    SuperAdminMiddleware.handle,

    async (req, res) => {
      try {
        const role = await sequelize.models.Role.findOne({ where: { id: req.params.id } });

        if (!role) throw new Error('The requested role already does not exists!');

        const roleCopy = Object.assign({}, role.dataValues);
        await role.destroy();
        await sequelize.models.ActionLog.create({
          username: req.user.username,
          log: `Has deleted the Role: "${role.name}"`,
        });

        res.json({ role: roleCopy });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
  );

  // Create an admin
  expressInstance.post(
    '/api/v1/server/admins',

    // Auth middleware
    AuthMiddleware.handle,

    // Super Admin Middleware
    SuperAdminMiddleware.handle,

    async (req, res) => {
      const { name, steamID, roleId } = req.body;

      try {
        if (!name) throw new Error('You must provide a valid name for the role!');

        if (!steamID) throw new Error('You must provide a valid Steam ID 64 for the role!');

        if (!roleId) throw new Error('You must provide valid permissions for the role!');

        if (!/\d/i.test(roleId)) throw new Error('roleID must be a number!');

        const role = await sequelize.models.Role.findOne({ where: { id: roleId } });

        if (!role) throw new Error('The provided role does not exists!');

        let admin = await sequelize.models.Admin.create({ name: name.trim(), steamID: steamID.trim(), RoleId: roleId });

        await sequelize.models.ActionLog.create({
          username: req.user.username,
          log: `Has added the Server Admin: "${name}" (Steam ID: ${steamID}) with a Role: "${role.name}"`,
        });

        let adminObjectClone = Object.assign({}, admin.dataValues);
        adminObjectClone.Role = { name: role.name };

        res.status(201).json({ admin: adminObjectClone });
      } catch (error) {
        // God damn Sequelize and their error format
        if (error instanceof ValidationError) error.message = 'There is already an admin using that name or steam id!';

        if (error.message.includes('Validation error: '))
          error.message = error.message.replace('Validation error: ', '').trim();

        res.status(400).json({ error: error.message });
      }
    }
  );

  // Edit an admin
  expressInstance.put(
    '/api/v1/server/admins/:id',

    // Auth middleware
    AuthMiddleware.handle,

    // Super Admin Middleware
    SuperAdminMiddleware.handle,

    async (req, res) => {
      const { name, steamID, roleId } = req.body;

      try {
        if (!name) throw new Error('You must provide a valid name for the role!');

        if (!steamID) throw new Error('You must provide a valid Steam ID 64 for the role!');

        if (!roleId) throw new Error('You must provide valid permissions for the role!');

        if (!/\d/i.test(roleId)) throw new Error('roleID must be a number!');

        const admin = await sequelize.models.Admin.findOne({
          where: { id: req.params.id },
          include: [sequelize.models.Role],
        });

        if (!admin) throw new Error('The requested admin does not exists!');

        const role = await sequelize.models.Role.findOne({ where: { id: roleId } });

        if (!role) throw new Error('The provided role does not exists!');

        const copyOfAdmin = {
          name: admin.name,
          steamID: admin.steamID,
          Role: admin.Role,
        };

        if (name !== admin.name) admin.name = name;

        if (steamID !== admin.steamID) admin.steamID = steamID;

        if (roleId !== admin.Role.id) admin.RoleId = roleId;

        await admin.save();

        let log = `Has updated the admin "${copyOfAdmin.name}"`;

        if (name !== copyOfAdmin.name) log += ` name to "${name}"`;

        if (steamID !== copyOfAdmin.steamID)
          log += `${name !== copyOfAdmin.name ? ' and ' : ' '}Steam ID from "${copyOfAdmin.steamID}" to "${steamID}"`;

        if (roleId !== copyOfAdmin.Role.id)
          log += `${name !== copyOfAdmin.name || steamID !== copyOfAdmin.steamID ? ' and ' : ' '}Role from "${
            copyOfAdmin.Role.name
          }" to "${role.name}"`;

        await sequelize.models.ActionLog.create({
          username: req.user.username,
          log,
        });

        let adminObjectClone = Object.assign({}, admin.dataValues);
        adminObjectClone.Role = role;

        res.status(201).json({ admin: adminObjectClone });
      } catch (error) {
        // God damn Sequelize and their error format
        if (error instanceof ValidationError) error.message = 'There is already an admin using that name or steam id!';

        if (error.message.includes('Validation error: '))
          error.message = error.message.replace('Validation error: ', '').trim();

        res.status(400).json({ error: error.message });
      }
    }
  );

  // Get Admins (Route for Squad Game)
  expressInstance.get(
    '/api/v1/server/admins/text',

    async (req, res) => {
      let response = '// ==================================== Roles ==================================== \r\n';

      const roles = await sequelize.models.Role.findAll({});

      for (let role of roles) response += `Group=${role.name}:${role.permissions}\r\n`;

      response += '\r\n';
      response += '// ==================================== Admins ==================================== \r\n';

      const admins = await sequelize.models.Admin.findAll({ include: [sequelize.models.Role] });

      for (let admin of admins) {
        response += `// ${admin.name}\r\n`;
        response += `Admin=${admin.steamID}:${admin.Role.name}\r\n\r\n`;
      }

      response += '\r\n';

      res.type('text/plain').send(response);
    }
  );

  // Get Admins (Route for Squad Control Panel)
  expressInstance.get(
    '/api/v1/server/admins/json',

    // Auth middleware
    AuthMiddleware.handle,

    // Super Admin Middleware
    SuperAdminMiddleware.handle,

    async (req, res) => res.json({ admins: await sequelize.models.Admin.findAll({ include: [sequelize.models.Role] }) })
  );

  // Delete an admin
  expressInstance.delete(
    '/api/v1/server/admins/:id',

    // Auth middleware
    AuthMiddleware.handle,

    // Super Admin Middleware
    SuperAdminMiddleware.handle,

    async (req, res) => {
      try {
        const admin = await sequelize.models.Admin.findOne({ where: { id: req.params.id } });

        if (!admin) throw new Error('The requested admin already does not exists!');

        const adminObjectClone = Object.assign({}, admin.dataValues);
        await admin.destroy();
        await sequelize.models.ActionLog.create({
          username: req.user.username,
          log: `Has deleted the Admin: "${adminObjectClone.name}"`,
        });

        res.json({ admin: adminObjectClone });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
  );

  // Actions
  expressInstance.post(
    '/api/v1/server/action',

    // Auth middleware
    AuthMiddleware.handle,

    async (req, res) => {
      const { action, reason, player, duration, squad, team } = req.body;

      if (!action || (action && action.trim().length === 0))
        return res.json({ error: 'Please provide the action in the POST request body!' });

      if ((action === 'ban' || action === 'kick' || action === 'warn' || action === 'move') && !player)
        return res.json({ error: 'Please provide the player in the POST request body!' });

      if (action === 'disband' && !squad)
        return res.json({ error: 'Please provide the squad in the POST request body!' });

      if (action === 'disband' && !team)
        return res.json({ error: 'Please provide the team in the POST request body!' });

      if (action !== 'move' && !reason)
        return res.json({ error: 'Please provide the reason in the POST request body!' });

      let log;
      let success;

      Logger.verbose('Express', 1, `Get a new request for Action "${action}" with data: ${JSON.stringify(req.body)}`);

      switch (action) {
        case 'kick':
          log = `Kicked the player: "${player.name}" (Steam ID: ${player.steamID}) for reason: "${reason}"`;

          await Utils.executeRcon(
            async (squadRcon) =>
              await squadRcon.execute(
                `AdminKick "${player.steamID}" "Kicked for: '${reason}' - Kicked By: '${req.user.name}'"`
              ),
            async (result) => (success = result.includes('was kicked'))
          );

          break;

        case 'ban':
          if (!duration)
            return res.json({ error: 'Please provide the valid duraiton for the ban in the POST request body!' });

          let realDuration = 0;

          try {
            realDuration = parseInt(duration);

            if (realDuration > 0) realDuration = Math.floor(Date.now() / 1000) + realDuration * 86400; // Unix timestamp
          } catch (error) {
            return res.status(400).json({ error: 'Failed to conver the duration to an integer!' });
          }

          try {
            await sequelize.models.Ban.create({
              name: player.name,
              steamID: player.steamID,
              duration: realDuration,
              bannedBy: req.user.name,
              reason,
            });
          } catch (error) {
            // God damn Sequelize and their error format
            if (error instanceof ValidationError) error.message = 'This player has already been banned!';

            if (error.message.includes('Validation error: '))
              error.message = error.message.replace('Validation error: ', '').trim();

            return res.status(400).json({ error: error.message });
          }

          log = `Banned the player: "${player.name}" (Steam ID: ${player.steamID}) on "${duration}" for reason: "${reason}"`;

          const time = realDuration <= 0 ? 'pernamently' : `${duration} days`;

          if (!player.sinceDisconnect)
            await Utils.executeRcon(
              async (squadRcon) =>
                await squadRcon.execute(
                  `AdminKick "${player.steamID}" "Banned for: '${reason}' (${time}) - Banned By: '${req.user.name}'"`
                ),
              async (result) => (success = result.includes('was kicked'))
            );
          else success = true;

          break;

        case 'warn':
          log = `Warned the player: "${player.name}" (Steam ID: ${player.steamID}) with reason: "${reason}"`;

          await Utils.executeRcon(
            async (squadRcon) => await squadRcon.execute(`AdminWarn "${player.steamID}" "${reason}"`),
            async (result) => (success = result.includes('has warned'))
          );

          break;

        case 'move':
          log = `Moved the player: "${player.name}" (Steam ID: ${player.steamID}) to opposite team`;

          await Utils.executeRcon(
            async (squadRcon) => await squadRcon.execute(`AdminForceTeamChange "${player.steamID}"`),
            async (result) => (success = result.includes('Forced team change'))
          );

          if (success) {
            await Utils.executeRcon(
              async (squadRcon) =>
                await squadRcon.execute(`AdminWarn "${player.steamID}" "You have been moved to another team!"`),
              async (result) => {}
            );
          }

          break;

        case 'disband':
          log = `Disbanded squad: "${squad.name}" (ID: "${squad.squadID}") in team "${team.name}" (ID: ${team.teamID}) with reason: "${reason}"`;

          await Utils.executeRcon(
            async (squadRcon) => await squadRcon.execute(`AdminDisbandSquad "${team.teamID}" "${squad.squadID}"`),
            async (result) => (success = result.includes('Remote admin disbanded'))
          );

          break;
      }

      await sequelize.models.ActionLog.create({
        username: req.user.username,
        log,
      });

      res.status(200).json({ success });
    }
  );

  // Get action logs
  expressInstance.get(
    '/api/v1/server/logs',

    // Auth middleware
    AuthMiddleware.handle,

    // Super Admin Middleware
    SuperAdminMiddleware.handle,

    async (req, res) =>
      res.json({
        logs: await sequelize.models.ActionLog.findAll({
          order: [['createdAt', 'ASC']],
        }),
      })
  );

  // Get Bans (For Panel)
  expressInstance.get(
    '/api/v1/server/bans/json',

    // Auth middleware
    AuthMiddleware.handle,

    // Super Admin Middleware
    SuperAdminMiddleware.handle,

    async (req, res) => {
      const fetchedBans = await sequelize.models.Ban.findAll({});
      const bans = [];

      for (let ban of fetchedBans) {
        let copyOfBan = Object.assign({}, ban.dataValues);

        if (copyOfBan.duration === 0) {
          copyOfBan.lengthInDays = 0;
          bans.push(copyOfBan);
          continue;
        }

        copyOfBan.lengthInDays = Math.abs(
          Math.floor((copyOfBan.duration - moment(copyOfBan.createdAt).unix()) / 60 / 60 / 24)
        );
        bans.push(copyOfBan);
      }

      res.json({ bans });
    }
  );

  // Get Bans (For the Server)
  // TODO: Improve with caching
  expressInstance.get(
    '/api/v1/server/bans/text',

    async (req, res) => {
      const bans = await sequelize.models.Ban.findAll({});
      let response = '';

      for (const ban of bans) {
        if (ban.duration !== 0 && ban.duration < Math.floor(Date.now() / 1000)) {
          await ban.destroy();
          continue;
        }

        response += `${ban.steamID}:${ban.duration} // Reason: ${ban.reason} - Banned by: ${ban.bannedBy} - Unban/Complaints: discord.link/bsf\r\n`;
      }

      res.type('text/plain').send(response);
    }
  );

  // Remove a ban
  expressInstance.delete(
    '/api/v1/server/bans/:id',

    // Auth middleware
    AuthMiddleware.handle,

    // Super Admin Middleware
    SuperAdminMiddleware.handle,

    async (req, res) => {
      const ban = await sequelize.models.Ban.findOne({ where: { id: req.params.id } });

      if (!ban) return res.status(404).json({ error: 'Ban with that id does not exists!' });

      await sequelize.models.ActionLog.create({
        username: req.user.username,
        log: `Unbanned player: ${ban.name} (Steam ID: ${ban.steamID})`,
      });

      await ban.destroy();
      res.json({ success: true });
    }
  );

  // Edit a ban
  expressInstance.put(
    '/api/v1/server/bans/:id',

    // Auth middleware
    AuthMiddleware.handle,

    // Super Admin Middleware
    SuperAdminMiddleware.handle,

    async (req, res) => {
      const { name, steamID, lengthInDays, reason } = req.body;

      const foundBan = await sequelize.models.Ban.findOne({ where: { id: req.params.id } });

      if (!foundBan) return res.status(404).json({ error: 'Ban with that id does not exists!' });

      try {
        // Doing undefined and null check because we can have 0
        if (lengthInDays === undefined || lengthInDays === null)
          throw new Error('Please provide a duration field in PUT request body!');

        if (!reason) throw new Error('Please provide a reason field in PUT request body!');

        if (reason && typeof reason === 'string' && reason.trim().length === 0)
          throw new Error('Please provide a valid reason!');

        let lengthInt;

        try {
          lengthInt = parseInt(lengthInDays);
        } catch (error2) {
          throw new Error('lengthInDays field must be a valid number!');
        }

        let newDuration = lengthInt === 0 ? 0 : moment(foundBan.createdAt).unix() + lengthInt * 86400;
        let log = `Changed player: ${foundBan.name} (Steam ID: ${foundBan.steamID})`;
        let changedParts = 0;

        if (foundBan.name !== name) {
          foundBan.name = name;
          log += ` name from "${foundBan.name}" to "${name}"`;
          changedParts++;
        }

        if (foundBan.steamID !== steamID) {
          foundBan.steamID = steamID;
          log += ` ${changedParts > 0 ? 'and ' : ''}Steam ID from "${foundBan.steamID}" to "${steamID}"`;
          changedParts++;
        }

        if (foundBan.duration !== newDuration) {
          foundBan.duration = newDuration;
          log += ` ${changedParts > 0 ? 'and ' : ''}duration from "${
            foundBan.duration === 0 ? 'Pernament' : moment(foundBan.duration).utc().format('DD/MM/YYYY HH:mm:ss')
          }" to "${newDuration === 0 ? 'Pernament' : moment(newDuration).utc().format('DD/MM/YYYY HH:mm:ss')}"`;
          changedParts++;
        }

        if (foundBan.reason !== reason) {
          log += ` ${changedParts > 0 ? 'and ' : ''}reason from "${foundBan.reason}" to "${reason}"`;
          foundBan.reason = reason;
          changedParts++;
        }

        await foundBan.save();

        await sequelize.models.ActionLog.create({
          username: req.user.username,
          log: log,
        });

        res.json({ success: true });
      } catch (error) {
        // God damn Sequelize and their error format
        if (error instanceof ValidationError)
          error.message =
            'You either did not enter name, duration or reason correctly or you are trying to use Steam ID of another player who was banned!';

        res.status(400).json({ error: error.message });
      }
    }
  );
};
