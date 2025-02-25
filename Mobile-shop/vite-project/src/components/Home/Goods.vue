<template>
  <div class="goods-container min-h-[150vh] pb-12">
    <div class="goods p-3">
      <ul class="grid grid-cols-2 gap-3 p-0 m-0 list-none">
        <li
          v-for="(item, index) in goodsList"
          :key="item.id"
          @click="goDetail(item.id)"
          class="bg-white rounded-lg overflow-hidden shadow-md"
        >
          <div class="goods-top relative pb-[100%]">
            <img
              :src="item.imgUrl"
              alt="商品图片"
              class="absolute top-0 left-0 w-full h-full object-cover"
            />
            <div class="goods-icon absolute top-0 left-0 w-full h-full">
              <img
                :src="item.leftUrl"
                alt="左侧图标"
                class="absolute top-2 left-2 w-10 h-10"
              />
              <img
                :src="item.rightUrl"
                alt="右侧图标"
                class="absolute top-2 right-2 w-7 h-7"
              />
            </div>
            <div class="goods-actor absolute bottom-2 left-2 flex items-center gap-1">
              <img
                :src="item.actor"
                alt="演员头像"
                class="w-6 h-6 rounded-full"
              />
              <span class="actorname text-white text-xs drop-shadow-md">
                {{ item.actorname }}
              </span>
              <span class="actortag bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
                {{ item.actortag }}
              </span>
            </div>
          </div>
          <div class="goods-bottom p-2">
            <h3 class="text-sm line-clamp-2 mb-2">
              {{ item.name }}
            </h3>
            <div class="price flex items-center gap-1">
              <span class="fuhao text-pink-500 text-xs">￥</span>
              <span class="jine text-pink-500 text-base font-bold">
                {{ item.price }}
              </span>
              <span class="baoyou">
                <img :src="item.byUrl" alt="包邮图标" class="h-4 align-middle" />
              </span>
              <span class="xiaoliang ml-auto text-gray-500 text-xs">
                销量999
              </span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const goodsList = ref([])

onMounted(() => {
  fetchData()
})

const fetchData = async () => {
  const res = await axios.get('/api/index')
  console.log(res)
  goodsList.value = res.data.data.goodsList
}

const goDetail = (id) => {
  router.push({ path: '/detail', query: { id } })
}
</script>

<style scoped>

</style>