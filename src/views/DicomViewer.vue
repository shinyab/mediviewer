<template>
  <div id="app-content-area">
    <sidebar></sidebar>
    <section class="viewer-area">
      <div class="container is-fluid is-marginless app-content">

        <div class="layout-area">
          <div id="layout-1-1" ref="layout1By1" class="layouts" style="background-color: black" :style="layout_1_1.style" v-if="layoutType === 1 || layoutType === 2 || layoutType === 3" @mouseover="mouseOver"></div>

          <div id="layout-1-2" ref="layout1By2" class="layouts" style="background-color: bisque"  :style="layout_1_2.style" v-if="layoutType === 2 || layoutType === 3" @mouseover="mouseOver"></div>
          <div id="layout-2-1" ref="layout2By1" class="layouts" style="background-color: aquamarine"  :style="layout_2_1.style" v-if="layoutType === 2 || layoutType === 3" @mouseover="mouseOver"></div>
          <div id="layout-2-2" ref="layout2By2" class="layouts" style="background-color: aqua"  :style="layout_2_2.style" v-if="layoutType === 2 || layoutType === 3" @mouseover="mouseOver"></div>

          <div id="layout-1-3" ref="layout1By3" class="layouts" style="background-color: yellow"  :style="layout_1_3.style" v-if="layoutType === 3" @mouseover="mouseOver"></div>
          <div id="layout-2-3" ref="layout2By3" class="layouts" style="background-color: rebeccapurple"  :style="layout_2_3.style" v-if="layoutType === 3" @mouseover="mouseOver"></div>
          <div id="layout-3-1" ref="layout3By1" class="layouts" style="background-color: blue"  :style="layout_3_1.style" v-if="layoutType === 3" @mouseover="mouseOver"></div>
          <div id="layout-3-2" ref="layout3By2" class="layouts" style="background-color: green"  :style="layout_3_2.style" v-if="layoutType === 3" @mouseover="mouseOver"></div>
          <div id="layout-3-3" ref="layout3By3" class="layouts" style="background-color: burlywood"  :style="layout_3_3.style" v-if="layoutType === 3" @mouseover="mouseOver"></div>
        </div>

      </div>
    </section>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import Sidebar from '@/components/layout/Sidebar'

  export default {
    name: 'DicomViewer',
    components: {
      Sidebar
    },
    computed: {
      ...mapState(['layoutType'])
    },
    data () {
      return {
        layout_1_1: {},
        layout_1_2: {},
        layout_1_3: {},
        layout_2_1: {},
        layout_2_2: {},
        layout_2_3: {},
        layout_3_1: {},
        layout_3_2: {},
        layout_3_3: {}
      }
    },
    created () {
      this.$bus.$on('MENU_CLICKED', this.menuClicked)
    },
    mounted () {
      this.initLayouts()
    },
    methods: {
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
        this.layout_1_3 = { obj: this.$refs.layout1By3 } // == document.getElementById('layout-1-3'),
        this.layout_2_1 = { obj: this.$refs.layout2By1 } // == document.getElementById('layout-2-1'),
        this.layout_2_2 = { obj: this.$refs.layout2By2 } // == document.getElementById('layout-2-2'),
        this.layout_2_3 = { obj: this.$refs.layout2By3 } // == document.getElementById('layout-2-3'),
        this.layout_3_1 = { obj: this.$refs.layout3By1 } // == document.getElementById('layout-3-1'),
        this.layout_3_2 = { obj: this.$refs.layout3By2 } // == document.getElementById('layout-3-2'),
        this.layout_3_3 = { obj: this.$refs.layout3By3 } // == document.getElementById('layout-3-3'),
      },
      setLayoutsWithMenuName (menuName) {
        if (menuName === '1By1') {
          this.$store.commit('SET_LAYOUT_TYPE', 1)

          this.layout_1_1 = {
//            obj: this.$refs.layout1By1,
            style: {
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
            }
          }
        } else if (menuName === '2By2') {
          this.$store.commit('SET_LAYOUT_TYPE', 2)

          this.layout_1_1 = {
            style: {
              top: 0,
              left: 0,
              right: '50%',
              bottom: '50%'
            }
          }
          this.layout_1_2 = {
            style: {
              top: 0,
              left: '50%',
              right: 0,
              bottom: '50%'
            }
          }
          this.layout_2_1 = {
            style: {
              top: '50%',
              left: 0,
              right: '50%',
              bottom: 0
            }
          }
          this.layout_2_2 = {
            style: {
              top: '50%',
              left: '50%',
              right: 0,
              bottom: 0
            }
          }
        } else if (menuName === '3By3') {
          this.$store.commit('SET_LAYOUT_TYPE', 3)

          this.layout_1_1 = {
            style: {
              top: 0,
              left: 0,
              right: '66.6%',
              bottom: '66.6%'
            }
          }
          this.layout_1_2 = {
            style: {
              top: 0,
              left: '33.3%',
              right: '33.3%',
              bottom: '66.6%'
            }
          }
          this.layout_1_3 = {
            style: {
              top: 0,
              left: '66.6%',
              right: 0,
              bottom: '66.6%'
            }
          }

          this.layout_2_1 = {
            style: {
              top: '33.3%',
              left: 0,
              right: '66.6%',
              bottom: '33.3%'
            }
          }
          this.layout_2_2 = {
            style: {
              top: '33.3%',
              left: '33.3%',
              right: '33.3%',
              bottom: '33.3%'
            }
          }
          this.layout_2_3 = {
            style: {
              top: '33.3%',
              left: '66.6%',
              right: 0,
              bottom: '33.3%'
            }
          }

          this.layout_3_1 = {
            style: {
              top: '66.6%',
              left: 0,
              right: '66.6%',
              bottom: 0
            }
          }
          this.layout_3_2 = {
            style: {
              top: '66.6%',
              left: '33.3%',
              right: '33.3%',
              bottom: 0
            }
          }
          this.layout_3_3 = {
            style: {
              top: '66.6%',
              left: '66.6%',
              right: 0,
              bottom: 0
            }
          }
        }
      },
      menuClicked (menu) {
        if (menu.meta.type === 'layout') {
          this.setLayoutsWithMenuName(menu.name)
        }
      },
      mouseOver (e) {
        console.log(`MouseOver : `)
        console.log(e.target)
      }
    }
  }
</script>

<style lang="scss" scoped>
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
          background-color: #282828;
        }

         /*1 X 1*/
        /*#layout-1-1 {*/
          /*top: 0;*/
          /*left: 0;*/
          /*right: 0;*/
          /*bottom: 0;*/
        /*}*/

        /*!* 2 X 2 *!*/
        /*#layout-2-1 {*/
          /*top: 0;*/
          /*left: 0;*/
          /*right: 50%;*/
          /*bottom: 50%;*/
        /*}*/
        /*#layout-2-2 {*/
          /*top: 0;*/
          /*left: 50%;*/
          /*right: 0;*/
          /*bottom: 50%;*/
        /*}*/
        /*#layout-2-3 {*/
          /*top: 50%;*/
          /*left: 0;*/
          /*right: 50%;*/
          /*bottom: 0;*/
        /*}*/
        /*#layout-2-4 {*/
          /*top: 50%;*/
          /*left: 50%;*/
          /*right: 0;*/
          /*bottom: 0;*/
        /*}*/

        /*!* 3 X 3 *!*/
        /*#layout-3-1 {*/
          /*top: 0;*/
          /*left: 0;*/
          /*right: 66.6%;*/
          /*bottom: 66.6%;*/
        /*}*/
        /*#layout-3-2 {*/
          /*top: 0;*/
          /*left: 33.3%;*/
          /*right: 33.3%;*/
          /*bottom: 66.6%;*/
        /*}*/
        /*#layout-3-3 {*/
          /*top: 0;*/
          /*left: 66.6%;*/
          /*right: 0;*/
          /*bottom: 66.6%;*/
        /*}*/

        /*#layout-3-4 {*/
          /*top: 33.3%;*/
          /*left: 0;*/
          /*right: 66.6%;*/
          /*bottom: 33.3%;*/
        /*}*/


        /*#layout-3-5 {*/
          /*top: 33.3%;*/
          /*left: 33.3%;*/
          /*right: 33.3%;*/
          /*bottom: 33.3%;*/
        /*}*/
        /*#layout-3-6 {*/
          /*top: 33.3%;*/
          /*left: 66.6%;*/
          /*right: 0;*/
          /*bottom: 33.3%;*/
        /*}*/

        /*#layout-3-7 {*/
          /*top: 66.6%;*/
          /*left: 0;*/
          /*right: 66.6%;*/
          /*bottom: 0;*/
        /*}*/
        /*#layout-3-8 {*/
          /*top: 66.6%;*/
          /*left: 33.3%;*/
          /*right: 33.3%;*/
          /*bottom: 0;*/
        /*}*/
        /*#layout-3-9 {*/
          /*top: 66.6%;*/
          /*left: 66.6%;*/
          /*right: 0;*/
          /*bottom: 0;*/
        /*}*/
      }
    }
  }
</style>
