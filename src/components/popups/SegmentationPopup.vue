<template>
  <vue-draggable-resizable
    :parent="true"
    :x="0" :y="80" :z="2000"
    :w="350" :h="400"
    :minw="350" :minh="400">
    <div style="margin-top:40px; width:100%; height: 80%; background-color: #0d0c0f">
      <ul style="height: 100%">
        <li v-for="n in 10" style="cursor: crosshair;">
          awefwaefawef
        </li>
      </ul>
    </div>
  </vue-draggable-resizable>
</template>

<script>
  export default {
    name: 'SegmentationPopup'
  }
</script>

<style lang="scss" scoped>

</style>
