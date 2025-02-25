<template>
  <header class="flex justify-around items-center w-full h-[2.3rem] px-[0.15rem] py-[0.2rem] bg-white border-b border-[#e5e5e5] box-border">
    <!-- 分类按钮 -->
    <div class="fenlei cursor-pointer" @click="goSort">
      <img src="/images/fenlei.png" alt="分类" class="w-[1rem] h-[1rem] ml-[0.4rem] mt-[0.188rem]" />
    </div>

    <!-- 搜索框 -->
    <div
      class="search flex items-center justify-start w-[17rem] h-[2rem] text-[#999] bg-[#eee] rounded-[0.125rem] pl-[0.5rem] cursor-pointer"
      @click="goSearch"
    >
      <i class="iconfont icon-fangdajing text-[1.5rem] mr-[0.2rem]"></i>
      <span class="text-[1rem]">搜索</span>
    </div>

    <!-- 聊天按钮 -->
    <div class="liaotian cursor-pointer">
      <i class="iconfont icon-liaotian text-[2rem] text-[#999]"></i>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// 跳转到搜索页面
const goSearch = () => {
  router.push({ path: '/search' })
}

// 跳转到分类页面
const goSort = () => {
  router.push('/sort')
}
</script>

<style scoped>

</style>