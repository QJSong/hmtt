// 封装接口

import request from '@/utils/request'
import { getStorage } from '@/utils/storage'

// 登陆 - 获取tokrn接口
export const loginAPI = ({ mobile, code }) => request({
  url: '/v1_0/authorizations',
  method: 'POST',
  data: {
    mobile,
    code
  }
})

// 登陆 - 获取refresh_token
export const getNewTokenAPI = () => request({
  url: '/v1_0/authorizations',
  method: 'PUT',
  headers: {
    Authorization: 'Bearer ' + getStorage('refresh_token')
  }
})

// 用户 - 关注用户
export const userFollowedAPI = ({ userId }) => request({
  url: '/v1_0/user/followings',
  method: 'POST',
  data: {
    target: userId
  }
})

// 用户 - 取消关注
export const userUnFollowedAPI = ({ userId }) => request({
  url: `/v1_0/user/followings/${userId}`,
  method: 'DELETE'
})

// 用户 -  用户自己的信息(个人中心使用)
export const userInfoAPI = () => request({
  url: '/v1_0/user',
  method: 'GET'
})

// 用户 -  修改用户头像
export const updatedUserPhotoAPI = (fd) => request({
  url: '/v1_0/user/photo',
  method: 'PATCH',
  data: fd
})

// 用户 - 用户基本信息(编辑个人资料使用)
export const userProfileAPI = () => request({
  url: '/v1_0/user/profile',
  method: 'GET'
})

// 用户 - 修改姓名
export const updateUserProfileAPI = (dataObj) => {
  const obj = {
    name: '',
    gender: 0,
    birthday: '',
    intro: ''
  }
  for (const k in obj) {
    if (dataObj[k] === undefined) {
      delete obj[k]
    } else {
      obj[k] = dataObj[k]
    }
  }
  return request({
    url: '/v1_0/user/profile',
    method: 'PATCH',
    data: obj
  })
}

// 频道 - 获取所有频道
export const getAllChannelsAPI = () => request({
  url: '/v1_0/channels',
  method: 'GET'
})

// 频道 - 获取用户频道
export const getUserChannelsAPI = () => request({
  url: '/v1_0/user/channels'
})

// 频道 - 设置更新用户所选频道
export const updatedChannelsAPI = ({ channels }) => request({
  url: '/v1_0/user/channels',
  method: 'PUT',
  data: {
    channels
  }
})

// 频道 - 删除频道
export const removeChannelsAPI = ({ channelId }) => request({
  url: `/v1_0/user/channels/${channelId}`,
  method: 'DELETE'
})

// 新闻 - 获取新闻推荐
export const getAllArticleListAPI = ({ channel_id, timestamp }) => request({
  url: '/v1_0/articles',
  method: 'GET',
  // 这里的参数，axios会帮你拼接到url？后面(查询字符串)
  params: {
    channel_id,
    timestamp
  }
})

// 文章 - 不感兴趣
export const dislikeArticleAPI = ({ artId }) => request({
  url: '/v1_0/article/dislikes',
  method: 'POST',
  data: {
    target: artId
  }
})

// 文章 - 反馈垃圾内容
export const reportArticleAPI = ({ artId, type }) => request({
  url: '/v1_0/article/reports',
  method: 'POST',
  data: {
    target: artId,
    type: type,
    remark: '暂时不做'
  }
})

// 文章 - 详情
export const detailAPI = ({ artId }) => request({
  url: `/v1_0/articles/${artId}`
})

// 文章 - 点赞
export const articleLikeAPI = ({ artId }) => request({
  url: '/v1_0/article/likings',
  method: 'POST',
  data: {
    target: artId
  }
})

// 文章 - 取消点赞
export const articleUnLikeAPI = ({ artId }) => request({
  url: `/v1_0/article/likings/${artId}`,
  method: 'DELETE'
})

// 搜索 - 搜索联想
export const suggestionListAPI = ({ keywords }) => request({
  url: '/v1_0/suggestion',
  params: {
    q: keywords
  }
})

// 搜索 - 搜索结果
export const searchResultAPI = ({ page = 1, per_page = 10, q }) => request({
  url: '/v1_0/search',
  method: 'GET',
  params: {
    page,
    per_page,
    q
  }
})

// 评论 - 获取评论
export const articleCommentsAPI = ({ artId, offset = null, limit = 10 }) => request({
  url: '/v1_0/comments',
  method: 'GET',
  params: { // axios 只针对params参数 如果发现键值队 值为null 会忽略 不会进行拼接
    type: 'a', // 对文章的评论
    source: artId,
    offset,
    limit
  }
})

// 评论 - 评论点赞
export const commentsLikeAPI = ({ comId }) => request({
  url: '/v1_0/comment/likings',
  method: 'POST',
  data: {
    target: comId
  }
})

// 评论 - 取消评论点赞
export const commentsUnLikeAPI = ({ comId }) => request({
  url: `/v1_0/comment/likings/${comId}`,
  method: 'DELETE'
})

// 评论 - 发布评论
export const commentsSendAPI = ({ id, content, art_id = null }) => {
  // 处理 art_id 只是对文章进行评论是不需要art_id
  const obj = {
    target: id,
    content
  }
  if (art_id !== null) {
    obj.art_id = art_id
  }
  return request({
    url: '/v1_0/comments',
    method: 'POST',
    data: obj
  })
}
