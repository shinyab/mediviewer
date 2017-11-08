import * as types from '../../mutation-types'

import Divider from './divider'
import layout from './layout'
// import rotate from './rotate'
// import move from './move'

/*
* - type :
*    > action : 클릭후 바로적용
*    > select : 다른 메뉴 그룹과 CheckBox 형태로 적용
*    > layout : Divide Display
*    > expand : Sub Menu를 가짐
* */
const state = {
  items: [
    {
      name: 'BrainRoiSegmentation',
      type: 'action',
      meta: {
        label: 'Brain ROI Segmentation',
        icon: 'img-nor-01-brain-roi-segmentation.svg'
      }
    },
    {
      name: 'SegmentationResultOveray',
      type: 'action',
      meta: {
        label: 'Segmentation Result\nOveray',
        icon: 'img-nor-02-segmentation-result-overay.svg'
      }
    },
    {
      name: 'AnalysisReport',
      type: 'action',
      meta: {
        label: 'Analysis Report',
        icon: 'img-nor-03-analysis-roport.svg'
      }
    },
    {
      name: 'OpenSegmentations',
      type: 'action',
      meta: {
        label: 'Open Segmentations',
        icon: 'img-nor-18-open-segmentations.svg'
      }
    },
    {
      name: 'SaveAsDerived',
      type: 'action',
      meta: {
        label: 'Save As Derived',
        icon: 'img-nor-04-svae-as-derived.svg'
      }
    },
    Divider,
    layout,
    Divider,
    {
      name: 'Pan',
      type: 'select',
      meta: {
        label: 'Pan',
        icon: 'img-nor-06-pan.svg'
      }
    },
    {
      name: 'ZoomIn',
      type: 'action',
      meta: {
        label: 'Zoom In',
        icon: 'img-nor-07-zoom-in.svg'
      }
    },
    {
      name: 'ZoomOut',
      type: 'action',
      meta: {
        label: 'Zoom Out',
        icon: 'img-nor-08-zoom-out.svg'
      }
    },
    Divider,
    {
      name: 'WindowLevel',
      type: 'select',
      meta: {
        label: 'Window Level',
        icon: 'img-nor-09-window-level.svg'
      }
    },
    {
      name: 'Fit',
      type: 'action',
      meta: {
        label: 'Fit',
        icon: 'img-nor-10-fit.svg'
      }
    }
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
