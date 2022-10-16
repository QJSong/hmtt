import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userPhoto: 'https://img.wxcha.com/m00/b3/6c/f024ebb91ebf9ac92af3142820549868.jpg'
  },
  getters: {
  },
  mutations: {
    SET_USERPHOTO (state, value) {
      state.userPhoto = value
    }
  },
  actions: {
  },
  modules: {
  }
})
