import * as types from '../../mutation-types'

const state = {
  items: [
    {
      visible: false,
      selected: false,
      meta: {
        label: 'Segmentation 01',
        icon: 'btn-uncheck-checkbox.svg',
        color: '#f5a623'
      }
    },
    {
      visible: false,
      selected: false,
      meta: {
        label: 'Segmentation 02',
        icon: 'btn-uncheck-checkbox.svg',
        color: '#f55e23'
      }
    },
    {
      visible: false,
      selected: false,
      meta: {
        label: 'Segmentation 03',
        icon: 'btn-uncheck-checkbox.svg',
        color: '#f5235d'
      }
    },
    {
      visible: false,
      selected: false,
      meta: {
        label: 'Segmentation 04',
        icon: 'btn-uncheck-checkbox.svg',
        color: '#e323f5'
      }
    },
    {
      visible: false,
      selected: false,
      meta: {
        label: 'Segmentation 05',
        icon: 'btn-uncheck-checkbox.svg',
        color: '#8d23f5'
      }
    },
    {
      visible: false,
      selected: false,
      meta: {
        label: 'Segmentation 06',
        icon: 'btn-uncheck-checkbox.svg',
        color: '#234cf5'
      }
    },
    {
      visible: false,
      selected: false,
      meta: {
        label: 'Segmentation 07',
        icon: 'btn-uncheck-checkbox.svg',
        color: '#23d0f5'
      }
    },
    {
      visible: false,
      selected: false,
      meta: {
        label: 'Segmentation 08',
        icon: 'btn-uncheck-checkbox.svg',
        color: '#23f53d'
      }
    },
    {
      visible: false,
      selected: false,
      meta: {
        label: 'Segmentation 09',
        icon: 'btn-uncheck-checkbox.svg',
        color: '#6b801e'
      }
    }
  ]
}

const getters = {
  segmentations: state => state.items
}

const mutations = {
  [types.SEGMENTATION_VISIBLE_TOGGLE] (state, segItem) {
    if (segItem.index > -1) {
      if (state.items[segItem.index] && state.items[segItem.index].meta) {
        state.items[segItem.index].visible = segItem.visible
      }
    }
  },
  [types.SEGMENTATION_SELECTED_TOGGLE] (state, segItem) {
    if (segItem.index > -1) {
      if (state.items[segItem.index] && state.items[segItem.index].meta) {
        state.items[segItem.index].selected = segItem.selected
      }
    }
  }
}

export default {
  state,
  getters,
  mutations
}
