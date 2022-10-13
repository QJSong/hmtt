<template>
  <div>
    <!-- 搜索结果页-头部导航 -->
    <div class="search-result-container">
      <!-- 点击实现后退效果 -->
      <van-nav-bar
        title="搜索结果"
        left-arrow
        @click-left="$router.go(-1)"
        fixed
      />
    </div>
    <!-- 搜索结果列表 -->
    <!-- 这里可以复用  ArticleItem组件 因为该组件里面没有请求数据-->
    <div>
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
      >
        <ArticleItem
          v-for="(obj,index) in searchResultList"
          :key="index"
          :artObj="obj"
          :isShow="false"
          @click.native="itemClickFn(obj.art_id)"
        ></ArticleItem>
      </van-list>
    </div>
  </div>
</template>

<script>
// .native 是事件修饰符 给组件内的根标签绑定原生的点击事件
import { searchResultAPI } from '@/api'
import ArticleItem from '@/components/ArticleItem.vue'
export default {
  components: {
    ArticleItem
  },
  name: 'SearchResult',
  data () {
    return {
      page: 1,
      searchResultList: [],
      loading: false,
      finished: false
    }
  },
  async created () {
    const res = await searchResultAPI({
      page: this.page,
      q: this.$route.params.kw // 注意：q是路由跳转传惨
    })
    this.searchResultList = res.data.data.results
  },

  methods: {
    async onLoad () {
      if (this.searchResultList.length > 0) {
        const res = await searchResultAPI({
          page: this.page++,
          q: this.$route.params.kw // 注意：q是路由跳转传惨
        })
        if (res.data.data.results.length === 0) {
          this.finished = true
          return
        }
        this.searchResultList = [
          ...this.searchResultList,
          ...res.data.data.results
        ]

        this.loading = false
      }
    },
    itemClickFn (id) {
      this.$router.push({
        path: `/articledetail?art_id=${id}`
      })
    }
  }
}
</script>

<style lang="less" scoped>
.search-result-container {
  padding-top: 46px;
}
</style>
