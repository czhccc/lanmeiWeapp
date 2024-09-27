import request from '../network'

// 获取
export function _getAboutUs(data) {
  return request({
		url: '/aboutUs',
		data
  })
}


