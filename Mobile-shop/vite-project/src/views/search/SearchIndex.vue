<template>
  <div class="search flex flex-col w-screen h-screen overflow-hidden bg-gray-100">
    <Header></Header>
    <section class="flex-1 overflow-auto p-4">
      <div class="search-history bg-white rounded-lg shadow-md p-4">
        <h2 class="flex items-center justify-between mb-4 text-base text-gray-800">
          <i class="iconfont icon-fangdajing text-gray-600 mr-2"></i>
          <span>历史搜索</span>
          <span
            class="clear-button text-sm text-pink-500 cursor-pointer px-2 py-1 rounded transition-all duration-300 hover:bg-pink-500 hover:text-white"
            @click="clearSearchHistory"
          >
            清空
          </span>
        </h2>
        <ul v-if="searchArr.length" class="flex flex-wrap gap-2">
          <li
            v-for="(item, index) in searchArr"
            :key="index"
            class="px-3 py-1.5 text-sm bg-gray-100 rounded-full text-gray-800 cursor-pointer transition-all duration-300 hover:bg-gray-200"
            @click="searchList(item)"
          >
            {{ item }}
          </li>
        </ul>
        <div v-else class="no-history text-center text-gray-500 py-4">暂无历史搜索</div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { showConfirmDialog } from 'vant'
import { useRouter } from 'vue-router'
import Header from '/src/components/searchgood/Header.vue'

let searchArr = ref([])
let router = useRouter()

onMounted(() => {
  searchArr.value = JSON.parse(localStorage.getItem('searchList')) || []
})

const clearSearchHistory = () => {
  showConfirmDialog({
    title: '清空历史搜索',
    message: '您确定要清空所有的历史记录吗？',
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    confirmButtonColor: '#ff4466',
    cancelButtonColor: '#666',
    className: 'custom-dialog',
  })
    .then(() => {
      console.log('清空')
      localStorage.removeItem('searchList')
      searchArr.value = []
    })
    .catch(() => {
      console.log('取消')
    })
}

const searchList = (item) => {
  console.log(item)
  router.push({
    name: 'list',
    query: {
      key: item,
    },
  })
}
</script>

<style>
/* 自定义 Vant 对话框样式 */
.custom-dialog {
  border-radius: 10px !important;
  font-family: 'Arial', sans-serif !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  width: 90% !important;
  max-width: 90% !important;
  transform: translate(-50%, -50%) !important;
  position: fixed !important;
  left: 50% !important;
  top: 50% !important;
}

.custom-dialog .van-dialog__container {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  height: 100% !important;
}

.custom-dialog .van-dialog__header {
  font-size: 1.25rem !important;
  font-weight: 600 !important;
  color: #333 !important;
  padding: 1.5rem 1.5rem 0 !important;
}

.custom-dialog .van-dialog__content {
  font-size: 1rem !important;
  color: #666 !important;
  padding: 1rem 1.5rem !important;
  line-height: 1.5 !important;
}

.custom-dialog .van-dialog__footer {
  display: flex !important;
  justify-content: flex-end !important;
  padding: 0.5rem 1.5rem !important;
}

.custom-dialog .van-dialog__confirm,
.custom-dialog .van-dialog__cancel {
  padding: 0.75rem 1.5rem !important;
  font-size: 1rem !important;
  border-radius: 5px !important;
  margin-left: 0.5rem !important;
  cursor: pointer !important;
  transition: background-color 0.3s, transform 0.2s !important;
}

.custom-dialog .van-dialog__confirm {
  background-color: #ff4466 !important;
  color: white !important;
}

.custom-dialog .van-dialog__confirm:hover {
  background-color: #ec3d53 !important;
  transform: scale(1.05) !important;
}

.custom-dialog .van-dialog__cancel {
  background-color: #f5f5f5 !important;
  color: #666 !important;
  border: 1px solid #ddd !important;
}

.custom-dialog .van-dialog__cancel:hover {
  background-color: #eaeaea !important;
}
</style>