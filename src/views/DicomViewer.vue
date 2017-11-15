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
        </div>

      </div>
    </section>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import * as mutationType from '@/store/mutation-types'
  import * as busType from '@/util/bus/bus-types'

//  import {init, loadZip, loadSegmentation, getStack} from '@/lib/medic3d/'
  import * as Medic3D from '@/lib/medic3d/'

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
        mouseLastPosition: {},
        mouseTimer: null,
        mousemove_ok: true,
        isMousedown: false,
        dicomfiles: null,
        r0: {},
        mode: null
      }
    },
    created () {
      this.$bus.$on(busType.MENU_CLICKED, this.menuClicked)
      this.$bus.$on(busType.FILE_UPLOADED, this.setUploadedFile)
      this.$bus.$on(busType.FILE_UPLOADED_SEG, this.loadSegmentation)

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
        Medic3D.loadZip(uploadedFile)
          .then((state) => {
            // to need more time for rendering
            console.log('Load completed~~~~~~`');
          })
          .catch((err) => {
            console.log('An error : ' + err);
          })
        Medic3D.init();
        // disable view control
        Medic3D.CameraCtrl(false);
      },
      loadSegmentation (uploadFile) {
        console.log(uploadFile);
        Medic3D.loadSegmentation(uploadFile);
//        console.log('Stack ' + Medic3D.getStack()._numberOfFrames);
        // Todo : assign (slice, segmentation)
      },
      initLayouts () {
        this.setLayoutsWithMenuName({name: '2By2'});
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
//          this.$store.commit(mutationType.SELECT_MENU, menu)
          this.doSelect(menu);
        } else if (menu.type === 'action') {
          // case
          // reference to /store/modules/menus/index.js가 전체 메뉴. menu.name.*** 형식으로 실제 선택/클릭 확인 가능
          this.doAction(menu);
        }
        console.log('Focused CANVAS : ')
        console.log(this.focusedCanvas)
      },
      mouseOver (e) {
        console.log(`MouseOver : `)
        console.log(e.target)
      },
      onScroll (e) {
        console.log('scrolling')
      },
      onMouseMove (event) {
        // Todo : prohibit event propagation
        console.log('move mouse')
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
//        console.log(e.target.parentElement)
        this.$store.commit(mutationType.SELECT_CANVAS, e.target.parentElement)
      },
      mousedownMiddle (e) {
        console.log('Middle Mousedown')
        this.isMouseDown = true
//        console.log(e.target)
        this.$store.commit(mutationType.SELECT_CANVAS, e.target.parentElement)
      },
      mousedownRight (e) {
        console.log('Right Mousedown')
        this.isMouseDown = true
//        console.log(e.target)
        this.$store.commit(mutationType.SELECT_CANVAS, e.target.parentElement)
      },
      doAction (menu) {
        let selectId;
        if (this.focusedCanvas.id === null) {
          // unselected
          return;
        } else {
          selectId = this.focusedCanvas.id;
        }
        Medic3D.CameraCtrl(false);
        switch (menu.name) {
          case 'BrainRoiSegmentation':
            console.log('#BrainRoiSegmentation')
            break;
          case 'SegmentationResultOveray':
            console.log('#SegmentationResultOveray')
            break;
          case 'AnalysisReport':
            console.log('#AnalysisReport')
            break;
          case 'OpenSegmentations':
            console.log('#OpenSegmentations')
            break;
          case 'SaveAsDerived':
            console.log('#SaveAsDerived')
            break;
          case 'ZoomIn':
            console.log('#ZoomIn')
            Medic3D.Zoom(selectId, false);
//            Medic3D.CameraCtrl3D(3);
            break;
          case 'ZoomOut':
            console.log('#ZoomOut')
            Medic3D.Zoom(selectId, true);
//            Medic3D.CameraCtrl3D(-3);
            break;
          case 'Fit':
            Medic3D.Fit(selectId);
            console.log('#Fit')
            break;
          case 'OneToOne':
            console.log('#OneToOne')
            break;
          case 'Reload':
            console.log('#Reload')
            break;
          case 'LoadAnnotation':
            console.log('#LoadAnnotation')
            break;
          case 'Invert':
            Medic3D.Invert();
            console.log('#Invert')
            break;
          default:
            console.log('#Unknow action menu')
        }
      },
      doSelect (menu) {
        this.mode = menu.name;
        Medic3D.CameraCtrl(false);
        switch (menu.name) {
          case 'Pan':
            console.log('#Pan')
            Medic3D.CameraCtrl(true);
            break;
          case 'Stack':
            console.log('#Stack')
            break;
          case 'WindowLevel':
            console.log('#WindowLevel')
            break;
          case 'Ruler':
            console.log('#Ruler')
            break;
          case 'PolyRuler':
            console.log('#PolyRuler')
            break;
          case 'Protractor':
            console.log('#Protractor')
            break;
          case 'BrightnessContrast':
            console.log('#BrightnessContrast');
            break;
          default:
            this.mode = null;
        }
      },
      doToggle (menu) {
        switch (menu.name) {
          case 'ShowTagsToggle':
            console.log('#ShowTagsToggle')
            break;
        }
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
          padding: 0;
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
