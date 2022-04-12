<template>
  <div class="tenant">
    <div class="top">
      <div class="logo">
        <img src="@/assets/jnpf.png" alt="">
      </div>
      <span>· 租户管理中心</span>
    </div>
    <div class="mian-tab">
      <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center">
          <el-row class="JNPF-common-search-box" :gutter="16">
            <el-form :inline="true" size="small">
              <el-form-item class="keyword">
                <el-input v-model="listQuery.keyword" placeholder="请输入关键字" clearable />
              </el-form-item>
              <el-form-item>
                <el-date-picker v-model="timeArr" type="daterange" range-separator="至"
                  start-placeholder="开始日期" end-placeholder="结束日期" value-format="timestamp"
                  :picker-options="pickerOptions" :editable="false" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
                <el-button icon="el-icon-refresh-right" @click="reset()">重置</el-button>
              </el-form-item>
            </el-form>
          </el-row>
          <div class="JNPF-common-layout-main JNPF-flex-main">
            <div class="JNPF-common-head">
              <el-button icon="el-icon-plus" @click="addOrUpdateHandle()" type="primary"
                size="small">新建</el-button>
              <div class="JNPF-common-head-right">
                <el-tooltip effect="dark" content="刷新" placement="top">
                  <el-link icon="el-icon-refresh JNPF-common-head-icon" :underline="false"
                    @click="initData()" />
                </el-tooltip>
              </div>
            </div>
            <JNPF-table :data="list" size="small" v-loading="listLoading">
              <el-table-column prop="enCode" label="账号" width="180" />
              <el-table-column prop="fullName" label="姓名" width="180" />
              <el-table-column prop="companyName" label="公司" />
              <el-table-column prop="creatorTime" label="注册时间">
                <template slot-scope="scope">
                  {{ toDate(scope.row.creatorTime) }}
                </template>
              </el-table-column>
              <el-table-column prop="expiresTime" label="过期时间">
                <template slot-scope="scope">
                  {{toDate(scope.row.expiresTime)}}
                </template>
              </el-table-column>
              <el-table-column label="备注" prop="description" />
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <el-button type="text" size="mini" @click="addOrUpdateHandle(scope.row.id)">编辑
                  </el-button>
                  <el-button type="text" size="mini" class="JNPF-table-delBtn"
                    @click="handleDel(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </JNPF-table>
            <pagination :total="total" :page.sync="listQuery.currentPage"
              :limit.sync="listQuery.pageSize" @pagination="initData" />
          </div>
        </div>
      </div>
    </div>
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" />
  </div>
</template>

<script>
import { getTenantList, delTenant } from '@/api/tenant'
import Form from './Form'
export default {
  name: 'tenant',
  components: { Form },
  data() {
    return {
      listLoading: false,
      listQuery: {
        startTime: '',
        endTime: '',
        keyword: '',
        currentPage: 1,
        pageSize: 20,
        sort: 'desc',
        sidx: ''
      },
      formVisible: false,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      timeArr: [],
      list: [],
      total: 0
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      this.listLoading = true
      getTenantList(this.listQuery).then(res => {
        this.list = res.data.list
        this.total = res.data.pagination.total
        this.listLoading = false
      }).catch(() => { this.listLoading = false })
    },
    search() {
      if (this.timeArr && this.timeArr.length) {
        this.listQuery.startTime = this.timeArr[0]
        this.listQuery.endTime = this.timeArr[1]
      } else {
        this.listQuery.startTime = ''
        this.listQuery.endTime = ''
      }
      this.listQuery = {
        ...this.listQuery,
        currentPage: 1,
        pageSize: 20,
        sort: 'desc',
        sidx: ''
      }
      this.initData()
    },
    reset() {
      this.listQuery = {
        startTime: '',
        endTime: '',
        keyword: '',
        currentPage: 1,
        pageSize: 20,
        sort: 'desc',
        sidx: ''
      }
      this.timeArr = []
      this.initData()
    },
    addOrUpdateHandle(id) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id)
      })
    },
    handleDel(id) {
      this.$confirm('此操作将永久删除该租户, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        delTenant(id, { isClear: 1 }).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1500,
            onClose: () => {
              this.initData()
            }
          })
        }).catch(() => { })
      }).catch(() => { })
    },
    toDate(v, format) {
      format = format ? format : "yyyy-MM-dd"
      if (!v) return ""
      var d = v
      if (typeof v === 'string') {
        if (v.indexOf("/Date(") > -1)
          d = new Date(parseInt(v.replace("/Date(", "").replace(")/", ""), 10));
        else
          d = new Date(Date.parse(v.replace(/-/g, "/").replace("T", " ").split(".")[0]));
      } else {
        d = new Date(v)
      }
      var o = {
        "M+": d.getMonth() + 1,
        "d+": d.getDate(),
        "h+": d.getHours(),
        "H+": d.getHours(),
        "m+": d.getMinutes(),
        "s+": d.getSeconds(),
        "q+": Math.floor((d.getMonth() + 3) / 3),
        "S": d.getMilliseconds()
      };
      if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length))
      }
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
          format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length))
        }
      }
      return format
    }
  }
}
</script>

<style scoped lang="scss">
.tenant {
  width: 100%;
  height: 100%;
  background: #ebeef5;
  .top {
    display: flex;
    align-items: center;
    background: #fff;
    .logo {
      width: 60px;
      height: 60px;
      margin-left: 10px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    span {
      font-size: 16px;
    }
  }
  .mian-tab {
    padding: 10px;
    height: calc(100% - 60px);
    background: #ebeef5;
    box-sizing: border-box;
  }
  .el-table thead {
    color: #909399;
    font-weight: 500;
  }

  .el-table thead tr,
  .el-table thead tr th {
    background-color: #f5f7fa !important;
    font-weight: normal;
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
  .pagination-container {
    margin-top: 10px;
    padding-right: 10px;
  }
}
</style>