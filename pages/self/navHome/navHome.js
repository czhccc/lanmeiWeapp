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

  },
  sh() { // 送货
    wx.navigateTo({
      url: '/pages/self/deliver/deliver',
    })
  },
  cp() { // 产品

  },
  dd() { // 订单

  },
  clly() { // 处理留言
    wx.navigateTo({
      url: '/pages/self/handleComment/handleComment',
    })
  },
  gywm() { // 关于我们
    wx.navigateTo({
      url: '/pages/self/aboutUs/aboutUs',
    })
  },
  pzgg() { // 配置广告

  }
})