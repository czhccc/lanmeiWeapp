// pages/temporary/home/home.js
Page({
  data: {

  },
  onLoad(options) {

  },
  selfClick() {
    wx.navigateTo({
      url: '/pages/self/navHome/navHome',
    })
  },
  customerClick() {
    wx.switchTab({
      url: '/pages/customer/home/home',
    })
  }
})