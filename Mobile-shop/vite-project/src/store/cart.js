import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    // 购物车数据
    list: [],
    // 选中商品的数据
    selectList: []
  }),
  getters: {
    isCheckedAll() {
      return this.list.every(item => item.checked)
    },
    total(state) {
      let total = { num: 0, price: 0 }
      this.list.forEach(v => {
        if (v.checked) {
          total.num += parseInt(v.goods_num)
          total.price += v.goods_price * v.goods_num
        }
      })
      return total
    }
  },
  actions: {
    cartList(cartArr) {
      this.list = cartArr
      this.selectList = []
    },
    // 全选
    check_all() {
      this.list.forEach(v => {
        v.checked = true
      })
      this.selectList = this.list.map(v => v.id)
    },
    // 全不选
    un_check_all() {
      this.list.forEach(v => {
        v.checked = false
      })
      this.selectList = []
    },
    // 单选
    check_item(index) {
      let item = this.list[index]
      item.checked = !item.checked // 切换选中状态

      if (item.checked) {
        this.selectList.push(item.id)
      } else {
        let i = this.selectList.indexOf(item.id)
        if (i > -1) {
          this.selectList.splice(i, 1)
        }
      }
    },
    checkAllFn() {
      if (this.isCheckedAll) {
        this.un_check_all()
      } else {
        this.check_all()
      }
    }
  }
})