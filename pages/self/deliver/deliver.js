// pages/self/deliver/deliver.js
Page({
  data: {
    tabIndex: 0,
    searchParam: '',
  },
  onLoad(options) {

  },
  tabChange(e) {
    this.setData({
      tabIndex: e.detail.index
    })
  },
  onSearch(e) {
    console.log(e)
  },
  arrive() {
    wx.showModal({
      title: '确认已送达？',
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
  seeDetail(e) {
    wx.navigateTo({
      url: '/pages/self/order/orderDetail/orderDetail',
    })
  }
})