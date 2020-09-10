<template>
  <div class="order_details">
    <h2>订单详情</h2>
    <el-button type="primary" size="small" @click="backHandler">返回</el-button>

  </div>
</template>
<script>
export default {

  created() {
    console.log('当前路由', this.$route)
    this.order = this.$route.query.order
  },
  methods: {
    backHandler() {
      this.$router.go(-1)
    }
  }
}
</script>
