// eslint-disable-next-line no-unused-vars
import { get, post, post_array } from '../http/axios'
export default {
  namespaced: true,
  state: {
    visible: false,
    orders: [],
    title: '添加订单信息'
  },
  getters: {
    countOrders: (state) => {
      return state.orders.length
    },
    // 需要为获取器传递参数的写法
    orderStatusFilter: (state) => {
      return function(status) {
        if (status) {
          return state.orders.filter(item => item.status === status)
        } else {
          return state.orders
        }
      }
    }
  },
  mutations: {
    showModal(state) {
      state.visible = true
    },
    closeModal(state) {
      state.visible = false
    },
    // 需要接受一个参数，这个参数就是orders
    refreshOrders(state, orders) {
      console.log('state->', state)
      state.orders = orders
    },
    setTitle(state, title) {
      state.title = title
    }
  },
  actions: {
    async batchDeleteOrders(context, ids) {
      const response = await post('http://47.94.46.113:6677/order/batchDelete', { ids })
      context.dispatch('findAllOrders')
      return response
    },
    // async findAllOrders({commit,dispatch,getters,state}){
    async findAllOrders(context) {
      console.log('context->', context)
      // 1. 查询所有订单信息
      const response = await get('http://47.94.46.113:6677/order/findAll')
      // alert(JSON.stringify(response));
      // 2. 将订单信息设置到state.orders中
      context.commit('refreshOrders', response.data)
    },
    async deleteOrderById({ dispatch }, id) {
      // 1. 删除订单信息
      const response = await get('http://47.94.46.113:6677/order/deleteById?id=' + id)
      // 2. 刷新
      dispatch('findAllOrders')
      // 3. 提示成功
      return response
    },
    async saveOrUpdateOrder({ dispatch, commit }, order) {
      // 1. 提交请求
      const response = await post('http://47.94.46.113:6677/order/saveOrUpdate', order)
      // 2. 关闭模态
      commit('closeModal')
      // 3. 刷新页面
      dispatch('findAllOrders')
      // 4. 提示成功 react
      return response
    }
  }
}
