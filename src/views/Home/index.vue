<template>
  <div>
    <div>
      <van-nav-bar fixed>
        <template #left>
          <img class="logo" src="@/assets/logo.png" alt="" />
        </template>
        <template #right>
          <!-- postcss 只能翻译 style里的代码，标签里的行内样式它无法转换 所以需要手动转换-->
          <van-icon
            name="search"
            size="0.48rem"
            color="#fff"
            @click="moveSearchPageFn"
          />
        </template>
      </van-nav-bar>
    </div>

    <div class="main">
      <!-- sticky 粘性布局 -->
      <van-tabs
        v-model="channelsId"
        sticky
        offset-top="1.22667rem"
        @change="channelChangeFn"
        animated
      >
        <van-tab
          :title="obj.name"
          v-for="obj in userChannelsList"
          :key="obj.id"
          :name="obj.id"
          ><ArticleList :channelsId="channelsId"></ArticleList
        ></van-tab>
      </van-tabs>

      <van-icon
        name="plus"
        size="0.37333334rem"
        class="moreChannels"
        @click="show = true"
      />

      <van-popup class="edit_wrap" v-model="show" get-container="body">
        <ChannelEdit
          @closeEV="closeFn"
          :userList="userChannelsList"
          :unCheckList="unCheckChannelList"
          @addChannelEV="addChannelFn"
          @removeChannelEV="removeChannelFn"
          ref="editRef"
          v-model="channelsId"
        ></ChannelEdit>
      </van-popup>
    </div>
  </div>
</template>

<script>
import {
  getUserChannelsAPI,
  getAllChannelsAPI,
  updatedChannelsAPI,
  removeChannelsAPI
} from '@/api'
import ArticleList from './components/ArticleList.vue'
import ChannelEdit from './ChannelEdit.vue'
export default {
  components: {
    ArticleList,
    ChannelEdit
  },
  data () {
    return {
      channelsId: 0,
      userChannelsList: [],
      allChannelsList: [],
      show: false,
      channelScrollObj: {} // 每个频道的滚动高度
    }
  },
  methods: {
    // 频道切换事件
    channelChangeFn () {
      this.$nextTick(() => {
        document.documentElement.scrollTop =
          this.channelScrollObj[this.channelsId]
      })
    },
    // 新增频道
    async addChannelFn (channelObj) {
      this.userChannelsList.push(channelObj)
      // 接口要求传入的是 id月 seq 序号 且要排除 推荐
      const newArr = this.userChannelsList.filter((obj) => obj.id !== 0) // 排除推荐
      // 将对象的name删除 在加入seq
      const theNewArr = newArr.map((obj, index) => {
        const newObj = { ...obj } // 浅拷贝
        delete newObj.name
        newObj.seq = index

        return newObj
      })

      const res = await updatedChannelsAPI({
        channels: theNewArr
      })
      console.log(res)
    },
    // 删除频道
    async removeChannelFn (channelObj) {
      const index = this.userChannelsList.findIndex(
        (obj) => obj.id === channelObj.id
      )
      this.userChannelsList.splice(index, 1)

      const res = await removeChannelsAPI({
        channelId: channelObj.id
      })
      console.log(res)
    },

    // 点击关闭需要回归初始化
    closeFn () {
      this.show = false
      this.$refs.editRef.isEdit = false
    },

    // 搜索事件
    moveSearchPageFn () {
      this.$router.push('/search')
    },
    scrollFn () {
      this.$route.meta.scrollT = document.documentElement.scrollTop
      // 保存每个频道的滚动距离
      this.channelScrollObj[this.channelsId] =
        document.documentElement.scrollTop
      // console.log(this.channelScrollObj)
    }
  },
  async created () {
    // 用户频道列表
    const res = await getUserChannelsAPI()
    // console.log(res)
    this.userChannelsList = res.data.data.channels

    // 所有频道
    const res2 = await getAllChannelsAPI()
    // console.log(res2)
    this.allChannelsList = res2.data.data.channels
  },
  computed: {
    // 计算出 用户未选的频道
    unCheckChannelList () {
      const newArr = this.allChannelsList.filter((bigObj) => {
        const index = this.userChannelsList.findIndex((smallObj) => {
          return smallObj.id === bigObj.id
        })

        if (index > -1) {
          return false
        } else {
          return true
        }
      })
      return newArr
    }
  },
  // 保存 首页的滚动的距离
  activated () {
    window.addEventListener('scroll', this.scrollFn)
    document.documentElement.scrollTop = this.$route.meta.scrollT
  },
  // 首页失去激活触发
  deactivated () {
    window.removeEventListener('scroll', this.scrollFn)
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

.edit_wrap {
  width: 100vw;
  height: 100vh;
}
</style>
