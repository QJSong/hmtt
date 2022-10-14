import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible' // 移动端适配
import { NavBar, Form, Field, Button, Tabbar, TabbarItem, Icon, Tab, Tabs, Cell, CellGroup, List, PullRefresh, ActionSheet, Popup, Row, Col, Badge, Search, Divider, Tag, Image, Dialog, DatetimePicker } from 'vant'

Vue.use(DatetimePicker)
Vue.use(Dialog)
Vue.use(Image)
Vue.use(Tag)
Vue.use(Divider)
Vue.use(Search)
Vue.use(Badge)
Vue.use(Row)
Vue.use(Col)
Vue.use(Popup)
Vue.use(ActionSheet)
Vue.use(PullRefresh)
Vue.use(List)
Vue.use(Cell)
Vue.use(CellGroup)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(Icon)
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(Button)
Vue.use(Form)
Vue.use(Field)
Vue.use(NavBar)
Vue.config.productionTip = false

const directiveObj = {
  install (Vue) {
    Vue.directive('focus', {
      inserted (el) {
        // 控制是input 输入框
        // 需要用原生的js去找到输入框
        // 原生DOM.nodeName 拿到标签名字 必须为大写
        if (el.nodeName === 'TEXTAREA' || el.nodeName === 'INPUT') {
          el.focus()
        } else {
          const theInput = el.querySelector('input')
          const theTextArea = el.querySelector('textarea')
          if (theInput) theInput.focus()
          if (theTextArea) theTextArea.focus()
        }
      },
      update (el) {
        if (el.nodeName === 'TEXTAREA' || el.nodeName === 'INPUT') {
          el.focus()
        } else {
          const theInput = el.querySelector('input')
          const theTextArea = el.querySelector('textarea')
          if (theInput) theInput.focus()
          if (theTextArea) theTextArea.focus()
        }
      }
    })
  }
}

Vue.use(directiveObj)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
