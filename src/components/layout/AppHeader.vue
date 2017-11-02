<template>
  <section class="hero is-bold app-navbar">

    <div class="hero-head">

      <div class="nav-load-file-area">
        <b-field class="nav-load-file-b-field">
          <b-upload v-model="files" accept=".zip" @change.native="fileUploaded">
            <a class="button nav-load-file-button">
              <img src="/static/images/icons/img-nor-over-open-dicom.svg">
              <span>Load Dicom file</span>
            </a>
          </b-upload>
        </b-field>

        <span v-if="files && files.length" class="nav-load-file-label">&nbsp; | &nbsp;Viewer : {{ files[0].name }}</span>
      </div>

      <nav class="nav">
        <div class="nav-left">
          <router-link to="/viewer" class="nav-item hero-brand">
            <a style="height: 40px">
              <img src="/static/images/logos/img-logo.svg">
            </a>
          </router-link>
        </div>

        <div class="nav-right">
          <a class="button nav-help-button">
            Help
          </a>
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
    background-color: $header-bg-color;
  }

  .hero .nav {
    height: $header-height;
    box-shadow: none;
  }

  .hero-head {
    height: $header-height;
  }

  .nav-item img {
    max-height: 100%;
  }

  .nav-load-file-area {
    position: fixed;
    left: $sidebar-width;
    z-index: 1025;
    display: inline;
  }
  .nav-load-file-b-field {

  }
  .nav-load-file-button {
    margin-top: 20px;
    padding: 0 15px 0 0;
    width: 172px;
    height: 40px;
    background-color: $header-load-file-button-normal-color;
    color: $header-load-file-button-normal-label-color;
    border: none;

    span {
      font-size: 15px;
    }

    &:hover {
      background-color: #4c456d;
    }
  }
  .nav-load-file-label {
    margin-left: 177px;
    margin-top: 30px;
    top: 0px;
    width: 400px;
    height: 20px;
    font-size: 15px;
    color: white;
    position: absolute;
  }

  .nav-help-button {
    width: 80px;
    height: 80px;
    background-color: $header-help-button-normal-color;
    color: $header-help-button-normal-label-color;
    border: none;

    &:hover {
      background-color: #4c456d;
    }
  }
</style>
