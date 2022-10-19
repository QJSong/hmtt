<template>
  <div>
    <!-- Header 区域 -->
    <van-nav-bar
      fixed
      title="文章详情"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- 文章加载 -->
    <van-loading color="#1989fa" v-if="Object.keys(artObj).length === 0">
      加载中...
    </van-loading>

    <div v-else>
      <!-- 文章信息区域 -->
      <div class="article-container">
        <!-- 文章标题 -->
        <h1 class="art-title">{{ artObj.title }}</h1>

        <!-- 用户信息 -->
        <van-cell
          center
          :title="artObj.aut_name"
          :label="timeAgo(artObj.pubdate)"
        >
          <template #icon>
            <img :src="artObj.aut_photo" alt="" class="avatar" />
          </template>
          <template #default>
            <div>
              <van-button
                type="info"
                size="mini"
                v-if="artObj.is_followed"
                @click="followedFn(true)"
                >已关注</van-button
              >
              <van-button
                icon="plus"
                type="info"
                size="mini"
                plain
                v-else
                @click="followedFn(false)"
                >关注</van-button
              >
            </div>
          </template>
        </van-cell>

        <!-- 分割线 -->
        <van-divider></van-divider>

        <!-- 文章内容 -->
        <div class="art-content" v-html="artObj.content"></div>

        <!-- 分割线 -->
        <van-divider>End</van-divider>

        <!-- 点赞 -->
        <div class="like-box">
          <van-button
            icon="good-job"
            type="danger"
            size="small"
            v-if="artObj.attitude === 1"
            @click="loveFn(true)"
            >已点赞</van-button
          >
          <van-button
            icon="good-job-o"
            type="danger"
            plain
            size="small"
            v-else
            @click="loveFn(false)"
            >点赞</van-button
          >
        </div>
      </div>

      <!-- 文章评论 -->
      <div>
        <CommentList></CommentList>
      </div>
    </div>
  </div>
</template>

<script>
import {
  detailAPI,
  userFollowedAPI,
  userUnFollowedAPI,
  articleLikeAPI,
  articleUnLikeAPI
} from '@/api'
import { timeAgo } from '@/utils/date'
import CommentList from './CommentList.vue'
export default {
  name: 'ArticleDetail',
  data () {
    return {
      artObj: {}
    }
  },
  // 获取文章详情
  async created () {
    const res = await detailAPI({
      artId: this.$route.query.art_id
    })
    // console.log(res)
    this.artObj = res.data.data
  },
  methods: {
    timeAgo: timeAgo,

    // 关注/取消 -作者
    async followedFn (bool) {
      if (bool === true) {
        // 用户点击 已关注
        // 页面需要改为 关注
        this.artObj.is_followed = false
        // 业务 变为取关 调用取关接口
        const res = await userUnFollowedAPI({
          userId: this.artObj.aut_id
        })
        console.log(res)
      } else {
        // 用户点击 关注
        // 页面需要改为 已关注
        this.artObj.is_followed = true
        // 业务 变为关注 调用关注接口
        const res = await userFollowedAPI({
          userId: this.artObj.aut_id
        })
        console.log(res)
      }
    },

    // 点赞/取消 -文章
    async loveFn (bool) {
      if (bool === true) {
        // 用户点击的是已点赞
        // 页面改为 点赞
        this.artObj.attitude = 0
        // 业务 调用取消点赞接口
        const res = await articleUnLikeAPI({
          artId: this.artObj.art_id
        })
        console.log(res)
      } else {
        // 用户点击的是点赞
        // 页面改为 已点赞
        this.artObj.attitude = 1
        // 业务 调用点赞接口
        const res = await articleLikeAPI({
          artId: this.artObj.art_id
        })
        console.log(res)
      }
    }
  },
  components: {
    CommentList
  }
}
</script>

<style scoped lang="less">
.article-container {
  padding: 10px;
  margin-top: 46px;
}
.art-title {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
}

.art-content {
  font-size: 12px;
  line-height: 24px;
  width: 100%;
  overflow-x: scroll;
  word-break: break-all;
  /deep/ img {
    width: 100%;
  }
  /deep/ pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}

.van-cell {
  padding: 5px 0;
  &::after {
    display: none;
  }
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f8f8f8;
  margin-right: 5px;
  border: none;
}

.like-box {
  display: flex;
  justify-content: center;
}

.van-loading {
  text-align: center;
  padding-top: 46px;
}
</style>
