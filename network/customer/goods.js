import request from '../network'

// 获取分类
export function _getCategory(data) {
  return request({
		url: '/category',
		data
  })
}

// 获取商品列表
export function _getGoodsList(data) {
  return request({
		url: '/goods/getGoodsList',
		data
  })
}

// 获取商品详情
export function _getGoodsDetailById(data) {
  return request({
		url: '/goods/getGoodsDetailById',
		data
  })
}
