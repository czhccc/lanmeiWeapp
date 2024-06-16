// pages/self/order/orderDetail/orderDetail.js
Page({
  data: {
    isShowCancelPopup: false,
    cancelOrderReason: '',

    isChangingAmount: false,

    status: '', // 当前状态
    statusArr: [  // 当前状态
      {value: 'USA', name: '预订中'},
      {value: 'BRA', name: '采购中'},
      {value: 'ENG', name: '销售中'},
      {value: 'FRA', name: '已完结'},
    ],
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
  changeAmount() { // 修改金额
    this.setData({
      isChangingAmount: true
    })
  },
  changeAmountCancel() {
    this.setData({
      isChangingAmount: false
    })
  },
  changeAmountConfirm() {
    this.setData({
      isChangingAmount: true
    })
  },
  statusChange(e) { // 当前状态
    console.log(e)
    this.setData({
      status: e.detail.value
    })
  },
  submitStatus() { // 确认修改状态
    wx.showModal({
      title: '确认修改订单状态？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定');
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    });
  },
  cancelOrder() {
    this.setData({
      isShowCancelPopup: true,
      cancelOrderReason: '',
    })
  },
  cancelOrderCancel() {
    this.setData({
      isShowCancelPopup: false
    })
  },
  cancelOrderConfirm() {
    this.setData({
      isShowCancelPopup: true
    })
  },
})