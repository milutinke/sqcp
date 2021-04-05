<template>
  <div>
    <v-navigation-drawer v-if="shouldDisplayMenu" v-model="drawer" app temporary>
      <v-list dense>
        <v-list-item v-for="item in items" :key="item.title" link :to="item.link">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="confirmLogout">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="blue" fixed dense dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" v-if="shouldDisplayMenu"></v-app-bar-nav-icon>

      <div class="d-flex align-center">
        <v-img
          class="shrink mr-2"
          contain
          :src="require('../assets/logo.png')"
          transition="scale-transition"
          width="40"
        />
        <v-toolbar-title>Squad Control Panel</v-toolbar-title>
      </div>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  name: 'AppBar',

  props: ['display-menu'],

  computed: {
    shouldDisplayMenu() {
      return this.displayMenu.toLowerCase() === 'yes';
    },
  },

  data() {
    return {
      drawer: false,
      items: [],
    };
  },

  watch: {
    // Dirty fix
    $route: function (to, from) {
      this.items = [];

      this.$router.options.routes.forEach((route) => {
        if (!route.meta || (route.meta && !route.meta.menu)) return;

        if (route.meta.superAdminMiddleware && !this.$store.getters['session/isSuperAdmin']) return;

        this.items.push({
          title: route.name,
          link: route.path,
          icon: route.meta.menu.icon,
        });
      });
    },
  },

  methods: {
    confirmLogout() {
      this.$swal({
        title: 'Do you really want to logout?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, I do',
      }).then((result) => {
        if (result.isConfirmed) {
          this.$store.dispatch('session/logout');
          this.$store.dispatch('setNextPageMessage', {
            type: 'success',
            message: 'You have successfully logged out!',
          });
          this.$router.push({ name: 'Login' });
        }
      });
    },
  },
};
</script>
