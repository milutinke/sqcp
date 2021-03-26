import Vue from 'vue';
import Vuex from 'vuex';
import Session from '@/store/modules/Session.js';
import Population from '@/store/modules/Population.js';
import ServerRoles from '@/store/modules/ServerRoles.js';
import Bans from '@/store/modules/Bans.js';
import Logs from '@/store/modules/Logs';
import Users from '@/store/modules/Users';
import Statistics from '@/store/modules/Statistics';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    nextPageMessage: null,
  },

  mutations: {
    set_next_page_message_mutation(state, payload) {
      state.nextPageMessage = payload;
    },
  },

  actions: {
    setNextPageMessage(state, payload) {
      state.commit('set_next_page_message_mutation', payload);
    },
  },

  modules: {
    session: Session,
    population: Population,
    serverRoles: ServerRoles,
    bans: Bans,
    logs: Logs,
    users: Users,
    statistics: Statistics,
  },

  getters: {
    getNextPageMessage(state) {
      return state.nextPageMessage;
    },
  },
});
