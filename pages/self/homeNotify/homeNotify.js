// pages/self/homeNotify/homeNotify.js
Page({
  data: {
    message: '',
  },
  submit() {
    if (!this.data.message) {
      wx.showToast({
        title: '请填写通知内容',
        icon: 'none'
      })
    }
    wx.showModal({
      title: '确认保存？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定');
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    });
  }
})