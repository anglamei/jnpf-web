<template>
  <div :style="{fontSize:fontSize,color:'#fff'}">
    <h2>自定义组件</h2>
    <h3>我是参数:{{option.data}}</h3>
  </div>
</template>
<script>
export default {
  name: 'test',
  props: {
    option: Object,
    component: Object
  },
  computed: {
    fontSize () {
      return (this.option.fontSize || 30) + 'px'
    }
  }
}
</script>