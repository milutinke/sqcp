<template>
  <div>
    <v-card>
      <v-card-title>
        {{ tableTitle }}
        <v-spacer></v-spacer>
        <v-btn v-if="this.squad !== null" color="red" raised small tile @click="disbandSquad"
          ><v-icon left>mdi-account-plus</v-icon>Disband Squad</v-btn
        >
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
        <v-data-table
          :headers="headers"
          :items="players"
          sort-by="id"
          class="elevation-1"
          :search="search"
          :loading="isLoading"
          loading-text="Loading... Please wait"
        >
          <template v-slot:item.name="{ item }">
            <a :href="'http://steamcommunity.com/profiles/' + item.steamID" class="playerName" target="_blank">{{
              item.name
            }}</a>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn color="orange" raised small tile v-if="tableType !== 'disconnected'" @click="kickPlayer(item)"
              ><v-icon left>mdi-account-minus</v-icon> Kick</v-btn
            >
            <v-btn color="red" raised small tile @click="banPlayer(item)"
              ><v-icon left>mdi-account-remove</v-icon> Ban</v-btn
            >
            <v-btn color="purple" raised small tile v-if="tableType !== 'disconnected'" @click="warnPlayer(item)"
              ><v-icon left>mdi-account-alert</v-icon> Warn</v-btn
            >
            <v-btn color="blue" raised small tile v-if="tableType !== 'disconnected'" @click="movePlayer(item)"
              ><v-icon left>mdi-account-convert</v-icon>Move</v-btn
            >
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import Vue from 'vue';

function getHeadersBasedOnProp(tableType) {
  let headers = [];

  headers.push({ text: '#', value: 'playerID' });
  headers.push({ text: 'Name', value: 'name' });
  headers.push({ text: 'Steam ID 64', value: 'steamID' });

  if (tableType === 'online') {
    headers.push({ text: 'Team', value: 'team' });
    headers.push({ text: 'Squad', value: 'squad' });
  }

  if (tableType === 'disconnected') headers.push({ text: 'Disconnected Since', value: 'sinceDisconnect' });

  headers.push({ text: 'Actions', value: 'actions', sortable: false });

  return headers;
}

export default {
  name: 'PlayersTable',

  props: {
    tableType: String,
    players: Array,
    isLoading: Boolean,
    tableTitle: String,

    squad: {
      type: Object,
      default: null,
    },

    team: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      search: '',
    };
  },

  computed: {
    headers() {
      return getHeadersBasedOnProp(this.tableType);
    },
  },

  methods: {
    async confirmAction(action, playerName) {
      return new Promise((resove, reject) => {
        this.$swal({
          title: `Do you really want to ${action} ${playerName}?`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, I do',
        }).then((result) => resove(result.isConfirmed));
      });
    },

    async confirmNotification(text) {
      return new Promise((resove, reject) => {
        this.$swal({
          title: text,
          icon: 'error',
          showCancelButton: false,
          showCloseButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
        }).then((result) => resove(result.isConfirmed));
      });
    },

    async waitForInput(type, valiation) {
      return new Promise(async (resove, reject) => {
        const result = await this.$swal({
          title: 'Enter the ' + type + ':',
          input: 'text',
          inputPlaceholder: 'Enter the ' + type,
          showCloseButton: true,
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
        });

        if (result.isConfirmed) {
          let value = result.value.trim();

          if (!value || (value && value.length === 0)) {
            await this.confirmNotification('You must provide a valid non-empty input!');

            return resove(this.waitForInput());
          }

          if (valiation && typeof valiation === 'function') {
            if (!valiation(value)) {
              await this.confirmNotification('You may enter only number of days!');

              return resove(this.waitForInput(type, valiation));
            }
          }

          return resove(value);
        }
      });
    },

    async doTheAction(action, target, data) {
      try {
        const result = await Vue.axios.post(
          `${Vue.config.baseURL}/server/action`,
          {
            action,
            ...data,
          },

          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.$store.getters['session/getToken']}`,
            },
          }
        );

        if (result.data.success) {
          this.$swal({
            icon: 'success',
            title: `Succesfully ${action}ed the ${target}`,
          });

          return true;
        } else {
          this.$swal({
            icon: 'error',
            title: result.data.error
              ? `Failed to ${action} the ${target}!<br />Error: ${result.data.error}`
              : `Failed to ${action} the ${target}!`,
          });

          return false;
        }
      } catch (error) {
        if (error.response) {
          //console.log('Error: ', error.response);

          this.$swal({
            icon: 'error',
            title: `${error.response.data.error}`,
          });
        } else if (error.request) {
          //console.log('Error: ', error.request);

          this.$swal({
            icon: 'error',
            title: 'Unable to connect to the server!',
          });
        } else {
          // Something happened in setting up of the request that triggered an Error
          console.log('Error: ', error.message);

          this.$swal({
            icon: 'error',
            title: 'Code error, open the console for more info!',
          });
        }

        return false;
      }
    },

    async kickPlayer(player) {
      if (await this.confirmAction('kick', player.name)) {
        let reason = await this.waitForInput('reason');

        if (
          await this.doTheAction('kick', 'player', {
            reason,
            player,
          })
        ) {
          this.updatePlayerList(player);
        }
      }
    },

    async banPlayer(player) {
      if (await this.confirmAction('ban', player.name)) {
        let reason = await this.waitForInput('reason');
        let duration = await this.waitForInput('duration (in days)', (value) => /\d/i.test(value));

        if (
          await this.doTheAction('ban', 'player', {
            player,
            reason,
            duration,
          })
        ) {
          this.updatePlayerList(player);
        }
      }
    },

    async warnPlayer(player) {
      if (await this.confirmAction('warn', player.name)) {
        let reason = await this.waitForInput('reason');

        await this.doTheAction('warn', 'player', {
          player,
          reason,
        });
      }
    },

    async movePlayer(player) {
      if (await this.confirmAction('move', player.name)) {
        await this.doTheAction('move', 'player', {
          player,
        });
      }
    },

    updatePlayerList(player) {
      this.$root.$emit('player_list_updated', player);
    },

    async disbandSquad() {
      if (this.squad) {
        if (await this.confirmAction('disband', this.squad.name)) {
          let reason = await this.waitForInput('reason');

          if (
            await this.doTheAction('disband', 'squad', {
              reason,
              squad: this.squad,
              team: this.team,
            })
          ) {
            this.$root.$emit('squad_list_updated');
          }
        }
      }
    },
  },
};
</script>

<style scoped>
.playerName {
  text-decoration: none;
}
</style>
