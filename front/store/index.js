export const state = () => {
  return {
    loginModalVisible: false,
    userInfo: "",
    notifyCount: 0,
    previewImgSrc: null
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
  },

  UPDATE_PREVIEW_IMGSRC (state, previewImgSrc) {
    state.previewImgSrc = previewImgSrc
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