<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar
      title="编辑资料"
      left-arrow
      @click-left="$router.back()"
      fixed
    />

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <van-image
            round
            class="avatar"
            :src="profileObj.photo"
            @click="imageFn"
          />
          <!-- file 选择框 -->
          <input
            type="file"
            ref="iptFile"
            v-show="false"
            accept="image/*"
            @change="onFileChange"
          />
        </template>
      </van-cell>
      <van-cell
        title="名称"
        is-link
        :value="profileObj.name"
        @click="nameClickFn"
      />
      <van-cell title="生日" is-link :value="profileObj.birthday" @click="birthdayShowFn"/>
    </van-cell-group>

    <!-- 姓名修改弹窗 -->
    <van-dialog
      v-model="show"
      title="修改名称"
      show-cancel-button
      :beforeClose="beforeCloseFn"
    >
      <input type="text" v-focus v-model="inputUserName" />
    </van-dialog>

    <!-- 生日选择 -->
    <van-popup v-model="birthdayShow" position="bottom" :style="{ height: '50%' }">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="cancelFn"
        @confirm="confirmFn"
      />
    </van-popup>
  </div>
</template>

<script>
import {
  userProfileAPI,
  updatedUserPhotoAPI,
  updateUserProfileAPI
} from '@/api'
import { Notify } from 'vant'
import { formatDate } from '@/utils/date'
export default {
  name: 'UserEdit',
  data () {
    return {
      profileObj: {},
      show: false,
      inputUserName: '',
      birthdayShow: false,
      minDate: new Date(1920, 0, 1),
      maxDate: new Date(),
      currentDate: new Date() // 当前日期
    }
  },
  async created () {
    const res = await userProfileAPI()
    console.log(res)
    this.profileObj = res.data.data
  },
  methods: {
    // 上传文件的方法
    async onFileChange (e) {
      if (e.target.files.length === 0) return
      console.log(e.target.files[0])
      const theFd = new FormData() // 创建一个FormData表单对象
      theFd.append('photo', e.target.files[0]) // 往表单里加入 键值对

      const res = await updatedUserPhotoAPI(theFd)
      console.log(res)
      this.profileObj.photo = res.data.data.photo
    },
    imageFn () {
      this.$refs.iptFile.click()
    },
    // 修改名字方法
    nameClickFn () {
      this.show = true
      this.inputUserName = this.profileObj.name
    },
    // 弹窗 - 确认按钮的回调函数
    async beforeCloseFn (action, done) {
      if (action === 'confirm') {
        // 正则的验证
        const reg = /^[A-Za-z0-9\u4e00-\u9fa5]{1,7}$/
        if (reg.test(this.inputUserName) === true) {
          // 通过验证
          await updateUserProfileAPI({
            name: this.inputUserName
          })
          this.profileObj.name = this.inputUserName // 回显在页面上
          done()
        } else {
          Notify({ type: 'warning', message: '用户名只能是1-7中英文数字组合' })
          done(false)
        }
      } else {
        done()
      }
    },
    // 修改生日
    birthdayShowFn () {
      this.birthdayShow = true
      this.currentDate = new Date(this.profileObj.birthday)
    },
    // 时间组件关闭的方法
    cancelFn () {
      this.birthdayShow = false
    },
    // 时间组件的确定事件
    async confirmFn () {
      await updateUserProfileAPI({
        birthday: formatDate(this.currentDate)
      })
      this.birthdayShow = false
      this.profileObj.birthday = formatDate(this.currentDate)
    }
  }
}
</script>

<style lang="less" scoped>
.user-edit-container {
  padding-top: 46px;
  .avatar {
    width: 50px;
    height: 50px;
  }
}

/deep/ .van-dialog__content {
  text-align: center;
  input {
    border: none;
    padding: 0;
    outline: none;
    text-align: center;
  }
}
</style>
