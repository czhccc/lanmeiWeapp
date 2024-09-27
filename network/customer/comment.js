import request from '../network'

// 用户留言历史
export function _getUserAllComments(data) {
  return request({
		url: '/comment/getUserAllComments',
		data
  })
}

// 留言
export function _comment(data) {
  return request({
		url: '/comment',
		data,
		method: 'POST'
  })
}

