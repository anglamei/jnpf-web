<template>
  <el-dialog :title="!dataForm.id ? '新建租户' : '编辑租户'" :close-on-click-modal="false"
    :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll width="600px">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" v-loading="formLoading"
      label-width="100px" size="small">
      <el-form-item label="账号" prop="enCode" required>
        <el-input v-model="dataForm.enCode" placeholder="请输入账号" :disabled="disabled"/>
      </el-form-item>
      <el-form-item label="公司" prop="companyName" required>
        <el-input v-model="dataForm.companyName" placeholder="请输入公司" />
      </el-form-item>
      <el-form-item label="姓名" prop="fullName" required>
        <el-input v-model="dataForm.fullName" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="过期时间" prop="expiresTime">
        <el-date-picker v-model="dataForm.expiresTime" type="date" placeholder="选择日期"
          value-format="timestamp" :editable="false" />
      </el-form-item>
      <el-form-item label="备注" prop="description">
        <el-input type="textarea" v-model="dataForm.description" :rows="3" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false" size="small">取 消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :loading="btnLoading" size="small">确 定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getTenantInfo, addTenant, updateTenant } from '@/api/tenant'

export default {
  data() {
    return {
      visible: false,
      disabled: false,
      formLoading: false,
      btnLoading: false,
      dataForm: {
        companyName: '',
        enCode: '',
        fullName: '',
        expiresTime: '',
        description: ''
      },
      dataRule: {
        enCode: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        companyName: [
          { required: true, message: '请输入公司名称', trigger: 'blur' }
        ],
        fullName: [
          { required: true, message: '请输入个人姓名', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(id) {
      this.dataForm.id = id || ''
      this.visible = true
      this.formLoading = true
      this.$nextTick(() => {
        this.disabled = false
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          getTenantInfo(this.dataForm.id).then(res => {
            this.dataForm = res.data
            this.disabled = true
          })
        }
      })
      this.formLoading = false
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          const formMethod = this.dataForm.id ? updateTenant : addTenant
          formMethod(this.dataForm).then(res => {
            this.$message({
              message: res.msg,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.btnLoading = false
                this.$emit('refreshDataList')
              }
            })
          }).catch(() => {
            this.btnLoading = false
          })
        }
      })
    }
  }
}
</script>