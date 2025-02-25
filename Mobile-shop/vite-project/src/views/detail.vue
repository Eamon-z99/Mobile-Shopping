<template>
  <div class="detail bg-white relative">
    <!-- 返回按钮 -->
    <div
      class="back-button absolute top-4 left-4 cursor-pointer text-3xl text-white p-2 rounded-full z-10"
      @click="goBack"
    >
      &lt;
    </div>

    <!-- 轮播图 -->
    <van-swipe class="my-swipe h-[30rem] w-full" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-if="goodsDetail.imgUrl" class="flex justify-center items-center bg-gray-100">
        <img :src="goodsDetail.imgUrl" alt="商品图片" class="w-full h-[30rem] object-cover" />
      </van-swipe-item>
    </van-swipe>

    <!-- 商品价格和销量 -->
    <div class="detailPrice flex justify-between items-center p-4">
      <div class="price flex items-center">
        <div class="priceFu text-2xl">￥</div>
        <div class="pricePr text-3xl font-semibold">{{ goodsDetail.price }}</div>
        <div class="priceYh text-sm ml-2 bg-pink-50 text-pink-500 px-1 py-0.5">优惠价</div>
      </div>
      <div class="sales text-sm text-gray-600">已售{{ goodsDetail.num }}</div>
    </div>

    <!-- 商品名称 -->
    <div class="detailName p-4 text-2xl">{{ goodsDetail.name }}</div>

    <!-- 底部操作栏 -->
    <div class="detailFoot fixed bottom-0 left-0 w-full h-12 flex">
      <div
        class="item add w-1/2 text-center leading-[3rem] h-full text-xl bg-pink-50 text-pink-500 cursor-pointer"
        @click="addCart"
      >
        加入购物车
      </div>
      <div
        class="item buy w-1/2 text-center leading-[3rem] h-full text-xl bg-pink-500 text-white cursor-pointer"
      >
        立即购买
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Swipe, SwipeItem } from 'vant'
import http from '/src/common/api/request.js'
import { showToast } from 'vant'

const route = useRoute()
const router = useRouter()
const goodsDetail = ref({})
const goodsId = route.query.id

const goData = async () => {
  const goodsId = router.currentRoute.value.query.id
  try {
    const res = await http.$axios({
      url: '/api/goods/id',
      params: { id: goodsId },
    })
    console.log('详情数据', res)
    goodsDetail.value = res
  } catch (error) {
    console.error('获取商品详情失败:', error)
  }
}

const addCart = () => {
  let id = route.query.id
  http
    .$axios({
      url: '/api/addCart',
      method: 'POST',
      data: {
        goodsId: id,
      },
      headers: {
        token: true,
      },
    })
    .then((res) => {
      console.log('添加购物车', res)
      if (res.data.success) {
        showToast(res.data.msg)
      } else {
        showToast(res.data.msg) // 显示“该商品已加入购物车”提示
      }
    })
    .catch((err) => {
      console.error('添加购物车失败', err)
      showToast('添加购物车成功')
    })
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  goData()
})
</script>

<style scoped>

</style>