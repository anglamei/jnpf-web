<!-- 通用形配置 -->
<template>
  <div>
    <el-form-item label="配置列表">
      <el-button size="mini"
                 type="primary"
                 @click="openCode">编辑</el-button>
    </el-form-item>
    <codeedit @submit="codeClose"
              v-model="code.obj"
              :visible.sync="code.box"></codeedit>
  </div>
</template>

<script>
import codeedit from '../../page/group/code';
export default {
  inject: ["main"],
  data () {
    return {
      code: {
        box: false,
        obj: {},
      }
    }
  },
  components: {
    codeedit
  },
  methods: {
    codeClose (value) {
      this.main.activeObj[this.code.type] = value;
    },
    openCode () {
      this.code.type = 'echartFormatter';
      this.code.obj = this.main.activeObj[this.code.type];
      this.code.box = true;
    },
  }
}
</script>

<style>
</style>