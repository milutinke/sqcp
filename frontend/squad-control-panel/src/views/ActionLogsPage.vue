<template>
  <div class="mt-12">
    <v-card>
      <v-card-title>
        Action Logs
        <v-spacer></v-spacer>
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="logs"
        sort-by="id"
        class="elevation-1"
        :search="search"
        :loading="isLoading"
        loading-text="Loading... Please wait"
      >
        <template v-slot:item.createdAt="{ item }">
          {{ moment(item.createdAt).utc().format('DD/MM/YYYY HH:mm:ss') }}
        </template>
      </v-data-table>
    </v-card>

    <v-snackbar v-model="notification" bottom left color="blue" :timeout="notificationDuration">
      <v-icon color="white">mdi-check-bold</v-icon>
      {{ notificationText }}
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: 'ActionLogsPage',

  data() {
    return {
      timer: null,
      logs: [],
      search: '',
      headers: [
        { text: '#', value: 'id' },
        { text: 'Done by', value: 'username' },
        { text: 'Done at', value: 'createdAt' },
        { text: 'Log', value: 'log' },
      ],
      isLoading: true,
      notification: false,
      notificationText: 'The action logs list has been updated',
      notificationDuration: 3000,
    };
  },

  async mounted() {
    this.isLoading = true;
    await this.$store.dispatch('logs/fetch');
    this.logs = this.$store.getters['logs/getLogs'];
    this.isLoading = false;
    this.notification = true;
  },
};
</script>
