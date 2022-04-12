<template>
  <avue-crud :option="option"
             v-model="form"
             @row-save="rowSave"
             @row-update="rowUpdate"
             @row-del="rowDel"
             :before-open="beforeOpen"
             :data="data">
    <template slot-scope="{}"
              slot="menuLeft">
      <div style="display: inline-block;">
        <a class="title"
           target="_blank"
           href="https://datav.aliyun.com/tools/atlas/#&lat=33.521903996156105&lng=104.29849999999999&zoom=4">
          <el-button type="primary"
                     icon="el-icon-add-location"
                     size="mini">
            添加更多地图
          </el-button>
        </a>
        <a class="title"
           target="_blank"
           href=" http://geojson.io/#map">
          <el-button type="primary"
                     icon="el-icon-location-information"
                     size="mini">
            画地图
          </el-button>
        </a>
      </div>
    </template>
  </avue-crud>
</template>

<script>
import { getList, getObj, addObj, delObj, updateObj } from '@/api/map'
export default {
  data () {
    return {
      form: {},
      data: [],
      option: {
        labelWidth: 100,
        index: true,
        align: 'center',
        headerAlign: 'center',
        column: [
          {
            label: '地图名称',
            prop: 'name',
            row: true,
            rules: [{
              required: true,
              message: "请输入地图名称",
              trigger: "blur"
            }]
          },
          {
            label: '地图数据',
            prop: 'data',
            span: 24,
            hide: true,
            type: 'textarea',
            minRows: 20
          }
        ]
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    vaildData (id) {
      return [0, 1, 2].includes(id)
    },
    beforeOpen (done, type) {
      if (type == 'edit') {
        getObj(this.form.id).then(res => {
          const data = res.data.data;
          this.form = data
          this.form.data = JSON.stringify(JSON.parse(this.form.data), null, 4)
          done()
        })
      } else {
        done()
      }
    },
    rowDel (row, index) {
      if (this.vaildData(index)) {
        this.$message.error('例子模板不允许修改')
        return false;
      }
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delObj(row.id).then(() => {
          this.$message.success('删除成功');
          this.getList()
        })
      }).catch(() => {

      });

    },
    rowUpdate (row, index, done) {
      if (this.vaildData(index)) {
        this.$message.error('例子模板不允许修改')
        return false;
      }
      updateObj(row).then(() => {
        this.$message.success('修改成功');
        this.getList()
        done();
      })
    },
    rowSave (row, done) {
      addObj(row).then(() => {
        this.$message.success('新增成功');
        this.getList()
        done();
      })
    },
    getList () {
      getList({
        current: 1,
        size: 100,
      }).then(res => {
        const data = res.data.data;
        this.data = data.records;
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>