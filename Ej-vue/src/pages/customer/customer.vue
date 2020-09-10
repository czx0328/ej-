<template>
  <div class="customer">
    <!-- 按钮 -->
    <div class="btns">
      <el-button type="primary" size="small" @click="toAddHandler">添加</el-button>
      <el-button type="danger" size="small" @click="batchDeleteHandler">批量删除</el-button>
    </div>
    <!-- 表单 -->
    <el-dialog :title="title" :visible.sync="visible" @close="dialogCloseHandler">
      <el-form ref="customerForm" :model="form" :rules="rules">
        <el-form-item label="姓名" label-width="60px" prop="realname">
          <el-input v-model="form.realname" autocomplete="off" />
        </el-form-item>
        <el-form-item label="手机" label-width="60px" prop="telephone">
          <el-input v-model="form.telephone" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeModal">取 消</el-button>
        <el-button type="primary" size="small" @click="submitHandler">确 定</el-button>
      </div>
    </el-dialog>
    <!-- /表单结束 -->
    <!-- 表格 -->
    <el-table :data="customers" size="small" @selection-change="idsChangeHandler">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="realname" label="姓名" />
      <el-table-column prop="telephone" label="手机号" />
      <el-table-column prop="status" label="状态" />
      <el-table-column label="操作" width="100px" align="center">
        <template #default="record">
          <a href="" class="el-icon-delete" @click.prevent="deleteHandler(record.row.id)" /> &nbsp;
          <a href="" class="el-icon-edit-outline" @click.prevent="editHandler(record.row)" />
          <a href="" @click.prevent="toDetails(record.row)">详情</a>
        </template>
      </el-table-column>
    </el-table>
    <!-- /表格结束 -->
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  data() {
    return {
      ids: [],
      form: {},
      // 表单验证规则
      rules: {
        realname: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 4, message: '长度在 2 到 4 个字符', trigger: 'blur' }
        ],
        telephone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.findAllCustomers()
  },
  // eslint-disable-next-line vue/order-in-components
  computed: {
    // 状态
    ...mapState('customer', ['customers', 'visible', 'title']),
    ...mapGetters('customer', ['countCustomers', 'customerStatusFilter'])
    // 普通属性
  },
  methods: {
    // 动作
    ...mapActions('customer', ['findAllCustomers', 'deleteCustomerById', 'saveOrUpdateCustomer', 'batchDeleteCustomers']),
    // 突变
    ...mapMutations('customer', ['showModal', 'closeModal', 'setTitle']),
    // 普通方法
    toDetails(customer) {
      // 跳转到顾客详情页面
      this.$router.push({
        path: '/customerDetail',
        query: { customer }
        // params:{id:1}
      })
    },
    batchDeleteHandler() {
      this.batchDeleteCustomers(this.ids)
        .then((response) => {
          this.$message({ type: 'success', message: response.statusText })
        })
    },
    idsChangeHandler(val) {
      this.ids = val.map(item => item.id)
    },
    dialogCloseHandler() {
      this.$refs.customerForm.clearValidate()
    },
    toAddHandler() {
      this.form = {}
      this.setTitle('添加顾客信息')
      this.showModal()
    },
    submitHandler() {
      // 1.表单验证
      this.$refs.customerForm.validate((valid) => {
        if (valid) {
          // 2.提交表单
          this.saveOrUpdateCustomer(this.form)
            .then((response) => {
              this.$message({ type: 'success', message: response.statusText })
            })
        } else {
          return false
        }
      })
    },
    deleteHandler(id) {
      const promise = this.deleteCustomerById(id)
      promise.then((response) => {
        this.$message({ type: 'success', message: response.statusText })
      })
    },

    editHandler(row) {
      this.form = row
      this.setTitle('修改顾客信息')
      this.showModal()
    }
  }
}
</script>
<style scoped>

</style>
