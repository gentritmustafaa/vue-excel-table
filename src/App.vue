<template>
  <div id="app">
    <VueExcelTable></VueExcelTable>
  </div>
</template>

<script>
  import VueExcelTable from '@/components/VueExcelTable'

  export default {
      components: {
          VueExcelTable
      }
  }
</script>

<style lang="scss">
  #id {
    display: flex;
    justify-content: center;
    margin-top: 100px;
  }
</style>
