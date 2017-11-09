<template>
  <div class="app-main">
    <router-view></router-view>
    <analysis-report-popup
      v-show="showAnalysisReportPopup"
    ></analysis-report-popup>
    <segmentation-popup
      v-show="showSegmentationPopup"
    ></segmentation-popup>
  </div>
</template>

<script>
  import * as busType from '@/util/bus/bus-types'

  import SegmentationPopup from '@/components/popups/SegmentationPopup'
  import AnalysisReportPopup from '@/components/popups/AnalysisReportPopup'

  export default {
    name: 'AppContents',
    data () {
      return {
        showSegmentationPopup: false,
        showAnalysisReportPopup: false
      }
    },
    components: {
      SegmentationPopup,
      AnalysisReportPopup
    },
    created () {
      this.$bus.$on(busType.SHOW_SEGMENTATION_POPUP, this.showSegmentationPopupToggle)
      this.$bus.$on(busType.SHOW_ANALYSIS_REPORT_POPUP, this.showAnalysisReportPopupToggle)
    },
    methods: {
      showSegmentationPopupToggle (show) {
        if (show) {
          this.showSegmentationPopup = show
          return
        }
        this.showSegmentationPopup = !this.showSegmentationPopup
      },
      showAnalysisReportPopupToggle (show) {
        if (show) {
          this.showAnalysisReportPopup = show
          return
        }
        this.showAnalysisReportPopup = !this.showAnalysisReportPopup
      }
    }
  }
</script>

<style lang="scss" scoped>
  #app-main {
  }
</style>
