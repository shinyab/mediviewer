export default {
  name: 'Layout',
  type: 'layout',
  meta: {
    label: 'Layout',
    icon: 'layouts.png',
    type: 'layout',
    expanded: false
  },
  children: [
    {
      name: '1By1',
      meta: {
        label: '1 X 1',
        icon: '1x1.png',
        type: 'layout'
      }
    },
    {
      name: '2By2',
      meta: {
        label: '2 X 2',
        icon: '2x2.png',
        type: 'layout'
      }
    }
    // ,
    // {
    //   name: '3By3',
    //   meta: {
    //     label: '3 X 3',
    //     icon: 'icon-layout-3x3',
    //     type: 'layout'
    //   }
    // }
  ]
}
