import Vue from 'vue';

export default {
  namespaced: true,

  state: {
    roles: null,
    admins: null,
  },

  mutations: {
    set_roles_mutation(state, payload) {
      state.roles = payload;
    },

    set_admins_mutation(state, payload) {
      state.admins = payload;
    },
  },

  actions: {
    async fetchRoles({ commit, rootState }) {
      try {
        const response = await Vue.axios.get(`${Vue.config.baseURL}/server/roles`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${rootState.session.session.token}`,
          },
        });

        commit('set_roles_mutation', response.data.roles);
      } catch (error) {
        throw error;
      }
    },

    async fetchAdmins({ commit, rootState }) {
      try {
        const response = await Vue.axios.get(`${Vue.config.baseURL}/server/admins/json`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${rootState.session.session.token}`,
          },
        });

        commit('set_admins_mutation', response.data.admins);
      } catch (error) {
        throw error;
      }
    },
  },

  getters: {
    getRoles(state) {
      return state.roles;
    },

    getAdmins(state) {
      return state.admins;
    },
  },
};
