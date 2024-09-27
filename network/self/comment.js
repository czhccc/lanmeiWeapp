import request from '../network'

// 列表
export function _getCommentListByWechat(data) {
  return request({
		url: '/comment/getCommentListByWechat',
		data
  })
}

// 回复评论
export function _response(data) {
  return request({
		url: '/comment/response',
		data,
		method: 'POST'
  })
}

