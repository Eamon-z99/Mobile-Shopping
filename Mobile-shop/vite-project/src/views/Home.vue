<script setup>
    import Tabbar from '../components/common/Tabbar.vue'
    import Header from '../components/Home/Header.vue'
    import Sort from '../components/Home/Sort.vue'
    import Goods from '../components/Home/Goods.vue'
</script>

<template>
    <Header></Header>
    <Sort></Sort>
    <Goods></Goods>
    <Tabbar></Tabbar>
</template>

<style>
body{
  background-color:white;
}
</style>