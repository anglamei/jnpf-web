<!-- 表格配置 -->
<template>
  <div>
    <el-form-item label="开启滚动">
      <avue-switch v-model="main.activeOption.scroll">
      </avue-switch>
    </el-form-item>
    <el-form-item label="开启显隐">
      <avue-switch v-model="main.activeOption.columnShow">
      </avue-switch>
    </el-form-item>
    <template v-if="main.activeOption.scroll">
      <el-form-item label="滚动时间">
        <avue-input-number v-model="main.activeOption.scrollTime">
        </avue-input-number>
      </el-form-item>
      <el-form-item label="滚动行数">
        <avue-input-number v-model="main.activeOption.scrollCount">
        </avue-input-number>
      </el-form-item>
    </template>
    <el-form-item label="开启排名">
      <avue-switch v-model="main.activeOption.index"></avue-switch>
    </el-form-item>
    <el-collapse accordion>
      <el-collapse-item title="表头设置">
        <el-form-item label="背景">
          <avue-input-color type="textarea"
                            v-model="main.activeOption.headerBackground"></avue-input-color>
        </el-form-item>
        <el-form-item label="字体颜色">
          <avue-input-color type="textarea"
                            v-model="main.activeOption.headerColor"></avue-input-color>
        </el-form-item>
      </el-collapse-item>
      <el-collapse-item title="表格设置">
        <el-form-item label="字体大小">
          <avue-input-number v-model="main.activeOption.fontSize">
          </avue-input-number>
        </el-form-item>
        <el-form-item label="显示行数">
          <avue-input-number v-model="main.activeOption.count">
          </avue-input-number>
        </el-form-item>
        <el-form-item label="文字颜色">
          <avue-input-color type="textarea"
                            v-model="main.activeOption.bodyColor"></avue-input-color>
        </el-form-item>
        <el-form-item label="奇行颜色">
          <avue-input-color type="textarea"
                            v-model="main.activeOption.nthColor"></avue-input-color>
        </el-form-item>
        <el-form-item label="偶行颜色">
          <avue-input-color type="textarea"
                            v-model="main.activeOption.othColor"></avue-input-color>
        </el-form-item>
      </el-collapse-item>
      <el-collapse-item title="表格列设置">
        <avue-crud :option="tableOption"
                   :data="main.activeOption.column"
                   @row-save="rowSave"
                   @row-del="rowDel"
                   @row-update="rowUpdate"></avue-crud>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { tableOption, dicOption } from '@/option/config'

export default {
  data () {
    return {
      dicOption: dicOption,
      tableOption: tableOption
    }
  },
  inject: ["main"],
  methods: {
    rowSave (row, done) {
      this.main.activeOption.column.push(row);
      done()
    },
    rowDel (row, index) {
      this.main.activeOption.column.splice(index, 1);
    },
    rowUpdate (row, index, done) {
      this.main.activeOption.column.splice(index, 1, row);
      done()
    },
  }
}
</script>

<style>
</style>