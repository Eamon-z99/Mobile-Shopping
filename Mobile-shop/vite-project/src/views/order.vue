<template>
  <div class="order pb-14">
    <header class="flex justify-between items-center w-full h-12 text-gray-600 bg-gray-50 border-b-2 border-gray-200">
      <i class="px-4 text-2xl cursor-pointer" @click="goBack">&lt;</i>
      <span class="text-lg font-light">提交订单</span>
      <i class="iconfont icon-liaotian px-4"></i>
    </header>
    <section class="bg-gray-50">
      <div class="path">
        <h3 class="path-title p-3 text-base">收货信息</h3>
        <div class="path-content p-2 bg-white">
          <div>
            <span class="pr-2">{{ path.name }}</span>
            <span>{{ path.tel }}</span>
          </div>
          <div>
            <span class="pr-2">{{ path.province }}</span>
            <span class="pr-2">{{ path.city }}</span>
            <span class="pr-2">{{ path.county }}</span>
            <span>{{ path.addressDetail }}</span>
          </div>
        </div>
      </div>
      <div class="payment p-3 mt-3 bg-white">
        <div class="payment-title text-base">支付方式：</div>
        <van-radio-group v-model="radioPayment" class="flex pt-2">
          <van-radio name="wx" class="pr-4">微信支付</van-radio>
          <van-radio name="ali">支付宝支付</van-radio>
        </van-radio-group>
      </div>
      <div class="goods p-3 mt-3 bg-white">
        <ul>
          <li v-for="(i, d) in goodsList" :key="d" class="flex mb-3 last:mb-0">
            <div>
              <img :src="i.goods_imgUrl" alt="商品图片" class="w-16 h-16 object-cover" />
            </div>
            <div class="goods-content flex flex-col justify-between flex-1 pl-3">
              <h4 class="text-base mb-2">{{ i.goods_name }}</h4>
              <div class="goods-total flex justify-between text-sm">
                <span>¥{{ i.goods_price }}</span>
                <span>x{{ i.goods_num }}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>
    <footer class="flex justify-between items-center w-full h-14 border-t border-gray-300 fixed bottom-0 left-0 bg-white">
      <div class="order-total text-base pl-3">
        <span>共</span>
        <b class="text-gray-600">{{ total.num }}</b>
        <span>件,</span>
        <span>总金额：</span>
        <em class="text-xl text-pink-500">¥{{ total.price }}</em>
      </div>
      <div
        class="order-topay w-32 h-14 text-white text-lg text-center leading-[3.5rem] bg-pink-500 cursor-pointer"
        @click="submitOrder"
      >
        提交订单
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useCartStore } from '../store/cart.js'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()
const route = useRoute()
const store = useCartStore()
const radioPayment = ref('wx')
const item = ref([])

onMounted(() => {
  item.value = JSON.parse(route.query.detail)
})

const { total } = storeToRefs(store)
let list = ref(store.list)

const goodsList = computed(() => {
  return item.value.map((id) => list.value.find((v) => v.id === id))
})

// 模拟地址数据
const path = ref({
  id: 1,
  name: 'aaa',
  tel: '12312341234',
  province: 'xx市',
  city: 'xx市',
  county: 'xx区',
  addressDetail: 'xx小区x号',
})

// 返回上一页面
const goBack = () => {
  router.back()
}

// 提交订单
const submitOrder = () => {
  showToast({
    message: '支付成功',
    duration: 2000,
    icon: 'success',
  })
  console.log('提交订单')
}
</script>

<style scoped>
</style>