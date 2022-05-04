export const state = () => {
  return {
    loginModalVisible: false,
    userInfo: ""
  }
}

export const mutations = {
  UPDATE_LOGIN_VISIBLE (state, LV) {
    state.loginModalVisible = LV
  },

  UPDATE_USER_INFO (state, UI) {
    state.userInfo = UI
  }
}

export const actions = {
  async nuxtServerInit ({ commit }, { app }) {
    try {
      const { data } = await app.$axios.get('/api/v1/users/sessionuserinfo?noredirect')
      commit('UPDATE_USER_INFO', data)
    } catch (error) {
      console.log(error)
    }
  }
}