export default {
  name: 'Rotate',
  meta: {
    label: 'Rotate',
    icon: 'icon-rotate',
    type: 'rotate',
    expanded: false
  },
  children: [
    {
      name: '90',
      meta: {
        label: '90',
        icon: 'icon-rotate-90',
        type: 'rotate'
      }
    },
    {
      name: '180',
      meta: {
        label: '180',
        icon: 'icon-rotate-180',
        type: 'rotate'
      }
    },
    {
      name: '270',
      meta: {
        label: '270',
        icon: 'icon-rotate-270',
        type: 'rotate'
      }
    }
  ]
}
