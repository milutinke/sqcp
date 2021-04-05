<template>
  <div class="mt-12">
    <v-card>
      <v-card-title> Teams and Squads in them </v-card-title>

      <v-card-text>
        <v-card class="elevation-1" v-for="(team, teamIndex) of teams" :key="teamIndex">
          <v-card-title> {{ team.teamID }}. {{ team.name }} </v-card-title>

          <v-card-text>
            <PlayersTable
              v-for="(squad, squadIndex) of team.squads"
              :key="squadIndex"
              :table-title="squad.squadID + `. Squad: ` + squad.name.toUpperCase()"
              tableType="all-online"
              :players="squad.players"
              :isLoading="isLoading"
              :squad="squad"
              :team="team"
            />
          </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>

    <v-snackbar v-model="notification" bottom left color="blue" :timeout="notificationDuration">
      <v-icon color="white">mdi-check-bold</v-icon>
      {{ notificationText }}
    </v-snackbar>
  </div>
</template>

<script>
import PlayersTable from '@/components/PlayersTable.vue';

export default {
  name: 'SquadsPage',

  components: {
    PlayersTable,
  },

  data() {
    return {
      timer: null,
      teams: [],
      isLoading: true,
      notification: false,
      notificationText: 'The teams and squads list has been updated',
      notificationDuration: 3000,
    };
  },

  async mounted() {
    await this.updateSquadList();
    this.timer = setInterval(this.updateSquadList, 15000);

    this.$root.$on('squad_list_updated', this.updateSquadList);
    this.$root.$on('player_list_updated', this.updateSquadPlayerList);
  },

  methods: {
    async updateSquadList() {
      this.isLoading = true;
      await this.$store.dispatch('population/fetch');
      this.teams = this.$store.getters['population/getTeams'];
      this.isLoading = false;
      this.notification = true;
    },

    updateSquadPlayerList(player) {
      this.teams.forEach((team) => {
        team.squads.forEach((squad) => {
          squad.players = squad.players.players.filter((player_) => player_.steamID !== player.steamID);
        });
      });
    },
  },

  async beforeDestroy() {
    if (this.timer) clearInterval(this.timer);
  },
};
</script>
