<template>
  <div class="cart">
    <!-- 头部 -->
    <header class="flex justify-between items-center h-[50px] text-white bg-gradient-to-r from-[#ff4b2b] to-[#ff416c]">
      <i class="px-[16px] text-[24px] cursor-pointer" @click="goBack">&lt;</i>
      <span class="px-[16px] text-[18px]">购物车</span>
      <span class="px-[16px] text-[18px]">编辑</span>
    </header>

    <!-- 商品列表 -->
    <section class="bg-[#f5f5f5] py-[10px]">
      <ul class="flex flex-col">
        <li
          v-for="(item, index) in lists"
          :key="item.id"
          class="flex items-center px-[20px] py-[12px] my-[10px] bg-white rounded-[8px]"
        >
          <div class="pr-[16px]">
            <van-checkbox class="vantcheck" @click="checkItem(index)" v-model="item.checked"></van-checkbox>
          </div>
          <div class="product-container flex items-center flex-1">
            <div class="image-container mr-[16px] flex-shrink-0">
              <img :src="item.goods_imgUrl" alt="商品图片" class="w-[96px] h-[128px] rounded-[8px] object-cover" />
            </div>
            <div class="product-info flex flex-col justify-between flex-1 min-w-0">
              <div class="goods-title text-[16px] font-bold mb-[8px] line-clamp-2">
                <span>{{ item.goods_name }}</span>
              </div>
              <div class="goods-price text-[#ff5777] font-bold text-[18px]">
                ￥{{ item.goods_price }}
              </div>
            </div>
          </div>
          <div class="goods-num flex justify-end items-center ml-auto">
            <van-stepper v-model="item.quantity" :min="1" :max="99" @change="changeNum(item)" />
          </div>
        </li>
      </ul>
    </section>

    <!-- 底部结算栏 -->
    <footer class="flex justify-between items-center w-full h-[56px] border-t border-[#ccc] fixed bottom-0 left-0 bg-white">
      <div class="radio px-[16px]">
        <van-checkbox @click="checkAllFn" v-model="isCheckedAll"></van-checkbox>
      </div>
      <div class="total flex items-center flex-1 ml-[12px] text-[14px]">
        全选（<span class="total-active text-[#ff5777] text-[16px]">{{ total.num }}</span>）
      </div>
      <div class="order w-[176px] text-center text-[16px] flex justify-around items-center">
        <div class="order-price text-[#ff5777] leading-[56px] font-bold text-[18px]">
          ￥{{ total.price }}
        </div>
        <div
          class="order-jiesuan px-[20px] h-[36px] bg-[#ff5777] text-white text-[16px] leading-[36px] rounded-[20px] cursor-pointer"
          @click="goOrder"
        >
          结算
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import http from '/src/common/api/request.js'
import { useCartStore } from '../store/cart.js'
import { storeToRefs } from 'pinia'
import { showToast } from 'vant'

const router = useRouter()
const cartStore = useCartStore()
const { total } = storeToRefs(cartStore)
const lists = ref([])
const isCheckedAll = ref(false)

const goBack = () => {
  router.push('/home')
}

const getData = async () => {
  let res = await http.$axios({
    url: '/api/selectCart',
    method: 'post',
    headers: {
      token: true
    }
  })
  console.log('购物车数据', res)
  lists.value = res.data.map(item => ({
    ...item,
    quantity: item.goods_num, // 使用数据库中的商品数量
    checked: item.checked || false // 使用数据库中的选择状态，如果没有则默认为 false
  }))
  cartStore.cartList(lists.value)
}

const checkItem = (index) => {
  const item = lists.value[index]
  item.checked = !item.checked // 直接修改本地列表中的 checked 状态
  cartStore.check_item(index) // 调用 store 中的方法同步状态
}

const checkAllFn = () => {
  const newState = !isCheckedAll.value
  lists.value.forEach(item => (item.checked = newState))
  isCheckedAll.value = newState
  cartStore.checkAllFn() // 同步到 store
}

// 修改商品数量
const changeNum = (item) => {
  const newQuantity = item.quantity // 获取当前的商品数量
  http.$axios({
    url: '/api/updateNum',
    method: 'post',
    headers: {
      token: true
    },
    data: {
      id: item.id,
      num: newQuantity // 使用新的数量
    }
  })
    .then(res => {
      console.log('数量更新成功', res)
      // 更新购物车数据
      const updatedItem = lists.value.find(i => i.id === item.id)
      if (updatedItem) {
        updatedItem.goods_num = newQuantity
        cartStore.cartList(lists.value) // 更新 store 中的购物车数据
      }
    })
    .catch(err => {
      console.error('数量更新失败', err)
    })
}

//跳转到结算页面
const goOrder = () => {
  console.log('选中的商品列表:', cartStore.selectList); // 添加日志
  if (!cartStore.selectList.length) {
    showToast('请选择商品'); // 提示用户选择商品
    return;
  }
  router.push({
    path: '/order',
    query: {
      detail: JSON.stringify(cartStore.selectList)
    }
  }).catch(err => {
    console.error('跳转失败:', err); // 捕获并打印路由跳转错误
  });
}

onMounted(() => {
  getData()
})

// 监听所有商品的选择状态
watch(
  () => lists.value.map(item => item.checked),
  (newValues) => {
    isCheckedAll.value = newValues.every(Boolean)
  },
  { deep: true, immediate: true } // 立即执行一次以初始化全选按钮的状态
)

// 监听 store 中的全选状态
watch(
  () => cartStore.isCheckedAll,
  (newVal) => {
    isCheckedAll.value = newVal
    if (newVal) {
      lists.value.forEach(item => (item.checked = true))
    } else {
      lists.value.forEach(item => (item.checked = false))
    }
  }
)
</script>

<style scoped>
</style>