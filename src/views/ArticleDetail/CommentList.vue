<template>
  <div>
    <!-- 评论列表 -->
    <!-- 动态class的使用 -->
    <div
      class="cmt-list"
      :class="{ 'art-cmt-container-1': isShow, 'art-cmt-container-2': !isShow }"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
      >
        <!-- 评论的 Item 项 -->
        <div class="cmt-item" v-for="obj in commentsList" :key="obj.com_id">
          <!-- 头部区域 -->
          <div class="cmt-header">
            <!-- 头部左侧 -->
            <div class="cmt-header-left">
              <img :src="obj.aut_photo" alt="" class="avatar" />
              <span class="uname">{{ obj.aut_name }}</span>
            </div>
            <!-- 头部右侧 -->
            <div class="cmt-header-right">
              <van-icon
                name="like"
                size="16"
                color="red"
                v-if="obj.is_liking"
                @click="likeFn(true, obj)"
              />
              <van-icon
                name="like-o"
                size="16"
                color="gray"
                v-else
                @click="likeFn(false, obj)"
              />
            </div>
          </div>
          <!-- 主体区域 -->
          <div class="cmt-body">
            {{ obj.content }}
          </div>
          <!-- 尾部区域 -->
          <div class="cmt-footer">{{ timeAgo(obj.pubdate) }}</div>
        </div>
      </van-list>
    </div>

    <!-- 发表评论 -->
    <div>
      <!-- 底部添加评论区域 - 1 -->
      <div class="add-cmt-box van-hairline--top" v-if="isShow">
        <van-icon name="arrow-left" size="0.48rem" @click="$router.back()" />
        <div class="ipt-cmt-div" @click="toggleFn">发表评论</div>
        <div class="icon-box">
          <van-badge :content="totleCount === 0 ? '' : totleCount" max="99">
            <van-icon name="comment-o" size="0.53333334rem" @click="moveFn" />
          </van-badge>
          <van-icon name="star-o" size="0.53333334rem" />
          <van-icon name="share-o" size="0.53333334rem" />
        </div>
      </div>

      <!-- 底部添加评论区域 - 2 -->
      <div class="cmt-box van-hairline--top" v-else>
        <textarea
          placeholder="友善评论、理性发言、阳光心灵"
          v-focus
          @blur="blurFn"
          v-model.trim="comText"
        ></textarea>
        <van-button
          type="default"
          :disabled="comText.length === 0"
          @click="sendFn"
          >发布</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import {
  articleCommentsAPI,
  commentsLikeAPI,
  commentsUnLikeAPI,
  commentsSendAPI
} from '@/api'
import { timeAgo } from '@/utils/date'
export default {
  data () {
    return {
      offset: null,
      commentsList: [],
      isShow: true,
      totleCount: 0,
      comText: '',
      loading: false,
      finished: false,
      lastId: null
    }
  },
  async created () {
    const res = await articleCommentsAPI({
      artId: this.$route.query.art_id
    })
    console.log(res)
    this.commentsList = res.data.data.results
    this.totleCount = res.data.data.total_count
    this.lastId = res.data.data.last_id // 分页

    // 网页打开没有评论 显示没有更多
    if (this.commentsList.length === 0) {
      this.finished = true
    }
  },
  methods: {
    timeAgo,
    async likeFn (bool, obj) {
      if (bool === true) {
        // 用户点击的红色
        // 页面 变为白色
        obj.is_liking = false
        // 业务 调用不喜欢接口
        await commentsUnLikeAPI({
          comId: obj.com_id
        })
      } else {
        // 用户点击的白色
        // 页面 变为红色
        obj.is_liking = true
        // 业务 调用喜欢接口
        await commentsLikeAPI({
          comId: obj.com_id
        })
      }
    },
    toggleFn () {
      this.isShow = false
    },
    // 点击评论直接跳转到第一条评论
    moveFn () {
      document.querySelector('.like-box').scrollIntoView({
        behavior: 'smooth'
      })
    },

    // 发布点击事件
    async sendFn () {
      const res = await commentsSendAPI({
        id: this.$route.query.art_id,
        content: this.comText
      })
      this.commentsList.unshift(res.data.data.new_obj)
      this.totleCount++
      this.comText = ''
      this.moveFn() // 回到评论第一个条
    },

    // 失去焦点事件
    blurFn () {
      setTimeout(() => {
        this.isShow = true
      }, 0)
    },

    // 触底 事件
    async onLoad () {
      if (this.commentsList.length > 0) {
        const res = await articleCommentsAPI({
          artId: this.$route.query.art_id,
          offset: this.lastId
        })
        console.log(res)
        this.commentsList = [...this.commentsList, ...res.data.data.results]
        this.totleCount = res.data.data.total_count
        this.lastId = res.data.data.last_id // 分页

        // 没数据
        if (res.data.data.last_id === null) {
          this.finished = true
        }
        this.loading = false
      } else {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="less">
.cmt-list {
  padding: 10px;
  .cmt-item {
    padding: 15px 0;
    + .cmt-item {
      border-top: 1px solid #f8f8f8;
    }
    .cmt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .cmt-header-left {
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          background-color: #f8f8f8;
          border-radius: 50%;
          margin-right: 15px;
        }
        .uname {
          font-size: 12px;
        }
      }
    }
    .cmt-body {
      font-size: 14px;
      line-height: 28px;
      text-indent: 2em;
      margin-top: 6px;
      word-break: break-all;
    }
    .cmt-footer {
      font-size: 12px;
      color: gray;
      margin-top: 10px;
    }
  }
}

/*美化 - 文章详情 - 底部的评论页面 */
// 外层容器
.art-cmt-container-1 {
  padding-bottom: 46px;
}
.art-cmt-container-2 {
  padding-bottom: 80px;
}

// 发布评论的盒子 - 1
.add-cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 46px;
  line-height: 46px;
  padding-left: 10px;
  .ipt-cmt-div {
    flex: 1;
    border: 1px solid #efefef;
    border-radius: 15px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    padding-left: 15px;
    margin-left: 10px;
    background-color: #f8f8f8;
  }
  .icon-box {
    width: 40%;
    display: flex;
    justify-content: space-evenly;
    line-height: 0;
  }
}

.child {
  width: 20px;
  height: 20px;
  background: #f2f3f5;
}

// 发布评论的盒子 - 2
.cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding-left: 10px;
  box-sizing: border-box;
  background-color: white;
  textarea {
    flex: 1;
    height: 66%;
    border: 1px solid #efefef;
    background-color: #f8f8f8;
    resize: none;
    border-radius: 6px;
    padding: 5px;
  }
  .van-button {
    height: 100%;
    border: none;
  }
}
</style>
