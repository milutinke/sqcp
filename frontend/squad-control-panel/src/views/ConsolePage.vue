<template>
  <v-card class="mt-12">
    <v-card-title> Console </v-card-title>

    <v-card-text>
      <v-text-field label="Enter the command" placeholder="Enter the command" outlined v-model="command"></v-text-field>
      <v-textarea outlined label="Output" :value="output" rows="20"></v-textarea>
      <v-btn
        color="blue"
        elevation="2"
        large
        :loading="isExecuting"
        :disabled="isEnabled"
        @click="executeCommand"
        raised
        tile
        >Execute</v-btn
      >
    </v-card-text>
  </v-card>
</template>

<script>
import Vue from 'vue';

export default {
  name: 'ConsolePage',

  data() {
    return {
      command: '',
      output: '',
      isExecuting: false,
    };
  },

  computed: {
    isEnabled() {
      return this.command && this.command.lenght > 0;
    },
  },

  methods: {
    async executeCommand() {
      try {
        const result = await Vue.axios.post(
          `${Vue.config.baseURL}/rcon/execute`,
          {
            command: this.command,
          },

          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.$store.getters['session/getToken']}`,
            },
          }
        );

        this.command = '';

        if (result.data.response) {
          this.$swal({
            icon: 'success',
            title: `Succesfully executed the command`,
          });

          this.output = result.data.response;
        } else {
          this.$swal({
            icon: 'error',
            title: result.data.error
              ? `Failed to execute the command!<br />Error: ${result.data.error}`
              : `Failed to execute the command!`,
          });

          this.output = '';
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

        this.output = '';
      }
    },
  },
};
</script>
