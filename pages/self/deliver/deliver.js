// pages/self/deliver/deliver.js
Page({
  data: {
    tabIndex: 0,
  },
  onLoad(options) {

  },
  tabChange(e) {
    this.setData({
      tabIndex: e.detail.index
    })
  },
  arrive() {
    wx.showModal({
      title: '确认提交？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定');
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    });
  },
  havePaid() {
    wx.showModal({
      title: '确认已收款？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定');
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    });
  },
})