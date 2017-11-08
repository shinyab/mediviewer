import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions'
import mutations from './mutations'

import menus from './modules/menus'

Vue.use(Vuex)

const state = {
  userId: 'abcd',
  currentLayout: {
    name: '2By2'
  },
  focusedCanvas: {},
  currentAction: {},
  currentSelect: {}
}

const store = new Vuex.Store({
  state,
  modules: {
    menus
  },
  actions,
  mutations
})

export default store