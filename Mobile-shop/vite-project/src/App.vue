<template>
  <router-view :key="$route.fullPath"></router-view>
</template>

<script setup>
	import { onMounted } from 'vue';
	import { useUserStore } from '/src/store/store.js'
	const userStore = useUserStore()
	onMounted(()=>{
		userStore.initUser()
	})
</script>

<style>
body{
  background-color: #f1f1f1;
}
</style>
