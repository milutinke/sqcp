<template>
  <div class="mt-12">
    <v-card>
      <v-card-title>
        Banned Players
        <v-spacer></v-spacer>
        <v-btn color="blue" raised small tile @click="openBanDialog(null, 'add')"
          ><v-icon left>mdi-plus</v-icon>Add ban manually</v-btn
        >
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>

        <v-data-table
          :headers="headers"
          :items="bans"
          sort-by="id"
          class="elevation-1"
          :search="search"
          :loading="isLoading"
          loading-text="Loading... Please wait"
        >
          <template v-slot:item.name="{ item }">
            <a :href="'http://steamcommunity.com/profiles/' + item.steamID" class="linkDecoration" target="_blank">{{
              item.name
            }}</a>
          </template>

          <template v-slot:item.duration="{ item }">
            {{ item.duration === 0 ? 'Pernament' : moment.unix(item.duration).format('DD/MM/YYYY HH:mm:ss') }}
          </template>

          <template v-slot:item.createdAt="{ item }">
            {{ moment(item.createdAt).utc().format('DD/MM/YYYY HH:mm:ss') }}
          </template>

          <template v-slot:item.lengthInDays="{ item }">
            {{ item.lengthInDays === 0 ? '&infin;' : item.lengthInDays }}
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn color="blue" raised small tile @click="openBanDialog(item, 'edit')"
              ><v-icon left>mdi-pencil</v-icon>Edit</v-btn
            >

            <v-btn color="red" raised small tile @click="unban(item)"
              ><v-icon left>mdi-backup-restore</v-icon>Unban</v-btn
            >
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-snackbar v-model="notification" bottom right color="blue" :timeout="notificationDuration">
      <v-icon color="white">mdi-check-bold</v-icon>
      {{ notificationText }}
    </v-snackbar>

    <template>
      <div>
        <v-dialog v-model="banDialog" fullscreen hide-overlay transition="dialog-bottom-transition" scrollable>
          <v-card tile>
            <v-toolbar flat dark color="primary">
              <v-btn icon dark @click="closeBanDialog">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-toolbar-title>{{ banDialogType === 'edit' ? 'Edit' : 'Add' }} ban</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items> <v-btn dark text @click="banManually"> Save </v-btn></v-toolbar-items>
            </v-toolbar>
            <v-card-text>
              <v-form v-model="canSubmitBan">
                <v-list three-line subheader>
                  <v-subheader>Ban details</v-subheader>

                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Player Name</v-list-item-title>
                      <v-list-item-subtitle>
                        <v-text-field
                          :rules="playerNameRules"
                          :value="currentBan.name"
                          @input="update(currentBan, 'name', $event)"
                        ></v-text-field>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Player Steam ID</v-list-item-title>
                      <v-list-item-subtitle>
                        <v-text-field
                          :rules="playerSteamIdRules"
                          :value="currentBan.steamID"
                          @input="update(currentBan, 'steamID', $event)"
                        ></v-text-field>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Ban Duration (in days)</v-list-item-title>
                      <v-list-item-subtitle>
                        <v-text-field
                          :rules="durationRules"
                          :value="currentBan.lengthInDays"
                          @input="update(currentBan, 'lengthInDays', $event)"
                        ></v-text-field>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Ban Reason</v-list-item-title>
                      <v-list-item-subtitle>
                        <v-text-field
                          :rules="reasonRules"
                          :value="currentBan.reason"
                          @input="update(currentBan, 'reason', $event)"
                        ></v-text-field>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-form>
            </v-card-text>

            <div style="flex: 1 1 auto"></div>
          </v-card>
        </v-dialog>
      </div>
    </template>
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  name: 'BansPage',

  data() {
    return {
      timer: null,
      bans: [],
      search: '',

      headers: [
        { text: '#', value: 'id' },
        { text: 'Name', value: 'name' },
        { text: 'Steam ID 64', value: 'steamID' },
        { text: 'Reason', value: 'reason' },
        { text: 'Banned By', value: 'bannedBy' },
        { text: 'Banned on', value: 'createdAt' },
        { text: 'Expires on', value: 'duration' },
        { text: 'Length in days', value: 'lengthInDays' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],

      isLoading: true,
      notification: false,
      notificationText: 'The bans list has been updated',
      notificationDuration: 3000,

      banDialog: false,
      banDialogType: '',
      canSubmitBan: false,

      currentBan: {
        id: -1,
        name: '',
        steamID: '',
        lengthInDays: '',
        reason: '',
      },

      playerNameRules: [
        (value) => !!value || 'Required.',
        (value) => (value || '').length <= 64 || 'Max 64 characters',
        (value) => (value || '').length >= 3 || 'Min 3 characters',
      ],

      playerSteamIdRules: [
        (value) => !!value || 'Required.',
        (value) => /^\d{17}$/i.test(value) || 'Steam ID 64 must be excactly 17 numbers!',
      ],

      durationRules: [
        (value) => value.trim().length > 0 || 'Required.',
        (value) => /^\d+$/i.test(value) || 'Duration must be a number without spaces!',
      ],

      reasonRules: [
        (value) => !!value || 'Required.',
        (value) => (value || '').length <= 64 || 'Max 64 characters',
        (value) => (value || '').length >= 3 || 'Min 3 characters',
      ],
    };
  },

  methods: {
    // Quick work around because v-model does not work with object properties
    update(obj, prop, value) {
      Vue.set(obj, prop, value);
    },

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

    async unban(ban) {
      if (await this.confirmAction('unban', ban.name)) {
        try {
          const result = await Vue.axios.delete(`${Vue.config.baseURL}/server/bans/${ban.id}`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.$store.getters['session/getToken']}`,
            },
          });

          if (result.data.success) {
            this.$swal({
              icon: 'success',
              title: `Succesfully unbaned the player`,
            });

            this.bans = this.bans.filter((ban_) => ban_.id !== ban.id);
          } else {
            this.$swal({
              icon: 'error',
              title: result.data.error
                ? `Failed to unban the player!<br />Error: ${result.data.error}`
                : `Failed to unban the player!`,
            });
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
        }
      }
    },

    openBanDialog(ban, type) {
      this.banDialog = true;
      this.canSubmitBan = false;
      this.banDialogType = type;

      this.currentBan =
        type === 'add'
          ? {
              id: -1,
              name: '',
              steamID: '',
              lengthInDays: '',
              reason: '',
            }
          : ban;
    },

    closeBanDialog() {
      this.currentBan = {
        id: -1,
        name: '',
        steamID: '',
        lengthInDays: '',
        reason: '',
      };

      this.banDialog = false;
      this.canSubmitBan = false;
    },

    async banManually() {
      if (this.canSubmitBan) {
        const isEditing = this.banDialogType === 'edit';
        const action = isEditing ? 'edit ban' : 'ban';
        const playerText = `${isEditing ? 'for ' : ''}${this.currentBan.name}`;
        const url = isEditing
          ? `${Vue.config.baseURL}/server/bans/${this.currentBan.id}`
          : `${Vue.config.baseURL}/server/action`;

        const data = isEditing
          ? this.currentBan
          : {
              action: 'ban',

              player: {
                name: this.currentBan.name,
                steamID: this.currentBan.steamID,
                sinceDisconnect: 1, // Dummy value
              },

              reason: this.currentBan.reason,
              duration: this.currentBan.lengthInDays,
            };

        if (await this.confirmAction(action, playerText)) {
          try {
            const result = await Vue.axios[isEditing ? 'put' : 'post'](url, data, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.$store.getters['session/getToken']}`,
              },
            });

            if (result.data.success) {
              this.$swal({
                icon: 'success',
                title: `Succesfully ${isEditing ? 'edited the ban' : 'banned the player'}!`,
              });

              await this.updateBans();
              this.closeBanDialog();
            } else {
              this.$swal({
                icon: 'error',
                title: result.data.error
                  ? `Failed to ${isEditing ? 'edit the ban' : 'ban the player'}!<br />Error: ${result.data.error}`
                  : `Failed to ${isEditing ? 'edit the ban' : 'ban the player'}!`,
              });
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
          }
        }
      } else {
        this.$swal({
          icon: 'error',
          title: 'Please fill all fields with valid and appropriate data!',
        });
      }
    },

    async updateBans() {
      this.isLoading = true;
      await this.$store.dispatch('bans/fetch');
      this.bans = this.$store.getters['bans/getBans'];
      this.isLoading = false;
      this.notification = true;
    },
  },

  async mounted() {
    await this.updateBans();
  },
};
</script>

<style scoped>
.linkDecoration {
  text-decoration: none;
}
</style>
