import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store/index.js';
import Dashboard from '../views/Dashboard.vue';
import PageNotFound from '../views/PageNotFound.vue';
import Login from '../views/Login.vue';
import OnlinePlayers from '../views/OnlinePlayers.vue';
import DisconnectedPlayers from '../views/DisconnectedPlayers.vue';
import ServerRoles from '../views/ServerRoles.vue';
import BansPage from '../views/BansPage.vue';
import ActionLogsPage from '../views/ActionLogsPage.vue';
import SquadsPage from '../views/SquadsPage.vue';
import ConsolePage from '../views/ConsolePage.vue';
import PanelAdminsPage from '../views/PanelAdminsPage.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      menu: {
        icon: 'mdi-desktop-mac-dashboard',
      },
      authMiddelware: true,
    },
  },

  {
    path: '/online-players',
    name: 'Online Players',
    component: OnlinePlayers,
    meta: {
      menu: {
        icon: 'mdi-account-multiple',
      },
      authMiddelware: true,
    },
  },

  {
    path: '/disconnected-players',
    name: 'Disconnected Players',
    component: DisconnectedPlayers,
    meta: {
      menu: {
        icon: 'mdi-account-off',
      },
      authMiddelware: true,
    },
  },

  {
    path: '/banned-players',
    name: 'Banned Players',
    component: BansPage,
    meta: {
      menu: {
        icon: 'mdi-account-remove',
      },
      authMiddelware: true,
      superAdminMiddleware: true,
    },
  },

  {
    path: '/panel-admins',
    name: 'Panel Admins',
    component: PanelAdminsPage,
    meta: {
      menu: {
        icon: 'mdi-shield-account',
      },
      authMiddelware: true,
      superAdminMiddleware: true,
    },
  },

  {
    path: '/server-roles',
    name: 'Server Roles',
    component: ServerRoles,
    meta: {
      menu: {
        icon: 'mdi-account-star',
      },
      authMiddelware: true,
      superAdminMiddleware: true,
    },
  },

  {
    path: '/squads',
    name: 'Squads',
    component: SquadsPage,
    meta: {
      menu: {
        icon: 'mdi-format-list-numbered',
      },
      authMiddelware: true,
    },
  },

  {
    path: '/console',
    name: 'Console',
    component: ConsolePage,
    meta: {
      menu: {
        icon: 'mdi-console',
      },
      authMiddelware: true,
      superAdminMiddleware: true,
    },
  },

  {
    path: '/action-logs',
    name: 'Action Logs',
    component: ActionLogsPage,
    meta: {
      menu: {
        icon: 'mdi-notebook-multiple',
      },
      authMiddelware: true,
      superAdminMiddleware: true,
    },
  },

  {
    path: '/login',
    name: 'Login',
    component: Login,
  },

  // 404
  {
    path: '*',
    name: 'PageNotFound',
    component: PageNotFound,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (!store.getters['session/isAleradyRestored'])
    await store.dispatch('session/restore');

  // Login page
  if (to.name.toLowerCase() === 'login') {
    if (store.getters['session/isLoggedIn']) next({ name: 'Dashboard' });
    else next();
  }

  // Page not found when not logged in
  if (to.name.toLowerCase() === 'pagenotfound') {
    if (!store.getters['session/isLoggedIn']) next({ name: 'Login' });
    else next();
  }

  // Other pages
  if (to.matched.some((record) => record.meta.authMiddelware)) {
    if (store.getters['session/isLoggedIn']) {
      if (to.matched.some((record) => record.meta.superAdminMiddleware)) {
        if (store.getters['session/isSuperAdmin']) next();
        else {
          store.dispatch('setNextPageMessage', {
            type: 'error',
            message: 'You are trying to access a part of the site for which you do not have permission!',
          });
          next({ name: 'Dashboard' });
        }
      } else next();
    } else next({ name: 'Login' });
  } else next();
});

export default router;
