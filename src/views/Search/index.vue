<template>
  <div>
    <!-- 搜索页面头部 -->
    <div class="search-header">
      <!-- 后退按钮 -->
      <van-icon
        name="arrow-left"
        color="white"
        size="0.48rem"
        class="goback"
        @click="$router.back()"
      />
      <!-- 搜索组件 -->
      <van-search
        placeholder="请输入搜索关键词"
        background="#007BFF"
        shape="round"
        v-focus
        v-model.trim="kw"
        @input="inputFn"
        @search="searchFn"
      />
    </div>
    <!-- 搜索建议列表 -->
    <div class="sugg-list" v-if="kw !== ''">
      <div
        class="sugg-item"
        v-for="(str, index) in suggestionList"
        :key="index"
        v-html="lightFn(str, kw)"
        @click="suggestFn(str)"
      ></div>
    </div>

    <!-- 搜索历史 -->
    <div class="search-history" v-else>
      <!-- 标题 -->
      <van-cell title="搜索历史">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
          <van-icon name="delete" class="search-icon" @click="clearFn"/>
        </template>
      </van-cell>

      <!-- 历史列表 -->
      <div class="history-list">
        <span
          class="history-item"
          v-for="(str, index) in history"
          :key="index"
          @click="historyFn(str)"
          >{{ str }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { suggestionListAPI } from '@/api'
export default {
  data () {
    return {
      kw: '', // 搜索关键字
      timer: null,
      suggestionList: [],
      history: JSON.parse(localStorage.getItem('his')) || [] // 搜索历史
    }
  },
  methods: {
    inputFn () {
      // 防抖
      clearTimeout(this.timer)

      if (this.kw.length === 0) {
        this.suggestionList = []
      } else {
        this.timer = setTimeout(async () => {
          if (this.kw.length === 0) return
          const res = await suggestionListAPI({
            keywords: this.kw
          })
          //   console.log(res)
          this.suggestionList = res.data.data.options
        }, 300)
      }
    },
    // 处理关键字高亮
    lightFn (originStr, target) {
      // originStr 原来的字符串
      // target 关键字
      // 字符串的方法 replaceAll 加上All 全部都高亮

      // 匹配的字符串 需要区分大小写
      // 正则需要用变量的话 不能用语法糖 写
      const reg = new RegExp(target, 'ig')
      // BUG：会将输入框里的值 替换到搜索结果里 所以这里replaceAll 第二个参数需要给个函数
      return originStr.replaceAll(reg, (match) => {
        return `<span style="color:red;">${match}</span>`
      })
    },
    // 封装路由跳转
    moveFn (thekw) {
      setTimeout(() => {
        this.$router.push({
          path: `/search_result/${thekw}`
        })
      }, 0)
    },

    // 搜索框跳转搜索结果页面
    searchFn () {
      if (this.kw.length > 0) {
        // 搜索的关键字存储在搜索历史里
        this.history.push(this.kw)
        this.moveFn(this.kw)
      }
    },
    // 搜索建议列表跳转搜索结果页面
    suggestFn (str) {
      // 搜索的关键字存储在搜索历史里
      this.history.push(str)
      this.moveFn(str)
    },
    // 历史列表跳转搜索结果页面
    historyFn (str) {
      this.moveFn(str)
    },
    clearFn () {
      this.history = []
    }
  },
  // 侦听history 发生变化就存储在本地
  watch: {
    history: {
      deep: true,
      handler () {
        // ES6 新增Set和 Map 类型 set不会重复
        // 把history 转化为 set 对象
        const theSet = new Set(this.history)
        // 在把 theSet 转化为 数组
        const arr = Array.from(theSet)
        localStorage.setItem('his', JSON.stringify(arr))
      }
    }
  }
}
</script>

<style scoped lang="less">
.search-header {
  height: 46px;
  display: flex;
  align-items: center;
  background-color: #007bff;
  overflow: hidden;
  /*后退按钮*/
  .goback {
    padding-left: 14px;
  }
  /*搜索组件*/
  .van-search {
    flex: 1;
  }
}

/*搜索建议列表样式 */
.sugg-list {
  .sugg-item {
    padding: 0 15px;
    border-bottom: 1px solid #f8f8f8;
    font-size: 14px;
    line-height: 50px;
    // 实现省略号的三行代码
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

/**搜索历史 */
.search-icon {
  font-size: 16px;
  line-height: inherit;
}

.history-list {
  padding: 0 10px;
  .history-item {
    display: inline-block;
    font-size: 12px;
    padding: 8px 14px;
    background-color: #efefef;
    margin: 10px 8px 0px 8px;
    border-radius: 10px;
  }
}
</style>
