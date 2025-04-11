import request from '../network'

export function _getNewsListForWechat(data) {
  return request({
		url: '/wechat/news/listForWechat',
		data
  })
}

export function _getNewsDetail(data) {
  return request({
		url: '/wechat/news/detail',
		data
  })
}