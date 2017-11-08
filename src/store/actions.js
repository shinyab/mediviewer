import * as mutationType from './mutation-types'

export default {
  expandMenu: ({ commit }, menuItem) => {
    if (menuItem) {
      menuItem.expanded = menuItem.expanded || false
      commit(mutationType.EXPAND_MENU, menuItem)
    }
  }
}
