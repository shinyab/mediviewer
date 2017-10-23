import * as types from '../../mutation-types'

import layout from './layout'
import rotate from './rotate'
import move from './move'

const state = {
  items: [
    layout,
    move,
    rotate
  ]
}

const getters = {
  menus: state => state.items
}

const mutations = {
  [types.EXPAND_MENU] (state, menuItem) {
    if (menuItem.index > -1) {
      if (state.items[menuItem.index] && state.items[menuItem.index].meta) {
        state.items[menuItem.index].meta.expanded = menuItem.expanded
      }
    } else if (menuItem.item && 'expanded' in menuItem.item.meta) {
      menuItem.item.meta.expanded = menuItem.expanded
    }
  }
}

export default {
  state,
  getters,
  mutations
}
