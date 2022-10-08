<template>
  <div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
        offset="50"
      >
        <!-- 文章列表 -->
        <ArticleItem
          v-for="obj in artList"
          :key="obj.art_id"
          :artObj="obj"
          @disLike="disLikeFn"
          @report="reportFn"
        ></ArticleItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
// 解决BUG1：点击tab导航栏 不刷新数据
// 解决BUG2: 控制台报重复的错误 原因在于 页面打开 created和onLoad 同时发送请求 数据重复 onLoad两次数据合并 数据重复，key 就重复了
import { getAllArticleListAPI, dislikeArticleAPI, reportArticleAPI } from '@/api'
import ArticleItem from './ArticleItem.vue'
import { Notify } from 'vant'
export default {
  props: {
    // artList: Array
    channelsId: Number
  },
  data () {
    return {
      artList: [],
      loading: false,
      finished: false,
      theTime: new Date().getTime(), // 用于分页
      isLoading: false
    }
  },
  created () {
    this.getArticleListFn()
  },
  components: {
    ArticleItem
  },
  methods: {

    // 封装获取数据的方法 让代码更简洁
    async getArticleListFn () {
      const res = await getAllArticleListAPI({
        channel_id: this.channelsId, // 默认请求推荐的频道数据
        timestamp: this.theTime
      })
      // console.log(res)
      this.artList = [...this.artList, ...res.data.data.results]
      this.theTime = res.data.data.pre_timestamp // 拿到后面10条数据的时间戳

      // 因为网络请求是异步 防止代码往下继续执行 就把以下状态代码移到 该方法里来写
      this.loading = false

      // 没有数据就不加载了 pre_timestamp === null 就是没有下一页数据
      if (res.data.data.pre_timestamp === null) {
        this.finished = true
      }

      this.isLoading = false // 刷新
    },

    // 底部加载方法
    onLoad () {
      this.getArticleListFn()
    },

    // 上拉刷新
    onRefresh () {
      // 上拉刷新 需要清空数组和回归系统当前时间
      this.artList = []
      this.theTime = new Date().getTime()

      this.getArticleListFn()
    },

    // 反馈 - 不感兴趣
    async disLikeFn (id) {
      await dislikeArticleAPI({
        artId: id
      })
      Notify({ type: 'success', message: '反馈成功' })
    },

    // 反馈 - 垃圾内容
    async reportFn (id, value) {
      await reportArticleAPI({
        artId: id,
        type: value
      })
      Notify({ type: 'success', message: '举报成功' })
    }

  }
}
</script>
