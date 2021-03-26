import Vue from 'vue';

export default {
  namespaced: true,

  state: {
    bans: null,
  },

  mutations: {
    set_bans_mutation(state, payload) {
      state.bans = payload;
    },
  },

  actions: {
    async fetch({ commit, rootState }) {
      try {
        const response = await Vue.axios.get(`${Vue.config.baseURL}/server/bans/json`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${rootState.session.session.token}`,
          },
        });

        commit('set_bans_mutation', response.data.bans);
      } catch (error) {
        throw error;
      }
    },
  },

  getters: {
    getBans(state) {
      return state.bans;
    },
  },
};
