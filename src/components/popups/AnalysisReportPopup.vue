<template>
  <vue-draggable-resizable
    class="report-popup"
    :parent="true"
    :resizable="false"
    :x="247" :y="85" :z="2000"
    :w="700" :h="800">
    <div class="report-popup-inner">
      <div class="report-header">
        <span>Analysis Report</span>
        <img src="/static/images/icons/svg/btn-close-nor.svg"
             @click="closePopup"
             @mousedown="stopMovable">
      </div>
      <div class="report-body">
        <img
          v-if="reportImg"
          :src="reportImg" alt="Please wait ...">
      </div>
    </div>
  </vue-draggable-resizable>
</template>

<script>
  import * as busType from '@/util/bus/bus-types'

  export default {
    name: 'AnalysisReportPopup',
    data () {
      return {
        reportImg: null
      }
    },
    created () {
      this.$bus.$on(busType.FILE_UPLOADED, this.dicomFileUploaded)
    },
    methods: {
      dicomFileUploaded (dicomFile) {
        this.resetReportImageWithFileName(dicomFile.name)
      },
      resetReportImageWithFileName (fileName) {
        switch (fileName) {
          case 'dicom-001-02.zip':
            this.reportImg = '/static/reports/report-001.png'
            break
          case 'dicom-002-02.zip':
            this.reportImg = '/static/reports/report-002.png'
            break
          case 'dicom-003-02.zip':
            this.reportImg = '/static/reports/report-003.png'
            break
          case 'dicom-004-02.zip':
            this.reportImg = '/static/reports/report-004.png'
            break
          case 'dicom-005-02.zip':
            this.reportImg = '/static/reports/report-005.png'
            break
          default:
            break
        }
      },
      closePopup (e) {
        this.$bus.$emit(busType.SHOW_ANALYSIS_REPORT_POPUP, false)
        e.stopPropagation()
      },
      stopMovable (e) {
        e.stopPropagation()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../style/bh_style.scss";

  .report-popup {
    box-shadow: 5px 5px 30px black;

    .report-popup-inner {
      width: 100%;
      height: 100%;
      background-color: #282828;
      border-radius: 5px;
      overflow: hidden;

      .report-header {
        margin-left: 15px;
        width: 100%;
        height: 48px;

        span {
          position: relative;
          top: 10px;
          font-size: 15px;
          vertical-align: middle;
          color: #e3e3e3;
        }

        img {
          vertical-align: middle;
          margin-right: 15px;
          width: 48px;
          height: 48px;
          float: right;

          &:hover {
            cursor: pointer;
            background-color: $button-over-color;
          }
        }
      }

      .report-body {
        position: absolute;
        width: 100%;
        top: 48px;
        bottom: 0;
        padding: 0;
        background-color: rgb(32, 31, 36);
        overflow-y: auto;
        overflow-x: hidden;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;

        img {
          width: 700px;
          height: 850px;
          top: 0;
          bottom: 0;
          margin: 0;
          pointer-events: none;
        }
      }

      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
  }
</style>
