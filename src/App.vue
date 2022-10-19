<template>
  <div>
    <keep-alive exclude="Search,SearchResult,ArticleDetail,UserEdit">
      <!-- 有些一级路由不需要 -->
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
// import { getAllChannelsAPI } from '@/api'
export default {}
</script>

<style>
</style>
