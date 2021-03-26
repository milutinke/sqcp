import Vue from 'vue';

export default {
  namespaced: true,

  state: {
    users: null,
  },

  mutations: {
    set_users_mutation(state, payload) {
      state.users = payload;
    },
  },

  actions: {
    async fetch({ commit, rootState }) {
      try {
        const response = await Vue.axios.get(`${Vue.config.baseURL}/user/list`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${rootState.session.session.token}`,
          },
        });

        commit('set_users_mutation', response.data.users);
      } catch (error) {
        throw error;
      }
    },
  },

  getters: {
    getUsers(state) {
      return state.users;
    },
  },
};
