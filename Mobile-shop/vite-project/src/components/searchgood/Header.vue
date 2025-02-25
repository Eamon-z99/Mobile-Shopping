<template>
  <header class="flex justify-between items-center w-full h-[2rem] px-[0.4rem] border-b border-[#ccc] bg-white shadow-sm">
    <!-- 返回按钮 -->
    <div
      class="search-return text-[#666] text-[1.3rem] cursor-pointer transition-colors duration-300 hover:text-[#ff4466] leading-[2rem] pr-[0.1rem]"
      @click="goBack"
    >
      &lt;
    </div>

    <!-- 搜索框 -->
    <div class="search-main flex-grow flex items-center h-full mx-[0rem]">
      <form class="w-full h-[1.6rem]" @submit.prevent="goSearchList">
        <input
          type="search"
          placeholder="  搜索物品"
          v-model="searchVal"
          class="w-[95%] h-full px-[0.2rem] border border-[#ccc] rounded-[0.25rem] outline-none transition-all duration-300 focus:border-[#ff4466] focus:shadow-[0_0_5px_rgba(255,68,102,0.5)] text-[#333] bg-[#f5f5f5] text-[0.8rem] leading-[1.6rem]"
        />
      </form>
    </div>

    <!-- 搜索按钮 -->
    <div
      class="search-btn text-[#666] text-[1rem] mr-[5%] cursor-pointer transition-colors duration-300 hover:text-[#ff4466]"
      @click="goSearchList"
    >
      搜索
    </div>
  </header>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted, getCurrentInstance } from 'vue'

const router = useRouter()
const route = useRoute()
const searchVal = ref(route.query.key || '')
let vm // 存储Vue实例

// 在组件挂载后获取当前实例
onMounted(() => {
  vm = getCurrentInstance()
})

// 返回上一页
const goBack = () => {
  router.back()
}

// 跳转到搜索结果页面
const goSearchList = () => {
  if (!searchVal.value) return
  let searchList = localStorage.getItem('searchList') || '[]'
  let searchArr = JSON.parse(searchList)
  searchArr.unshift(searchVal.value)
  // ES6 Set去重
  const uniqueSet = new Set(searchArr)
  const newArray = Array.from(uniqueSet)
  localStorage.setItem('searchList', JSON.stringify(newArray))
  router.push({ name: 'list', query: { key: searchVal.value } }).then(() => {
    // 导航后强制更新视图
    vm?.proxy.$forceUpdate()
  })
}
</script>

<style scoped>

</style>