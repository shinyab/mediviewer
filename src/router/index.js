import Vue from 'vue'
import Router from 'vue-router'
import DicomViewer from '@/views/DicomViewer'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/viewer'
    },
    {
      path: '/viewer',
      name: 'DicomViewer',
      component: DicomViewer
    }
  ]
})
