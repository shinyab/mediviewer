<template>
  <div class="app-main">
    <router-view></router-view>
    <!--<vue-draggable-resizable :parent="true" style="border-radius: 5px; background-color: #282828; z-index: 2000;">-->
      <!--<div style="margin-top:40px; width:100%; height: 80%; background-color: #0d0c0f">-->
        <!--<ul style="height: 100%">-->
          <!--<li v-for="n in 10" style="cursor: crosshair;">-->
            <!--awefwaefawef-->
          <!--</li>-->
        <!--</ul>-->
      <!--</div>-->
    <!--</vue-draggable-resizable>-->
  </div>
</template>

<script>
  export default {
    name: 'AppContents'
  }
</script>

<style lang="scss" scoped>
  #app-main {
  }
</style>
