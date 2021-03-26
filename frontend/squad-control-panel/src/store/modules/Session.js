import Vue from 'vue';

export default {
  namespaced: true,

  state: {
    session: null,
    alreadyResored: false,
  },

  mutations: {
    set_session_mutation(state, payload) {
      state.session = payload;
    },

    set_already_restored_mutation(state, payload) {
      state.alreadyResored = payload;
    },
  },

  actions: {
    async login(state, payload) {
      try {
        const session = await Vue.axios.post(`${Vue.config.baseURL}/auth/login`, {
          username: payload.username,
          password: payload.password,
        });

        if (window.localStorage) window.localStorage.setItem('sqp_session', JSON.stringify({ session: session.data }));

        state.commit('set_session_mutation', session.data);
      } catch (error) {
        throw error;
      }
    },

    logout({ commit }) {
      if (window.localStorage && window.localStorage.getItem('sqp_session'))
        window.localStorage.removeItem('sqp_session');

      commit('set_session_mutation', null);
      commit('set_already_restored_mutation', false);
    },

    async restore({ state, commit, dispatch }) {
      if (window.localStorage && !state.alreadyResored) {
        const localSession = window.localStorage.getItem('sqp_session');

        if (localSession) {
          try {
            const parsedLocalSession = JSON.parse(localSession);

            try {
              await Vue.axios.get(`${Vue.config.baseURL}/user/whoami`, {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${parsedLocalSession.session.token}`,
                },
              });
            } catch (error) {
              if (error.response) {
                if (error.response.data.forbidden) {
                  dispatch(
                    'setNextPageMessage',
                    {
                      type: 'error',
                      message: error.response.data.error,
                    },
                    { root: true }
                  );

                  dispatch('logout');
                  return false;
                }
              }
            }

            commit('set_session_mutation', parsedLocalSession.session);
            commit('set_already_restored_mutation', true);
            return true;
          } catch (error2) {
            dispatch('logout');
            dispatch(
              'setNextPageMessage',
              {
                type: 'error',
                message: 'Looks like your local session got corrupted, please login again!',
              },
              { root: true }
            );

            return false;
          }
        }
      }
    },
  },

  getters: {
    isLoggedIn(state) {
      return state.session !== null;
    },

    isSuperAdmin(state) {
      return state.session !== null && state.session.user.isSuperAdmin;
    },

    getToken(state) {
      return state.session.token;
    },

    isAleradyRestored(state) {
      return state.alreadyResored;
    },
  },
};
