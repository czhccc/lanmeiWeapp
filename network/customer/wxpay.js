import request from '../network'

export function _getWxpayParams(data) {
  return request({
		url: '/wxpay/getWxpayParams',
    data,
    method: 'POST'
  })
}