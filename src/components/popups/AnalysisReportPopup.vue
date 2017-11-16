<template>
  <vue-draggable-resizable
    class="report-popup"
    :parent="true"
    :x="247" :y="85" :z="2000"
    :w="700" :h="900"
    :minw="700" :minh="900">
    <div class="report-popup-inner">
      <div class="report-header">
        <span>Analysis Report</span>
        <img src="/static/images/icons/svg/btn-close-nor.svg"
             @click="closePopup"
             @mousedown="stopMovable">
      </div>
      <div class="report-body">
      </div>
    </div>
  </vue-draggable-resizable>
</template>

<script>
  import * as busType from '@/util/bus/bus-types'

  export default {
    name: 'AnalysisReportPopup',
    methods: {
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
        background-color: white;
        overflow-y: auto;
        overflow-x: hidden;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
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
