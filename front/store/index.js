export const state = () => {
  return {
    loginModalVisible: false,
    userInfo: "",
    notifyCount: 0
  }
}

export const mutations = {
  UPDATE_LOGIN_VISIBLE (state, loginModalVisible) {
    state.loginModalVisible = loginModalVisible
  },

  UPDATE_USER_INFO (state, userInfo) {
    state.userInfo = userInfo
  },

  UPDATE_NOTIFY_COUNT (state, notifyCount) {
    state.notifyCount = notifyCount
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