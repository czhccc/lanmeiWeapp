// pages/self/order/orderDetail/orderDetail.js
Page({
  data: {

  },
  onLoad(options) {

  },
  copyOrderId() {
    wx.setClipboardData({
      data: '1111111111',
      success(res) {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
        });
      },
      fail(err) {
        wx.showToast({
          title: '复制失败',
          icon: 'error',
        });
      }
    });
  },
})