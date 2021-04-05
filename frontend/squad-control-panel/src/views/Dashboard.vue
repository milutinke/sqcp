<template>
  <v-card tile class="mt-12">
    <v-card-title> Dashboard </v-card-title>
    <v-card-text>
      <v-list three-line subheader>
        <v-subheader>Statistics</v-subheader>

        <v-list-item>
          <v-list-item-content>
            <v-list-item-title><span class="light-blue--text">Total Panel Admins</span></v-list-item-title>
            <v-list-item-subtitle> {{ statistics.users }} </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-content>
            <v-list-item-title><span class="yellow--text">Total Server Roles</span></v-list-item-title>
            <v-list-item-subtitle> {{ statistics.serverRoles }} </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-content>
            <v-list-item-title><span style="color: #69f0ae !important">Total Server Admins</span></v-list-item-title>
            <v-list-item-subtitle> {{ statistics.serverAdmins }} </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-content>
            <v-list-item-title><span class="red--text">Total Bans</span></v-list-item-title>
            <v-list-item-subtitle> {{ statistics.bans }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-content>
            <v-list-item-title><span class="cyan--text">Total Commited Actions</span></v-list-item-title>
            <v-list-item-subtitle> {{ statistics.actions }} </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card-text>

    <div style="flex: 1 1 auto"></div>
  </v-card>
</template>

<script>
export default {
  name: 'DashboardPage',

  data() {
    return {
      statistics: {
        users: 'Loading...',
        serverRoles: 'Loading...',
        serverAdmins: 'Loading...',
        bans: 'Loading...',
        actions: 'Loading...',
      },
    };
  },

  async beforeCreate() {
    try {
      await this.$store.dispatch('statistics/fetch');
      this.statistics = this.$store.getters['statistics/getStatistics'];
    } catch (error) {
      this.$swal({
        icon: 'error',
        title: 'Failed to fetch the statistics!',
      });
    }
  },
};
</script>
