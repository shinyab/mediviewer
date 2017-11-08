<template>
  <div class="app-main">
    <router-view></router-view>
    <!--<segmentation-popup></segmentation-popup>-->
  </div>
</template>

<script>
  import SegmentationPopup from '@/components/popups/SegmentationPopup'

  export default {
    name: 'AppContents',
    components: {
      SegmentationPopup
    }
  }
</script>

<style lang="scss" scoped>
  #app-main {
  }
</style>
