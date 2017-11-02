<template>
  <div id="app-content-area">
    <sidebar></sidebar>
    <section class="viewer-area">
      <div class="container is-fluid is-marginless app-content">

        <div class="layout-area">

          <div id="layout-1-1" class="layouts"
               ref="layout1By1"
               v-if="currentLayout.name === '1By1' || currentLayout.name === '2By2' || currentLayout.name === '3By'"
               :class="{ active: $refs.layout1By1 === focusedCanvas }"
               :style="layout_1_1.style"
               @mousemove="onMouseMove"
               @mousedown.left="mousedownLeft"
               @mousedown.middle="mousedownMiddle"
               @mousedown.right="mousedownRight"
               @mouseup.left="isMouseDown = false, mouseLastPosition = {}"
               @mouseup.middle="isMouseDown = false, mouseLastPosition = {}"
               @mouseup.right="isMouseDown = false, mouseLastPosition = {}"
               @mouseenter="isMouseDown = false, mouseLastPosition = {}"
               @mouseleave="isMouseDown = false, mouseLastPosition = {}"
               @mouseout="isMouseDown = false, mouseLastPosition = {}"
          ></div>

          <div id="layout-1-2" class="layouts"
               ref="layout1By2"
               v-show="currentLayout.name === '2By2' || currentLayout.name === '3By'"
               :class="{ active: $refs.layout1By2 === focusedCanvas }"
               :style="layout_1_2.style"
               @mousemove="onMouseMove"
               @mousedown.left="mousedownLeft"
               @mousedown.middle="mousedownMiddle"
               @mousedown.right="mousedownRight"
               @mouseup.left="isMouseDown = false, mouseLastPosition = {}"
               @mouseup.middle="isMouseDown = false, mouseLastPosition = {}"
               @mouseup.right="isMouseDown = false, mouseLastPosition = {}"
               @mouseenter="isMouseDown = false, mouseLastPosition = {}"
               @mouseleave="isMouseDown = false, mouseLastPosition = {}"
               @mouseout="isMouseDown = false, mouseLastPosition = {}"
          ></div>
          <div id="layout-2-1" class="layouts"
               ref="layout2By1"
               v-show="currentLayout.name === '2By2' || currentLayout.name === '3By'"
               :class="{ active: $refs.layout2By1 === focusedCanvas }"
               :style="layout_2_1.style"
               @mousemove="onMouseMove"
               @mousedown.left="mousedownLeft"
               @mousedown.middle="mousedownMiddle"
               @mousedown.right="mousedownRight"
               @mouseup.left="isMouseDown = false, mouseLastPosition = {}"
               @mouseup.middle="isMouseDown = false, mouseLastPosition = {}"
               @mouseup.right="isMouseDown = false, mouseLastPosition = {}"
               @mouseenter="isMouseDown = false, mouseLastPosition = {}"
               @mouseleave="isMouseDown = false, mouseLastPosition = {}"
               @mouseout="isMouseDown = false, mouseLastPosition = {}"
          ></div>
          <div id="layout-2-2" class="layouts"
               ref="layout2By2"
               v-show="currentLayout.name === '2By2' || currentLayout.name === '3By'"
               :class="{ active: $refs.layout2By2 === focusedCanvas }"
               :style="layout_2_2.style"
               @mousemove="onMouseMove"
               @mousedown.left="mousedownLeft"
               @mousedown.middle="mousedownMiddle"
               @mousedown.right="mousedownRight"
               @mouseup.left="isMouseDown = false, mouseLastPosition = {}"
               @mouseup.middle="isMouseDown = false, mouseLastPosition = {}"
               @mouseup.right="isMouseDown = false, mouseLastPosition = {}"
               @mouseenter="isMouseDown = false, mouseLastPosition = {}"
               @mouseleave="isMouseDown = false, mouseLastPosition = {}"
               @mouseout="isMouseDown = false, mouseLastPosition = {}"
          ></div>

          <!--<div id="layout-1-2" ref="layout1By2" class="layouts" :style="layout_1_2.style"-->
               <!--v-if="currentLayout === '2By2' || currentLayout === '3By'" @mouseover="mouseOver"></div>-->
          <!--<div id="layout-2-1" ref="layout2By1" class="layouts" :style="layout_2_1.style"-->
               <!--v-if="currentLayout === '2By2' || currentLayout === '3By'" @mouseover="mouseOver"></div>-->
          <!--<div id="layout-2-2" ref="layout2By2" class="layouts" :style="layout_2_2.style"-->
               <!--v-if="currentLayout === '2By2' || currentLayout === '3By'" @mouseover="mouseOver"></div>-->

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

  import {init, loadZip, loadSegmentation, getStack} from '@/lib/medic3d/'

  import Sidebar from '@/components/layout/Sidebar'

  export default {
    name: 'DicomViewer',
    components: {
      Sidebar
    },
    computed: {
      ...mapState({
        currentLayout: 'currentLayout',
        currentMenu: 'currentMenu',
        focusedCanvas: 'focusedCanvas'
      })
    },
    data () {
      return {
        uploadedFile: null,
        layout_1_1: {},
        layout_1_2: {},
        layout_2_1: {},
        layout_2_2: {},
//        layout_2_3: {},
//        layout_3_1: {},
//        layout_3_2: {},
//        layout_3_3: {},
        mouseLastPosition: {},
        mouseTimer: null,
        mousemove_ok: true,
        isMousedown: false,
        dicomfiles: null,
        r0: {}
      }
    },
    created () {
      this.$bus.$on(busType.MENU_CLICKED, this.menuClicked)
      this.$bus.$on(busType.FILE_UPLOADED, this.setUploadedFile)

      this.mouseTimer = setInterval(() => {
        this.mousemove_ok = true
      }, 100)
    },
    mounted () {
      console.log('### Mounted');
      this.initLayouts()
    },
    methods: {
      setUploadedFile (uploadedFile) {
        this.uploadedFile = uploadedFile
        loadZip(uploadedFile);
        init();
      },
      loadSegmentation (uploadFile) {
        console.log(uploadFile);
        loadSegmentation(uploadFile);
        console.log('Stack ' + getStack()._numberOfFrames);
      },
      initLayouts () {
//        this.layout_1_1 = {
//          obj: this.$refs.layout1By1, // == document.getElementById('layout-1-1'),
//          style: {
//            top: 0,
//            left: 0,
//            right: 0,
//            bottom: 0
//          }
//        }
//        this.layout_1_2 = { obj: this.$refs.layout1By2 } // == document.getElementById('layout-1-2'),
//        this.layout_2_1 = { obj: this.$refs.layout2By1 } // == document.getElementById('layout-2-1'),
//        this.layout_2_2 = { obj: this.$refs.layout2By2 } // == document.getElementById('layout-2-2'),
        this.setLayoutsWithMenuName('2By2');
      },
      setLayoutsWithMenuName (layout) {
        if (layout.name === '1By1') {
          this.$store.commit('SET_LAYOUT_TYPE', layout)

          this.layout_1_1.style = {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }
        } else if (layout.name === '2By2') {
          this.$store.commit('SET_LAYOUT_TYPE', layout)

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
      },
      menuClicked (menu) {
        if (menu.type === 'layout') {
          this.setLayoutsWithMenuName(menu)
        } else if (menu.type === 'select') {
          this.$store.commit(mutationType.SELECT_MENU, menu)
        }
      },
      mouseOver (e) {
        console.log(`MouseOver : `)
        console.log(e.target)
      },
      onScroll (e) {
        console.log('scrolling')
      },
      onMouseMove (event) {
        if (this.isMouseDown && this.mousemove_ok) {
          this.mousemove_ok = false
          if (typeof (this.mouseLastPosition.x) !== 'undefined') {
            var deltaX = this.mouseLastPosition.x - event.clientX
            var deltaY = this.mouseLastPosition.y - event.clientY
            if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX > 0) {
              // left
              console.log(`Left \ndeltaX : ${deltaX} / deltaY : ${deltaY}`)
            } else if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX < 0) {
              // right
              console.log(`Right \ndeltaX : ${deltaX} / deltaY : ${deltaY}`)
            } else if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY > 0) {
              // up
              console.log(`Up \ndeltaX : ${deltaX} / deltaY : ${deltaY}`)
            } else if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY < 0) {
              // down
              console.log(`Down \ndeltaX : ${deltaX} / deltaY : ${deltaY}`)
            }
          }
          this.mouseLastPosition = {
            x: event.clientX,
            y: event.clientY
          }
        }
      },
      mousedownLeft (e) {
        console.log('Left Mousedown')
        this.isMouseDown = true
//        console.log(e.target)
        this.$store.commit(mutationType.SELECT_CANVAS, e.target)
      },
      mousedownMiddle (e) {
        console.log('Middle Mousedown')
        this.isMouseDown = true
//        console.log(e.target)
        this.$store.commit(mutationType.SELECT_CANVAS, e.target)
      },
      mousedownRight (e) {
        console.log('Right Mousedown')
        this.isMouseDown = true
//        console.log(e.target)
        this.$store.commit(mutationType.SELECT_CANVAS, e.target)
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
    padding-top: $header-height;
    padding-left: $sidebar-width;
    width: 100vw;
    height: 100vh;
    background-color: #000000;

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
          border: 3px solid #424242;
          background-color: $layouts-bg-color;
          overflow: hidden;
        }

        .active {
          border-color: #583edb;
        }
      }
    }
  }
</style>
