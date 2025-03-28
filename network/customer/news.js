import request from '../network'

export function _getNewsList(data) {
  return request({
		url: '/wechat/news/list',
		data
  })
}

export function _getNewsDetail(data) {
  return request({
		url: '/wechat/news/detail',
		data
  })
}