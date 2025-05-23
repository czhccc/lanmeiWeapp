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

// 获取订单详情
export function _getOrderDetailById(data) {
  return request({
		url: '/order/getOrderDetailById',
    data,
	})
}

// 取消订单
export function _cancelOrder(data) {
  return request({
		url: '/order/cancelOrder',
    data,
    method: 'POST'
	}, false)
}

// 付款订单
export function _payOrder(data) {
  return request({
		url: '/order/payOrder',
    data,
    method: 'POST'
	}, false)
}

// 确认收货（完结订单）
export function _completeOrder(data) {
  return request({
		url: '/order/completeOrder',
    data,
    method: 'POST'
	}, false)
}

// 计算订单信息
export function _generateOrderInfo(data) {
  return request({
		url: '/order/generateOrderInfo',
    data,
    method: 'POST'
	}, false)
}