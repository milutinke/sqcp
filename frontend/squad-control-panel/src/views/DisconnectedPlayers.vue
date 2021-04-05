<template>
  <div class="mt-12">
    <PlayersTable
      :table-title="`Disconnected Players (${this.players.length})`"
      tableType="disconnected"
      :players="players"
      :isLoading="isLoading"
    />

    <v-snackbar v-model="notification" bottom left color="blue" :timeout="notificationDuration">
      <v-icon color="white">mdi-check-bold</v-icon>
      {{ notificationText }}
    </v-snackbar>
  </div>
</template>

<script>
import PlayersTable from '@/components/PlayersTable.vue';

export default {
  name: 'DisconnectedPlayers',

  components: {
    PlayersTable,
  },

  data() {
    return {
      timer: null,
      players: [],
      isLoading: true,
      notification: false,
      notificationText: 'The disconnected players list has been updated',
      notificationDuration: 3000,
    };
  },

  async mounted() {
    await this.updatePlayerList();
    this.timer = setInterval(this.updatePlayerList, 15000);
    this.$root.$on('player_list_updated', this.playerListUpdated);
  },

  methods: {
    async updatePlayerList() {
      this.isLoading = true;
      await this.$store.dispatch('population/fetch');
      this.players = this.$store.getters['population/getOfflinePlayers'];
      this.isLoading = false;
      this.notification = true;
    },

    async playerListUpdated(player) {
      this.players = this.players.filter((player_) => player_.steamID !== player.steamID);
    },
  },

  async beforeDestroy() {
    if (this.timer) clearInterval(this.timer);
  },
};
</script>
