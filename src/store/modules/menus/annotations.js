export default {
  name: 'Annotations',
  type: 'expand',
  meta: {
    label: 'Annotations',
    icon: 'img-over-14-annotataions.svg',
    expanded: false
  },
  children: [
    {
      name: 'Ruler',
      type: 'select',
      meta: {
        label: 'Ruler',
        icon: 'img-over-14-1-ruler.svg'
      }
    },
    {
      name: 'PolyRuler',
      type: 'select',
      meta: {
        label: 'Poly Ruler',
        icon: 'img-over-14-2-poly-ruler.svg'
      }
    },
    {
      name: 'Protractor',
      type: 'select',
      meta: {
        label: 'Protractor',
        icon: 'img-over-14-3-protractor.svg'
      }
    }
  ]
}
