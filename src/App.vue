<template>
  <div id="app">
    <app-header></app-header>
    <app-contents></app-contents>
  </div>
</template>

<script>
  import AppHeader from '@/components/layout/AppHeader'
  import AppContents from '@/components/layout/AppContents'

  export default {
    name: 'app',
    components: {
      AppHeader,
      AppContents
    }
  }
</script>

<style>
  html {
    overflow: hidden;
  }
</style>
