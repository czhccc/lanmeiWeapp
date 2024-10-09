import request from './network'

// 获取用户手机号
export function _getPhoneNumber(data) {
	return request({
		url: '/wechat/getPhoneNumber',
		method: 'POST',
		data
	})
}