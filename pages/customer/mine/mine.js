// pages/mine/mine.js
// import { 
//   toLogin, 
//   bindPhone 
// } from '../../network/login'
// import {
//   getUserInfo
// } from '../../network/common'

Page({
  data: {
    userInfo: {},
  },
  onLoad(options) {
    if (options.flag && options.flag==='expire') {
      this.setData({
        userInfo: {}
      })
    }
  },
  onShow() {
    // this._getUserInfo()
  },
  _getUserInfo() {
    getUserInfo().then(res => {
      if (res.success) {
        let userInfo = res.result
        userInfo.secretPhone = res.result.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
        this.setData({
          userInfo: res.result
        })
      }
    })
  },
  getPhoneNumber (e) {
    console.log('???', e)
    let that = this
    if (!e.detail.encryptedData) {
      return;
    }
    let phoneCode = e.detail.code
    if (phoneCode) { // 用户有手机号
      wx.login({
        success: res => {
          let code = res.code
          toLogin({ code }).then(res => {
            wx.setStorageSync('token', res.result.token)
            bindPhone({ code: phoneCode }).then(res2 => {
              if (res2.success) {
                that._getUserInfo()
              }
            })
          })
        },
      })
    } else { // 用户没手机号
      wx.showToast({
        title: '微信未绑定手机号',
        icon: 'none'
      })
    }
  },

  toUserInfoDetail() {
    if (!this.data.userInfo.phone) {
      return;
    }
    wx.navigateTo({
      url: '/pages/mine/myInfo/myInfo',
    })
  },
  
  yyjl() { // 预约记录
    wx.navigateTo({
      url: '/pages/order/orderRecord/orderRecord',
    })
  },
  hyk() { // 会员卡
    wx.navigateTo({
      url: '/pages/card/card',
    })
  },
  yxdd() { // 优选订单
    wx.navigateTo({
      url: '/pages/deal/dealPrefer/dealPrefer',
    })
  },
  jfdh() { // 积分兑换
    wx.navigateTo({
      url: '/pages/deal/dealPoint/dealPoint',
    })
  },
  dddd() { // 到店订单
    wx.navigateTo({
      url: '/pages/deal/dealShop/dealShop',
    })
  },
  zfjl() { // 支付记录
    wx.navigateTo({
      url: '/pages/consume/consume',
    })
  },
  mdlb() { // 门店列表
    wx.navigateTo({
      url: '/pages/shopList/shopList',
    })
  },
  lxkf() { // 联系客服
    wx.makePhoneCall({
      phoneNumber: '18261521199'
    })
  }
})