<template>
  <div class="app-main">
    <router-view></router-view>
    <segmentation-popup
      v-show="showSegmentationPopup"
    ></segmentation-popup>
  </div>
</template>

<script>
  import * as busType from '@/util/bus/bus-types'

  import SegmentationPopup from '@/components/popups/SegmentationPopup'

  export default {
    name: 'AppContents',
    data () {
      return {
        showSegmentationPopup: false
      }
    },
    components: {
      SegmentationPopup
    },
    created () {
      this.$bus.$on(busType.SHOW_SEGMENTATION_POPUP, this.showSegmentationPopupToggle)
    },
    methods: {
      showSegmentationPopupToggle (show) {
        if (show) {
          this.showSegmentationPopup = show
          return
        }
        this.showSegmentationPopup = !this.showSegmentationPopup
      }
    }
  }
</script>

<style lang="scss" scoped>
  #app-main {
  }
</style>
