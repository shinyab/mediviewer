import * as mutationType from './mutation-types'

export default {
  expandMenu: ({ commit }, menuItem) => {
    if (menuItem) {
      menuItem.expanded = menuItem.expanded || false
      commit(mutationType.EXPAND_MENU, menuItem)
    }
  },
  showTagsToggle: ({ commit }, menuItem) => {
    if (menuItem) {
      commit(mutationType.SHOW_TAGS_MENU_TOGGLE, menuItem)
    }
  },
  segmentationVisibleToggle: ({ commit }, segItem) => {
    if (segItem) {
      segItem.visible = segItem.visible || false
      commit(mutationType.SEGMENTATION_VISIBLE_TOGGLE, segItem)
    }
  },
  segmentationSelectedToggle: ({ commit }, segItem) => {
    if (segItem) {
      segItem.selected = segItem.selected || false
      commit(mutationType.SEGMENTATION_SELECTED_TOGGLE, segItem)
    }
  }
}
