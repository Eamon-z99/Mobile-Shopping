<template>
  <div class="search-list flex flex-col w-screen h-screen overflow-hidden" :key="key">
    <!-- 头部 -->
    <div class="headers">
      <Header></Header>
      <ul class="flex justify-around py-2 bg-white border-b border-gray-300">
        <li v-for="(item, index) in ['综合', '销量', '价格']" :key="index">
          <div
            class="px-2 text-lg cursor-pointer transition-all duration-300 border-b-2 border-transparent hover:text-pink-500 hover:border-pink-500"
          >
            {{ item }}
          </div>
        </li>
      </ul>
    </div>

    <!-- 商品列表 -->
    <section class="goods-container flex-1 overflow-auto p-3">
      <ul class="grid grid-cols-2 gap-3">
        <li
          v-for="(item, index) in goodsList"
          :key="item.id"
          class="goods-item bg-white rounded-lg overflow-hidden shadow-md"
        >
          <div class="goods-top relative pb-[100%]">
            <img
              :src="item.imgUrl"
              alt="商品图片"
              class="absolute top-0 left-0 w-full h-full object-cover"
            />
            <div class="goods-actor absolute bottom-2 left-2 flex items-center gap-1">
              <span class="actorname text-white text-xs drop-shadow-md">{{ item.actorname }}</span>
              <span class="actortag bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
                {{ item.actortag }}
              </span>
            </div>
          </div>
          <div class="goods-bottom p-2">
            <h3 class="text-sm line-clamp-2 mb-2">{{ item.name }}</h3>
            <div class="price flex justify-between items-center">
              <div class="flex items-center">
                <span class="fuhao text-pink-500 text-xs">￥</span>
                <span class="jine text-pink-500 text-lg font-bold">{{ item.price }}</span>
              </div>
              <span class="xiaoliang text-gray-500 text-xs">{{ item.num }}☆</span>
            </div>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import Header from '/src/components/searchgood/Header.vue'
import { useRoute } from 'vue-router'
import http from '/src/common/api/request.js'
import { ref, onMounted, watch } from 'vue'

const route = useRoute()
const goodsList = ref([])
const key = ref(0) // 添加一个响应式的key

onMounted(() => {
  getData()
})

watch(route, () => {
  getData()
}, { immediate: false })

const getData = () => {
  http
    .$axios({
      url: '/api/goods/shopList',
      params: {
        searchName: route.query.key,
      },
    })
    .then((res) => {
      console.log('查询的数据', res)
      goodsList.value = res
    })
}

// 每次返回时，更新key值，强制重新渲染组件
watch(() => route.path, () => {
  key.value++
})
</script>

<style scoped>

</style>