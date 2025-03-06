import request from '../network'

// 新增
export function _addAddress(data) {
   return request({
		url: '/wechat/address/add',
		method: 'POST',
		data
    })
}

// 编辑
export function _editAddress(data) {
	return request({
		url: '/wechat/address/edit',
		method: 'POST',
		data
	})
}

// 获取列表
export function _getAddressList(data) {
	return request({
		url: '/wechat/address',
		data
	})
}

// 删除
export function _deleteAddress(data) {
	return request({
		url: '/wechat/address/delete',
		method: 'POST',
		data
	})
}

// 获取默认地址
export function _getDefaultAddress(data) {
	return request({
		url: '/wechat/address/default',
		data
	})
}

// 获得省市区
export function _getAll(data) {
  return request({
    url: '/ship/getAll',
    data
  })
}