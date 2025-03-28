// pages/mine/mine.js

import {
  _getPhoneNumber
} from '../../../network/global.js'

Page({
  data: {
    phone: null,
  },
  onLoad(options) {
    
  },
  onShow() {
    const phone = wx.getStorageSync('phone')
    this.setData({
      phone
    })
  },
  getPhoneNumber (e) {
    console.log('微信授权登录', e)
    if (!e.detail.code) { // 用户拒绝授权
      wx.showToast({
        title: e.detail.errMsg,
        icon: 'none'
      })
      return;
    }
    const { code, encryptedData, iv } = e.detail;
    _getPhoneNumber({
      code,
      encryptedData, 
      iv,
    }).then(res => {
      this.setData({
        phone: res.data.phone
      })
      wx.setStorageSync('phone', res.data.phone)
      wx.setStorageSync('token', res.data.token)
    })
  },
  
  toOrder() { // 我的订单
    wx.navigateTo({
      url: '/pages/customer/order/order',
    })
  },
  toAddress() { // 收获地址
    wx.navigateTo({
      url: '/pages/customer/address/addressList/addressList',
    })
  },
  comment() { // 想法留言
    wx.navigateTo({
      url: '/pages/customer/comment/comment',
    })
  },
  contact() { // 关于我们
    wx.navigateTo({
      url: '/pages/customer/seeSeller/seeSeller',
    })
  }
})