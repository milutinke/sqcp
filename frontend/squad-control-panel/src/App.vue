<template>
  <v-app>
    <AppBar v-bind:display-menu="shouldDisplayMenu" />

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import AppBar from './components/AppBar';

export default {
  name: 'App',

  components: {
    AppBar,
  },

  computed: {
    shouldDisplayMenu() {
      return this.$route.path.includes('login') ? 'no' : 'yes';
    },
  },

  beforeUpdate() {
    const nextPageMessage = this.$store.getters.getNextPageMessage;

    if (nextPageMessage !== null) {
      this.$swal({
        icon: nextPageMessage.type,
        title: nextPageMessage.message,
      });

      this.$store.dispatch('setNextPageMessage', null);
    }
  },
};
</script>

<style>
.swal2-popup {
  font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell,
    'Helvetica Neue', Helvetica, Arial, sans-serif !important;
}
</style>
