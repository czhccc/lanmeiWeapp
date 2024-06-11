// pages/customer/order/order.js
Page({
  data: {
    tabIndex: 0,
    isShowFilter: false,
    filterOrderId: '',
  },
  onLoad(options) {

  },
  tabChange(e) {
    console.log(e)
    this.setData({
      tabIndex: e.detail.index
    })
  },
  filter() {
    this.setData({ isShowFilter: true });
  },
  closeFilter() {
    this.setData({ isShowFilter: false });
  },
  cancelOrder() {
    wx.showModal({
      title: '确认取消预约？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定');
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    });
  },
  refund() {
    wx.showModal({
      title: '确认退款？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定');
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    });
  },
  seeDetail() {
    wx.navigateTo({
      url: '/pages/customer/order/orderDetail/orderDetail',
    })
  }
})