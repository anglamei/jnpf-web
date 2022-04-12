<template>
  <div class="build views">
    <container :props="props" ref="container"></container>
  </div>
</template>
<script>
import init from '@/mixins/'
export default {
  props: {
    props: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  mixins: [init],
}
</script>
<style lang="scss">
@import "../styles/style.scss";
</style>