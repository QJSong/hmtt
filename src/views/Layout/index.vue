<template>
  <div>
    <div class="home_container">
      <!-- 二级路由页面 -->
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
    <!-- 下面底部导航 -->
    <van-tabbar route>
      <van-tabbar-item to="/layout/home" icon="home-o">标签</van-tabbar-item>

      <van-tabbar-item to="/layout/user" icon="setting-o">标签</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'Layout'
}
</script>

<style scoped lang="less">
/* 内容底部内边距(把内容往上挤压, 防止内部被底部导航挡住) */
.home_container {
  padding-bottom: 50px;
}
/* 底部导航上边框 */
.van-tabbar {
  border-top: 1px solid #f8f8f8;
}
</style>
