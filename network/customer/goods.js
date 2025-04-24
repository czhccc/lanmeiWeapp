import request from '../network'

// 获取分类
export function _getCategoryList(data) {
  return request({
		url: '/category/listForWechat',
		data
  })
}

// 获取商品列表
export function _getGoodsList(data) {
  return request({
		url: '/goods/getGoodsListForWechat',
    data,
    method: 'POST'
  })
}

// 获取商品详情
export function _getGoodsDetailById(data) {
  return request({
		url: '/goods/getGoodsDetailById',
		data
  })
}

// 获取 stock批次 库存
export function _getGoodsStockRemainingQuantityFromRedis(data) {
  return request({
    url: '/goods/getGoodsStockRemainingQuantityFromRedis',
    data
  })
}
