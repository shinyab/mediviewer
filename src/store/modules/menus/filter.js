export default {
  name: 'Filter',
  type: 'expand',
  meta: {
    label: 'Filter',
    icon: 'img-over-12-filter.svg',
    expanded: false
  },
  children: [
    {
      name: 'Invert',
      type: 'action',
      meta: {
        label: 'Invert',
        icon: 'img-over-12-1-invert.svg'
      }
    },
    {
      name: 'BrightnessContrast',
      type: 'select',
      meta: {
        label: 'Brightness Contrast',
        icon: 'img-over-12-2-btightness-contrast.svg'
      }
    }
  ]
}
