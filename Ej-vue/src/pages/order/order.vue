<template>
  <div class="order">
    <!-- 按钮 -->
    <el-row class="btns">
      <el-col :span="2">
        <el-button type="primary" size="small" @click="toAddHandler">添加</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="danger" size="small" @click="batchDeleteHandler">批量删除</el-button>
      </el-col>

    </el-row>

    <!-- 表单 -->
    <el-dialog :title="title" :visible.sync="visible" @close="dialogCloseHandler">
      <el-form ref="orderForm" :model="form" :rules="rules">
        <el-form-item label="数量" label-width="60px" prop="total">
          <el-input v-model="form.realname" autocomplete="off" />
        </el-form-item>
        <el-form-item label="状态" label-width="60px" prop="status">
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
    <el-table :data="orders" size="small" @selection-change="idsChangeHandler">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="total" label="订单数量" />
      <el-table-column prop="orderTime" label="下单时间" />
      <el-table-column prop="status" label="订单状态" />
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
// eslint-disable-next-line no-unused-vars
import order from '../../store/modules/order'
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
    this.findAllOrders()
  },
  // eslint-disable-next-line vue/order-in-components
  computed: {
    // 状态
    ...mapState('order', ['orders', 'visible', 'title']),
    ...mapGetters('order', ['countOrders', 'orderStatusFilter'])
    // 普通属性
  },
  methods: {
    // 动作
    ...mapActions('order', ['findAllOrders', 'deleteOrderById', 'saveOrUpdateOrder', 'batchDeleteOrders']),
    // 突变
    ...mapMutations('order', ['showModal', 'closeModal', 'setTitle']),
    // 普通方法
    toDetails(order) {
      // 跳转到顾客详情页面
      this.$router.push({
        path: '/order/details',
        query: { id: order.id },
        params: { order }
      })
    },
    batchDeleteHandler() {
      this.batchDeleteOrders(this.ids)
        .then((response) => {
          this.$message({ type: 'success', message: response.statusText })
        })
    },
    // sfefsefsdfsdfdsfdsfdsf
    idsChangeHandler(val) {
      this.ids = val.map(item => item.id)
    },
    dialogCloseHandler() {
      this.$refs.orderForm.clearValidate()
    },
    toAddHandler() {
      this.form = {}
      this.setTitle('添加顾客信息')
      this.showModal()
    },
    submitHandler() {
      // 1.表单验证
      this.$refs.orderForm.validate((valid) => {
        if (valid) {
          // 2.提交表单
          this.saveOrUpdateOrder(this.form)
            .then((response) => {
              this.$message({ type: 'success', message: response.statusText })
            })
        } else {
          return false
        }
      })
    },
    deleteHandler(id) {
      const promise = this.deleteOrderById(id)
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
