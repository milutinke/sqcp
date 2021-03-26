import Vue from 'vue';

export default {
  namespaced: true,

  state: {
    statistics: null,
  },

  mutations: {
    set_statistics_mutation(state, payload) {
      state.statistics = payload;
    },
  },

  actions: {
    async fetch({ commit, rootState }) {
      try {
        const response = await Vue.axios.get(`${Vue.config.baseURL}/statistics`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${rootState.session.session.token}`,
          },
        });

        commit('set_statistics_mutation', response.data.statistics);
      } catch (error) {
        throw error;
      }
    },
  },

  getters: {
    getStatistics(state) {
      return state.statistics;
    },
  },
};
