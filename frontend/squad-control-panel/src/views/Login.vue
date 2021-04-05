<template>
  <v-container fluid fill-height class="mt-12">
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="blue">
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                prepend-icon="mdi-account"
                name="login"
                label="Username"
                type="text"
                v-model="username"
              ></v-text-field>
              <v-text-field
                id="password"
                prepend-icon="mdi-lock"
                name="password"
                label="Password"
                type="password"
                v-model="password"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn block color="primary" elevation="1" large @click="onSubmit" :disabled="!canSubmit">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'Login',

  data() {
    return {
      username: null,
      password: null,
    };
  },

  computed: {
    canSubmit() {
      return this.username !== null && this.password !== null;
    },
  },

  methods: {
    async onSubmit() {
      try {
        await this.$store.dispatch(
          'session/login',
          {
            username: this.username,
            password: this.password,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );

        await this.$store.dispatch('setNextPageMessage', {
          type: 'success',
          message: 'You have succesfully logged in!<br />Welcome back!',
        });

        this.$router.push('/');
      } catch (error) {
        if (error.response) {
          //console.log(error.response);
          this.$swal({
            icon: 'error',
            title: `${error.response.data.error}`,
          });
        } else if (error.request) {
          //console.log(error.request);
          this.$swal({
            icon: 'error',
            title: 'Unable to connect to the server!',
          });
        } else {
          // Something happened in setting up of the request that triggered an Error
          console.log('Error', error.message);

          this.$swal({
            icon: 'error',
            title: 'Code error, open the console for more info!',
          });
        }
      }
    },
  },
};
</script>
