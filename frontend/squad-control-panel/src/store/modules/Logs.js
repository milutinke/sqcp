import Vue from 'vue';

export default {
  namespaced: true,

  state: {
    logs: null,
  },

  mutations: {
    set_logs_mutation(state, payload) {
      state.logs = payload;
    },
  },

  actions: {
    async fetch({ commit, rootState }) {
      try {
        const response = await Vue.axios.get(`${Vue.config.baseURL}/server/logs`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${rootState.session.session.token}`,
          },
        });

        commit('set_logs_mutation', response.data.logs);
      } catch (error) {
        throw error;
      }
    },
  },

  getters: {
    getLogs(state) {
      return state.logs;
    },
  },
};
