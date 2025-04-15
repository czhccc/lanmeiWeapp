import request from '../network'

// 获取
export function _getIdempotencyKey(data) {
  return request({
		url: '/util/getIdempotencyKey',
    data,
    method: 'POST'
  })
}


