<template>
  <div>
    <van-nav-bar title="黑马头条-登陆" />
    <div>
      <van-form @submit="onSubmit">
        <van-field
          required
          v-model="user.mobile"
          name="mobile"
          label="手机号"
          placeholder="请输入11位手机号"
          :rules="[
            {
              required: true,
              message: '请填写正确手机号',
              pattern: /^1[3-9]\d{9}$/,
            },
          ]"
        />
        <van-field
          required
          v-model="user.code"
          type="password"
          name="code"
          label="密码"
          placeholder="请输入6位数密码"
          :rules="[
            { required: true, message: '请填写正确的密码', pattern: /^\d{6}$/ },
          ]"
        />
        <div style="margin: 16px">
          <van-button
            round
            block
            type="info"
            native-type="submit"
            :disabled='isLoading'
            :loading='isLoading'
            loading-text="正在登录ing..."
            >登录</van-button
          >
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { loginAPI } from '@/api'
import { setToken } from '@/utils/token'
import { Notify } from 'vant'
export default {
  data () {
    return {
      user: {
        mobile: '13438246748', // 手机号
        code: '246810' // 验证码（密码）
      },
      isLoading: false // 加载状态
    }
  },
  methods: {
    async onSubmit (values) {
      //   console.log('submit', values)
      this.isLoading = true
      // 登录失败 给用户提示报错
      try {
        const res = await loginAPI(this.user)
        console.log(res)
        Notify({ type: 'success', message: '登陆成功！' })
        // token存储在本地
        setToken(res.data.data.token)
        // 页面跳转 这不是不用push 是因为push会产生历史记录 可以回退
        this.$router.replace({
          path: '/layout/home'
        })
      } catch (error) {
        Notify({ type: 'danger', message: '账号或密码错误' })
      }

      this.isLoading = false
    }
  }
}
</script>

<style lang="less" scoped>
//  要修改组件内的样式 且还加了scoped 就需要在选择器前加上 /deep/
// .van-nav-bar{
//    background: #007bff;
// }
// /deep/ .van-nav-bar__title{
//     color: white;
// }
</style>
