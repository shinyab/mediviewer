<template>
  <section class="hero is-bold app-navbar">

    <div class="hero-head">

      <b-field style="position: fixed; left: 0; top: 0; height: 52px; width: 250px; z-index: 1025;">
        <b-upload v-model="files" accept=".zip" @change.native="fileUploaded">
          <a class="button is-white" style="width: 100%; height: 100%;">
            <img src="/static/sample/imgs/folder_open.png" style="width: 24px; height: 24px; top: 0; left: 0;">
            &nbsp;<span>Load DICOM file</span>
          </a>
        </b-upload>
      </b-field>

      <nav class="nav">
        <div class="nav-center" >
          <router-link to="/" class="nav-item hero-brand" style="color: white;">
            MEDI Viewer&nbsp;<span v-if="files && files.length">({{ files[0].name }})</span>
          </router-link>
        </div>
      </nav>
    </div>
  </section>
</template>

<script>
  import * as busType from '@/util/bus/bus-types'

  export default {
    name: 'AppHeader',
    data () {
      return {
        files: null
      }
    },
    methods: {
      fileUploaded () {
        this.$bus.$emit(busType.FILE_UPLOADED, this.files[0])
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../style/bh_style.scss";

  .app-navbar {
    position: fixed;
    width: 100%;
    z-index: 1024;
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
    background-color: $header-bg-color;

    /*.container {*/
      /*margin: auto 10px;*/
    /*}*/
  }
</style>
