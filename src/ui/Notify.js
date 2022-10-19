// 封装ui组件 方便以后的更换
// import { Notify } from 'vant'
// export default Notify

import { Toast } from 'vant'
export default ({ type, message }) => {
  if (type === 'danger') {
    type = 'fail'
  }
  Toast({
    type,
    message
  })
}
