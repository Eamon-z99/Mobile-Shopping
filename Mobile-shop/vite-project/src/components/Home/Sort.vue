<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'

const sortList = ref([])

onMounted(() => {
  fetchData()
})

const fetchData = async () => {
  const res = await axios.get('/api/index')
  console.log(res)
  sortList.value = res.data.data.sortList
}
</script>

<template>
  <ul class="sorts w-full bg-white text-[0.45rem] box-border flex flex-wrap p-0">
    <li
      v-for="(item, index) in sortList"
      :key="item.id"
      class="flex flex-col items-center box-border flex-[0_0_20%] my-[0.5rem]"
    >
      <img :src="item.imgUrl" alt="分类图片" class="w-[2rem] h-[2rem]" />
      <span class="mt-[0.375rem] text-[0.5rem] text-[#666]">{{ item.title }}</span>
    </li>
  </ul>
</template>

<style scoped>

</style>