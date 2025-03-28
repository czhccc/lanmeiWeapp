import request from '../network'

export function _getRecommendList(data) {
  return request({
		url: '/wechat/recommend',
		data
  })
}