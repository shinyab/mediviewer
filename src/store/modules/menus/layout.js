export default {
  name: 'DivideDisplay',
  type: 'expand',
  meta: {
    label: 'Divide Display',
    icon: 'img-over-05-divide-display.svg',
    expanded: false
  },
  children: [
    {
      name: '1By1',
      type: 'layout',
      meta: {
        label: '1 X 1',
        icon: 'img-lnb-radio-sel-pre.svg'
      }
    },
    {
      name: '2By2',
      type: 'layout',
      meta: {
        label: '2 X 2',
        icon: 'img-lnb-radio-nor-pre.svg'
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
