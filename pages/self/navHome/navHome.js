// pages/self/navHome/navHome.js
Page({
  data: {

  },
  onLoad(options) {

  },
  sytz() { // 首页通知
    wx.navigateTo({
      url: '/pages/self/homeNotify/homeNotify',
    })
  },
  cg() { // 采购
    wx.navigateTo({
      url: '/pages/self/purchaseList/purchaseList',
    })
  },
  sh() { // 送货
    wx.navigateTo({
      url: '/pages/self/deliver/deliver',
    })
  },
  sp() { // 商品
    wx.navigateTo({
      url: '/pages/self/goodsList/goodsList',
    })
  },
  dd() { // 订单
    wx.navigateTo({
      url: '/pages/self/order/order',
    })
  },
  clly() { // 处理留言
    wx.navigateTo({
      url: '/pages/self/comment/comment',
    })
  },
})