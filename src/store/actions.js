import * as types from './mutation-types'

export default {
  expandMenu: ({ commit }, menuItem) => {
    if (menuItem) {
      menuItem.expanded = menuItem.expanded || false
      commit(types.EXPAND_MENU, menuItem)
    }
  }
}
