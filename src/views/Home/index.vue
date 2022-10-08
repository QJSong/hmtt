<template>
  <div>
    <div>
      <van-nav-bar fixed>
        <template #left>
          <img class="logo" src="@/assets/logo.png" alt="" />
        </template>
        <template #right>
          <!-- postcss 只能翻译 style里的代码，标签里的行内样式它无法转换 所以需要手动转换-->
          <van-icon name="search" size="0.48rem" color="#fff" />
        </template>
      </van-nav-bar>
    </div>

    <div class="main">
      <!-- sticky 粘性布局 -->
      <van-tabs v-model="channelsId" sticky offset-top="1.22667rem" animated>
        <van-tab
          :title="obj.name"
          v-for="obj in userChannelsList"
          :key="obj.id"
          :name="obj.id"
          ><ArticleList :channelsId="channelsId"></ArticleList
        ></van-tab>
      </van-tabs>

      <van-icon name="plus" size="0.37333334rem" class="moreChannels" />
    </div>
  </div>
</template>

<script>
import { getUserChannelsAPI } from '@/api'
import ArticleList from './components/ArticleList.vue'
export default {
  components: {
    ArticleList
  },
  data () {
    return {
      channelsId: 0,
      userChannelsList: []
    }
  },

  async created () {
    // 频道列表
    const res = await getUserChannelsAPI()
    // console.log(res)
    this.userChannelsList = res.data.data.channels
  }
}
</script>

<style lang="less" scoped>

.logo {
  width: 100px;
  height: 30px;
}
.main {
  padding-top: 46px;
}

/* 设置 tabs 容器的样式 */
/deep/ .van-tabs__wrap {
  padding-right: 30px;
  background-color: #fff;
}

/* 设置小图标的样式 */
.moreChannels {
  position: fixed;
  top: 62px;
  right: 8px;
  z-index: 999;
}
</style>
