<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 底部导航栏数据
const routerList = ref([
  { title: '首页', path: '/home' },
  { title: '购物车', path: '/shopping' },
  { title: '我的', path: '/my' },
])

// 跟踪当前激活的导航项
const activeTab = ref(route.path)

// 监听路由变化，更新 activeTab
watch(route, (to) => {
  activeTab.value = to.path
})

// 导航栏跳转
const switchTab = (path) => {
  router.replace(path)
  activeTab.value = path
}
</script>

<template>
  <div class="tabbar fixed left-0 bottom-0 z-50 w-full h-12 bg-white border-t border-gray-200">
    <ul class="flex justify-around items-center h-full">
      <li
        v-for="(item, index) in routerList"
        :key="index"
        @click="switchTab(item.path)"
        :class="{ 'text-red-500': activeTab === item.path, 'text-gray-600': activeTab !== item.path }"
        class="flex flex-col justify-center items-center cursor-pointer"
      >
        <span class="text-sm">{{ item.title }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>

</style>