export default {
  name: 'Rotate',
  meta: {
    label: 'Rotate',
    icon: 'rotates.png',
    type: 'rotate',
    expanded: false
  },
  children: [
    {
      name: '90',
      meta: {
        label: '90',
        icon: 'rotate.png',
        type: 'rotate'
      }
    },
    {
      name: '180',
      meta: {
        label: '180',
        icon: 'rotate.png',
        type: 'rotate'
      }
    },
    {
      name: '270',
      meta: {
        label: '270',
        icon: 'rotate.png',
        type: 'rotate'
      }
    }
  ]
}
