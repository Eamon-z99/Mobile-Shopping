<template>
  <div class="bg-gray-50 min-h-screen font-sans">
    <header class="bg-gradient-to-r from-red-500 to-pink-600 p-8 text-white shadow-lg">
      <div class="flex items-center cursor-pointer transition-opacity duration-300 hover:opacity-90" v-if="loginStatus">
        <div class="text-xl font-medium">{{ userInfo.nickname }}</div>
      </div>
      <div class="flex items-center cursor-pointer transition-opacity duration-300 hover:opacity-90" v-else>
        <div class="text-xl font-medium" @click="goLogin">登录 / 注册</div>
      </div>
    </header>
    <section class="bg-white rounded-lg m-4 shadow-sm overflow-hidden">
      <ul>
        <li @click="goAddressManagement" class="p-4 border-b border-gray-100 flex items-center cursor-pointer transition-colors duration-300 hover:bg-gray-50">
          <img src="/images/地址管理.png" alt="Address Management" class="w-6 h-6 mr-4">
          地址管理
          <span class="ml-auto text-gray-400 text-2xl">›</span>
        </li>
        <li @click="goAbout" class="p-4 border-b border-gray-100 flex items-center cursor-pointer transition-colors duration-300 hover:bg-gray-50">
          <img src="/images/关于我们.png" alt="About Us" class="w-6 h-6 mr-4">
          关于我们
          <span class="ml-auto text-gray-400 text-2xl">›</span>
        </li>
        <li @click="goOut" class="p-4 flex items-center cursor-pointer transition-colors duration-300 hover:bg-gray-50">
          退出登录
          <span class="ml-auto text-gray-400 text-2xl">›</span>
        </li>
      </ul>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script setup>
import Tabbar from '/src/components/common/Tabbar.vue'
import { useRouter } from 'vue-router';
import { useUserStore } from '/src/store/user.js'
import { computed } from 'vue'

const userStore = useUserStore()
const router = useRouter();

// 获取用户完整信息
const loginStatus = computed(() => userStore.loginStatus)
const userInfo = computed(() => userStore.userInfo)

// 退出登录
const goOut = () => {
  userStore.loginOut()
  router.push({ path: '/login' })
}

const goLogin = () => {
  router.push({ path: '/login' });
};

const goAddressManagement = () => {
  router.push({ path: '/address' });
};

const goAbout = () => {
  router.push({ path: '/about' });
};
</script>

<style scoped>

</style>