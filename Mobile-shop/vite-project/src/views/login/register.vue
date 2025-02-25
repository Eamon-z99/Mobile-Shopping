<template>
  <div class="register">
    <!-- 头部 -->
    <header class="flex justify-between items-center w-full h-12 bg-gradient-to-r from-red-500 to-pink-600 text-white px-5">
      <div class="flex items-center cursor-pointer" @click="goBack">
        <i class="iconfont icon-return text-2xl">&lt;</i>
      </div>
      <div>
        <span class="text-lg">快速注册</span>
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
          pattern="\w{6,12}"
          class="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
        />
      </div>
      <div
        class="w-full flex justify-center items-center h-12 bg-gradient-to-r from-red-500 to-pink-600 text-white text-lg rounded-lg cursor-pointer transition-all duration-300 hover:from-red-600 hover:to-pink-700"
        @click="register"
      >
        注册
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import http from '/src/common/api/request.js'

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
    return false
  }
  return bool
}

// 注册
const register = () => {
  if (!validate('userTel')) return
  if (!validate('userPwd')) return
  http
    .$axios({
      url: '/api/register',
      method: 'POST',
      data: {
        phone: userTel.value,
        pwd: userPwd.value,
      },
    })
    .then((res) => {
      showToast(res.msg)
      console.log('注册的信息', res)
    })
}

// 页面返回
const goBack = () => {
  router.back()
}
</script>

<style scoped>

</style>