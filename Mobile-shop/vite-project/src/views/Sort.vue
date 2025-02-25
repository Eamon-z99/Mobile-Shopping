<template>
  <div class="flex flex-col w-screen h-screen overflow-hidden">
    <header class="flex justify-between items-center h-16 bg-white border-b-2 border-gray-100 px-4">
      <div class="returns flex items-center cursor-pointer" @click="goBack">
        <i class="text-gray-600 text-2xl">&lt;</i>
      </div>
      <div class="search flex items-center flex-1 bg-gray-100 rounded-full px-4 mx-2 py-1">
        <i class="iconfont icon-fangdajing text-gray-600 text-xl pr-2"></i>
        <span class="text-gray-600 text-base">搜索物品</span>
      </div>
      <div class="go-shopping px-3">
        <img src="/images/shopping.png" alt="购物车" class="w-6 h-6" />
      </div>
    </header>
    <section class="flex flex-1 overflow-hidden">
      <div class="list-l w-1/5 bg-gray-100 overflow-y-auto">
        <ul class="l-item flex flex-col items-center">
          <li
            v-for="(item, index) in leftData"
            :key="item.id"
            :class="{
              'text-pink-500 border-l-4 border-pink-500 bg-white': index === selectedCategoryIndex,
              'text-gray-700': index !== selectedCategoryIndex,
            }"
            class="w-full text-center py-2 text-base cursor-pointer"
            @click="selectCategory(index)"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
      <div class="list-r flex-1 bg-white overflow-y-auto">
        <ul class="shop-list text-center">
          <ul class="r-content flex flex-wrap">
            <li
              v-for="(i, d) in getRightData"
              :key="d"
              class="w-1/3 flex flex-col items-center py-4"
            >
              <img :src="i.imgUrl" alt="商品图片" class="w-4/5 max-h-40 object-cover" />
              <span class="mt-2 text-base">{{ i.name }}</span>
            </li>
          </ul>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import http from '/src/common/api/request.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const leftData = ref([])
const rightData = ref([])
const selectedCategoryIndex = ref(0)

onMounted(() => {
  sortData()
})

const sortData = async () => {
  let res = await http.$axios({
    url: '/api/goods/list',
  })
  console.log('分类页的数据', res)
  const leftArr = []
  const rightArr = []
  res.forEach((v) => {
    leftArr.push({
      id: v.id,
      name: v.name,
    })
    rightArr.push(v.data)
  })
  leftData.value = leftArr
  rightData.value = rightArr
}

const selectCategory = (index) => {
  selectedCategoryIndex.value = index
}

const getRightData = computed(() => {
  return rightData.value[selectedCategoryIndex.value] || []
})

const goBack = () => {
  router.back()
}
</script>

<style scoped>

</style>