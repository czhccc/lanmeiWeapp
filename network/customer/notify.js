import request from '../network'

// 获取
export function _getLatestNotification(data) {
  return request({
		url: '/wechat/notify/getLatestNotification',
		data
  })
}