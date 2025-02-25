<template>
  <div class="login">
    <!-- 头部 -->
    <header class="flex justify-between items-center w-full h-12 bg-gradient-to-r from-red-500 to-pink-600 text-white px-5">
      <div class="flex items-center cursor-pointer" @click="goBack">
        <i class="iconfont icon-return text-2xl">&lt;</i>
      </div>
      <div>
        <span class="text-lg">登录/注册</span>
      </div>
      <div>
        <i class="iconfont icon-liaotian text-2xl"></i>
      </div>
    </header>

    <!-- 表单部分 -->
    <section class="flex flex-col items-center bg-white w-full max-w-md mx-auto mt-5 p-5">
      <div class="w-full mb-5">
        <input
          type="text"
          v-model="userTel"
          placeholder="输入手机号"
          pattern="[0-9]*"
          class="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
        />
      </div>
      <div class="w-full mb-5">
        <input
          type="password"
          v-model="userPwd"
          placeholder="输入密码"
          class="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
        />
      </div>
      <div
        class="w-full flex justify-center items-center h-12 bg-gradient-to-r from-red-500 to-pink-600 text-white text-lg rounded-lg cursor-pointer transition-all duration-300 hover:from-red-600 hover:to-pink-700"
        @click="login"
      >
        登录
      </div>
      <div class="tab flex justify-between w-full mt-5 text-base">
        <span class="cursor-pointer text-gray-800 hover:underline" @click="goResetPassword">修改密码</span>
        <span class="cursor-pointer text-gray-800 hover:underline" @click="goRegister">快速注册</span>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import http from '/src/common/api/request.js'
import { useUserStore } from '/src/store/store.js'

const userStore = useUserStore()
const userTel = ref('')
const userPwd = ref('')

const rules = {
  userTel: {
    rule: /^1[23456789]\d{9}$/,
    msg: '手机输入内容错误，请重新输入',
  },
  userPwd: {
    rule: /^\w{6,12}$/,
    msg: '密码输入内容错误，请重新输入',
  },
}

const router = useRouter()

// 验证规则
const validate = (key) => {
  let bool = true
  const value = key === 'userTel' ? userTel.value : userPwd.value
  if (!rules[key].rule.test(value)) {
    showToast(rules[key].msg)
    bool = false
  }
  return bool
}

// 登录
const login = () => {
  if (!validate('userTel')) return
  if (!validate('userPwd')) return
  http
    .$axios({
      url: '/api/login',
      method: 'POST',
      data: {
        userTel: userTel.value,
        userPwd: userPwd.value,
      },
    })
    .then((res) => {
      console.log('登录信息', res)
      showToast(res.msg)
      // 跳转页面/保存用户信息
      if (!res.success) return
      userStore.userLogin(res.data)
      router.push('/home')
    })
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 跳转到修改密码页面
const goResetPassword = () => {
  router.push('/resetpassword')
}

// 跳转到注册页面
const goRegister = () => {
  router.push('/register')
}
</script>

<style scoped>

</style>