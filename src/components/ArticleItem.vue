<template>
  <!-- 一条文章单元格 -->
  <div>
    <van-cell>
      <!-- 标题区域的插槽 -->
      <template #title>
        <div class="title-box">
          <!-- 标题 -->
          <span>{{ artObj.title }}</span>
          <!-- 单图 -->
          <!-- 判断type值 显示图片 -->
          <img
            v-if="artObj.cover.type === 1"
            class="thumb"
            :src="artObj.cover.images[0]"
          />
        </div>

        <div class="thumb-box" v-if="artObj.cover.type > 1">
          <img
            v-for="(imgUrl, index) in artObj.cover.images"
            :key="index"
            class="thumb"
            :src="imgUrl"
          />
        </div>
      </template>
      <!-- label 区域的插槽 -->
      <template #label>
        <div class="label-box">
          <div>
            <span>{{ artObj.aut_name }}</span>
            <span>{{ artObj.comm_count }}评论</span>
            <span>{{ timeAgo(artObj.pubdate) }}</span>
          </div>
          <!-- 反馈按钮 阻止x号的事件冒泡-->
          <van-icon name="cross" @click.stop="show = true" v-if="isShow"/>
        </div>
      </template>
    </van-cell>
    <!-- BUG:这里会不显示底部的框，原因在于挂载在item上 被结构挤下去了 修改为挂载在body上  -->
    <van-action-sheet
      v-model="show"
      :actions="actions"
      @select="onSelect"
      get-container="body"
      :cancel-text="bottomText"
      @cancel="cancelFn"
      @close='closeFn'
    />
  </div>
</template>

<script>
import { timeAgo } from '@/utils/date'
import { firstActions, secondActions } from '@/api/report'
export default {
  props: {
    artObj: Object,
    // 反馈按钮 只有在首页文章列表出现
    isShow: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      show: false,
      actions: firstActions,
      bottomText: '取消'
    }
  },
  methods: {
    timeAgo: timeAgo,
    // 弹出层事件
    onSelect (action, item) {
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      // this.show = false
      if (action.name === '反馈垃圾内容') {
        this.actions = secondActions
        this.bottomText = '返回'
      } else if (action.name === '不感兴趣') {
        this.$emit('disLike', this.artObj.art_id)
        this.show = false // 无论成功与否 都要关掉反馈面板
      } else {
        this.$emit('report', this.artObj.art_id, action.value)
        this.show = false
      }
    },
    // 底部 返回按钮 事件
    cancelFn () {
      if (this.bottomText === '返回') {
        this.show = true // 强制让其显示
        this.actions = firstActions
        this.bottomText = '取消'
      }
    },
    // 关闭面板事件
    closeFn () {
      this.actions = firstActions
      this.bottomText = '取消'
    }
  }
}
</script>

<style scoped lang="less">
/* 标题样式 */
.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

/* label描述样式 */
.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 文章信息span */
.label-box span {
  margin: 0 3px;
  &:first-child {
    margin-left: 0;
  }
}

/* 图片的样式, 矩形黄金比例：0.618 */
.thumb {
  width: 113px;
  height: 70px;
  background-color: #f8f8f8;
  object-fit: cover;
}

/* 三图, 图片容器 */
.thumb-box {
  display: flex;
  justify-content: space-between;
}
</style>
