// pages/self/aboutUs/aboutUs.js
Page({
  data: {
    activeName: '1',
  },
  onLoad(options) {

  },
  onChange(e) {
    console.log(e)
    this.setData({
      activeName: e.detail
    })
  },
})