import request from '../network'

// 创建订单
export function _createOrder(data) {
	return request({
		url: '/order/createOrder',
		data,
		method: 'POST'
	}, false)
}

// 获取订单列表
export function _getOrderList(data) {
	return request({
		url: '/order/getOrderList',
		data
	})
}