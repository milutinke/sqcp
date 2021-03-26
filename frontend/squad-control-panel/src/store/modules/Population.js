import Vue from 'vue';

class PopulationUtils {
  static getTeamNameFromId(teams, id) {
    let team = teams.find((team) => team.teamID === id);
    return team ? team.name : 'Unknown Team';
  }
}

export default {
  namespaced: true,

  state: {
    population: null,
  },

  mutations: {
    set_population_mutation(state, payload) {
      state.population = payload;
    },
  },

  actions: {
    async fetch(state, payload) {
      try {
        const response = await Vue.axios.get(`${Vue.config.baseURL}/rcon/server-population`);

        state.commit('set_population_mutation', response.data.response);
      } catch (error) {
        throw error;
      }
    },
  },

  getters: {
    getTeams(state) {
      return state.population.teams;
    },

    getAllOnlinePlayers(state) {
      const players = [];

      state.population.teams.forEach((team) => {
        team.squads.forEach((squad) => {
          squad.players.forEach((player) => {
            players.push({
              ...player,
              squad: squad.name,
              team: team.name,
            });
          });
        });
      });

      state.population.players.onlinePlayers
        .filter((player) => !player.squadID || player.squadID === 'N/A')
        .forEach((player) => {
          let playerCopy = Object.assign(player);
          playerCopy.squadID = undefined;

          players.push({
            ...playerCopy,
            squad: 'Unassigned',
            team: PopulationUtils.getTeamNameFromId(state.population.teams, playerCopy.teamID),
          });
        });

      players.sort((player1, player2) => {
        if (player1.playerID < player2.playerID) return -1;

        if (player1.playerID > player2.playerID) return 1;

        return 0;
      });

      return players;
    },

    getOfflinePlayers(state) {
      const players = Array.from(state.population.players.disconnectedPlayers);

      players.sort((player1, player2) => {
        if (player1.playerID < player2.playerID) return -1;

        if (player1.playerID > player2.playerID) return 1;

        return 0;
      });

      return players;
    },

    getPlayersFromSquad(state) {
      return function (squadID) {
        const players = [];

        state.population.teams.forEach((team) => {
          team.squads.forEach((squad) => {
            squad.players.forEach((player) => {
              players.push({
                ...player,
                squad: squad.name,
                team: team.name,
              });
            });
          });
        });

        state.population.players.onlinePlayers
          .filter((player) => !player.squadID || player.squadID === 'N/A')
          .forEach((player) => {
            player.squadID = undefined;

            players.push({
              ...player,
              squad: 'Unassigned',
              team: PopulationUtils.getTeamNameFromId(state.population.teams, player.teamID),
            });
          });

        players.sort((player1, player2) => {
          if (player1.playerID < player2.playerID) return -1;

          if (player1.playerID > player2.playerID) return 1;

          return 0;
        });

        return players;
      };
    },

    getTeamsSquadsNames(state) {
      const teams = [];

      state.population.teams.forEach((team) => {
        const squads = [];

        team.squads.forEach((squad) => squads.push(squad.name));
        teams.push({
          team: team.name,
          squads: squads,
        });
      });

      return teams;
    },
  },
};
