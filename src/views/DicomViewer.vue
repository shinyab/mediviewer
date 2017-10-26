<template>
  <div id="app-content-area">
    <sidebar></sidebar>
    <section class="viewer-area">
      <div class="container is-fluid is-marginless app-content">

        <div class="layout-area">
          <div id="layout-1-1" ref="layout1By1" class="layouts" :style="layout_1_1.style"
               v-if="currentLayout === '1By1' || currentLayout === '2By2' || currentLayout === '3By'" @mouseover="mouseOver"></div>

          <div id="layout-1-2" ref="layout1By2" class="layouts" :style="layout_1_2.style"
               v-if="currentLayout === '2By2' || currentLayout === '3By'" @mouseover="mouseOver"></div>
          <div id="layout-2-1" ref="layout2By1" class="layouts" :style="layout_2_1.style"
               v-if="currentLayout === '2By2' || currentLayout === '3By'" @mouseover="mouseOver"></div>
          <div id="layout-2-2" ref="layout2By2" class="layouts" :style="layout_2_2.style"
               v-if="currentLayout === '2By2' || currentLayout === '3By'" @mouseover="mouseOver"></div>

          <!--<div id="layout-1-3" ref="layout1By3" class="layouts" :style="layout_1_3.style"-->
               <!--v-if="currentLayout === '3By'" @mouseover="mouseOver"></div>-->
          <!--<div id="layout-2-3" ref="layout2By3" class="layouts" :style="layout_2_3.style"-->
               <!--v-if="currentLayout === '3By'" @mouseover="mouseOver"></div>-->
          <!--<div id="layout-3-1" ref="layout3By1" class="layouts" :style="layout_3_1.style"-->
               <!--v-if="currentLayout === '3By'" @mouseover="mouseOver"></div>-->
          <!--<div id="layout-3-2" ref="layout3By2" class="layouts" :style="layout_3_2.style"-->
               <!--v-if="currentLayout === '3By'" @mouseover="mouseOver"></div>-->
          <!--<div id="layout-3-3" ref="layout3By3" class="layouts" :style="layout_3_3.style"-->
               <!--v-if="currentLayout === '3By'" @mouseover="mouseOver"></div>-->
        </div>

      </div>
    </section>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import * as mutationType from '@/store/mutation-types'
  import * as busType from '@/util/bus/bus-types'

  import {init, animate} from '@/lib/three/'

  import Sidebar from '@/components/layout/Sidebar'

  export default {
    name: 'DicomViewer',
    components: {
      Sidebar
    },
    computed: {
      ...mapState({
        currentLayout: 'currentLayout',
        currentMenu: 'currentMenu'
      })
    },
    data () {
      return {
        uploadedFile: null,
        layout_1_1: {},
        layout_1_2: {},
//        layout_1_3: {},
        layout_2_1: {},
        layout_2_2: {}
//        layout_2_3: {},
//        layout_3_1: {},
//        layout_3_2: {},
//        layout_3_3: {},
      }
    },
    created () {
      this.$bus.$on(busType.MENU_CLICKED, this.menuClicked)
      this.$bus.$on(busType.FILE_UPLOADED, this.setUploadedFile)
    },
    mounted () {
      this.initLayouts()

      init()
      animate()
    },
    methods: {
      setUploadedFile (uploadedFile) {
        this.uploadedFile = uploadedFile
        console.log(this.uploadedFile)
      },
      initLayouts () {
        this.layout_1_1 = {
          obj: this.$refs.layout1By1, // == document.getElementById('layout-1-1'),
          style: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }
        }
        this.layout_1_2 = { obj: this.$refs.layout1By2 } // == document.getElementById('layout-1-2'),
//        this.layout_1_3 = { obj: this.$refs.layout1By3 } // == document.getElementById('layout-1-3'),
        this.layout_2_1 = { obj: this.$refs.layout2By1 } // == document.getElementById('layout-2-1'),
        this.layout_2_2 = { obj: this.$refs.layout2By2 } // == document.getElementById('layout-2-2'),
//        this.layout_2_3 = { obj: this.$refs.layout2By3 } // == document.getElementById('layout-2-3'),
//        this.layout_3_1 = { obj: this.$refs.layout3By1 } // == document.getElementById('layout-3-1'),
//        this.layout_3_2 = { obj: this.$refs.layout3By2 } // == document.getElementById('layout-3-2'),
//        this.layout_3_3 = { obj: this.$refs.layout3By3 } // == document.getElementById('layout-3-3'),
      },
      setLayoutsWithMenuName (menuName) {
        if (menuName === '1By1') {
          this.$store.commit('SET_LAYOUT_TYPE', menuName)

          this.layout_1_1.style = {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }
        } else if (menuName === '2By2') {
          this.$store.commit('SET_LAYOUT_TYPE', menuName)

          this.layout_1_1.style = {
            top: 0,
            left: 0,
            right: '50%',
            bottom: '50%'
          }
          this.layout_1_2.style = {
            top: 0,
            left: '50%',
            right: 0,
            bottom: '50%'
          }
          this.layout_2_1.style = {
            top: '50%',
            left: 0,
            right: '50%',
            bottom: 0
          }
          this.layout_2_2.style = {
            top: '50%',
            left: '50%',
            right: 0,
            bottom: 0
          }
        }
//        else if (menuName === '3By3') {
//          this.$store.commit('SET_LAYOUT_TYPE', menuName)
//
//          this.layout_1_1.style = {
//            top: 0,
//            left: 0,
//            right: '66.6%',
//            bottom: '66.6%'
//          }
//          this.layout_1_2.style = {
//            top: 0,
//            left: '33.3%',
//            right: '33.3%',
//            bottom: '66.6%'
//          }
//          this.layout_1_3.style = {
//            top: 0,
//            left: '66.6%',
//            right: 0,
//            bottom: '66.6%'
//          }
//
//          this.layout_2_1.style = {
//            top: '33.3%',
//            left: 0,
//            right: '66.6%',
//            bottom: '33.3%'
//          }
//          this.layout_2_2.style = {
//            top: '33.3%',
//            left: '33.3%',
//            right: '33.3%',
//            bottom: '33.3%'
//          }
//          this.layout_2_3.style = {
//            top: '33.3%',
//            left: '66.6%',
//            right: 0,
//            bottom: '33.3%'
//          }
//
//          this.layout_3_1.style = {
//            top: '66.6%',
//            left: 0,
//            right: '66.6%',
//            bottom: 0
//          }
//          this.layout_3_2.style = {
//            top: '66.6%',
//            left: '33.3%',
//            right: '33.3%',
//            bottom: 0
//          }
//          this.layout_3_3.style = {
//            top: '66.6%',
//            left: '66.6%',
//            right: 0,
//            bottom: 0
//          }
//        }
      },
      menuClicked (menu) {
        if (menu.meta.type === 'layout') {
          this.setLayoutsWithMenuName(menu.name)
        } else {
          this.$store.commit(mutationType.SELECT_MENU, menu)
        }
      },
      mouseOver (e) {
        console.log(`MouseOver : `)
        console.log(e.target)
      },
      onScroll (e) {
        console.log('scrolling')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../style/bh_style.scss";

  #app-content-area {
  }

  .viewer-area {
    padding: 0;
    padding-top: 52px;
    padding-left: 180px;
    width: 100vw;
    height: 100vh;
    background-color: #282828;

    .app-content {
      height: 100%;

      .layout-area {
        margin: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;

        .layouts {
          position: absolute;
          padding: 1em;
          border: 1px solid #000;
          background-color: $layouts-bg-color;
        }
      }
    }
  }
</style>
