// The original has been taken from: https://github.com/SquadMS/SquadMS-RCON-Worker
// Authors: Thomas Smyth, Marcel Davis, Dusan Milutinovic

const Rcon = require('./Rcon');
const Logger = require('../Utils/Logger');

class SquadRcon extends Rcon {
  constructor(options = {}) {
    super(options);

    this.keepAlive = this.keepAlive.bind(this);
  }

  async start() {
    await this.connect();
    //await this.keepAlive();
  }

  async stop() {
    if (this.keepAliveTimeout) {
      clearTimeout(this.keepAliveTimeout);
    }

    try {
      await this.disconnect();
    } catch (e) {
      Logger.verbose('SquadRcon', 1, `Could not disconnect RCON during stop.`);
    }
  }

  async getCurrentMap() {
    const response = await this.execute('ShowCurrentMap');
    const match = response.match(/^Current level is (.*), layer is (.*)/);
    return { level: match[1], layer: match[2] };
  }

  async getNextMap() {
    const response = await this.execute('ShowNextMap');
    const match = response.match(/^Next level is (.*), layer is (.*)/);

    return {
      level: match[1] !== '' ? match[1] : null,
      layer: match[2] !== 'To be voted' ? match[2] : null,
    };
  }

  async getServerPopulation() {
    const response = await this.execute('ListSquads');
    const players = await this.getListPlayers();

    let teams = [];
    let tempSquads = [];
    let currentTeam = null;

    for (const line of response.split('\n')) {
      const matchTeam = line.match(/^Team ID: ([1|2]) \((.*)\)/);

      if (matchTeam) {
        currentTeam = {
          teamID: matchTeam[1],
          name: matchTeam[2],
          squads: [],
        };

        teams.push(currentTeam);
        continue;
      }

      const matchSquad = line.match(/^ID: (\d{1,}) \| Name: (.*?) \| Size: (\d) \| Locked: (True|False)/);
      if (!matchSquad) continue;

      tempSquads.push({
        squadID: matchSquad[1],
        teamID: currentTeam.teamID,
        name: matchSquad[2],
        size: matchSquad[3],
        locked: matchSquad[4] === 'True' ? true : false,
        players: [],
      });
    }

    // Put it all together
    for (let squad of tempSquads) {
      // Populate Squad with Players
      for (let player of players.onlinePlayers) {
        if (player.squadID === squad.squadID && player.teamID === squad.teamID) {
          squad.players.push({
            playerID: player.playerID,
            steamID: player.steamID,
            name: player.name,
          });
        }
      }

      // Populate Team with Squads
      for (let team of teams) {
        if (squad.teamID === team.teamID) {
          team.squads.push({
            squadID: squad.squadID,
            name: squad.name,
            size: squad.size,
            locked: squad.locked,
            players: squad.players,
          });
        }
      }
    }

    return {
      teams,
      players: {
        onlinePlayers: players.onlinePlayers,
        disconnectedPlayers: players.disconnectedPlayers,
      },
    };
  }

  async getListPlayers() {
    const response = await this.execute('ListPlayers');

    const onlinePlayers = [];
    const disconnectedPlayers = [];

    for (const line of response.split('\n')) {
      const matchedOnline = line.match(
        /ID: ([0-9]+) \| Online IDs: EOS: (\w{32}) steam: (\d{17}) \| Name: (.+) \| Team ID: ([0-9]+) \| Squad ID: ([0-9]+|N\/A)/
      );
      const matchedDisconnected = line.match(
        /^ID: (\d{1,}) \| Online IDs: EOS: (\w{32}) steam: (\d{17}) \| Since Disconnect: (\d{2,})m.(\d{2})s \| Name: (.*?)$/
      );

      if (matchedOnline) {
        onlinePlayers.push({
          playerID: matchedOnline[1],
          eosID: matchedOnline[2],
          steamID: matchedOnline[3],
          name: matchedOnline[4],
          teamID: matchedOnline[5],
          squadID: matchedOnline[6] !== 'N/A' ? matchedOnline[6] : null,
        });
      } else if (matchedDisconnected) {
        disconnectedPlayers.push({
          playerID: matchedDisconnected[1],
          eosID: matchedDisconnected[2],
          steamID: matchedDisconnected[3],
          name: matchedDisconnected[6],
          sinceDisconnect: `${matchedDisconnected[4]}m ${matchedDisconnected[5]}s`,
        });
      }
    }

    return {
      onlinePlayers,
      disconnectedPlayers,
    };
  }

  async getListLayers() {
    const response = await this.execute('ListLayers');
    return response.split('\n').filter((layer) => !layer.includes('List of available layers'));
  }

  async keepAlive() {
    if (this.keepAliveTimeout) clearTimeout(this.keepAliveTimeout);

    Logger.verbose('SquadRcon', 1, `Sending KeepAlive Command`);

    try {
      this.players = await this.getListPlayers();
    } catch (err) {
      Logger.verbose('SquadRcon', 1, 'Failed to keep alive.', err);
    }

    this.keepAliveTimeout = setTimeout(this.keepAlive, 30 * 1000);
  }
}

module.exports = SquadRcon;
