// pages/self/homeNotify/homeNotify.js
import {
  _notify,
  _getLatestNotification
} from '../../../network/self/notify'

Page({
  data: {
    content: '',
    notification: {
      content: '',
      time: '',
    },

    isSubmiting: false,
  },
  onShow() {
    this.getLatestNotification()
  },
  getLatestNotification() {
    _getLatestNotification().then(res => {
      console.log(res)
      this.setData({
        notification: {
          content: res.data.content,
          createTime: res.data.createTime
        }
      })
    })
  },
  submit() {
    if (!this.data.content) {
      wx.showToast({
        title: '请填写通知内容',
        icon: 'none'
      })
      return;
    }
    if (this.data.isSubmiting) {
      return;
    }
    var that = this;
    this.data.isSubmiting = true
    wx.showModal({
      title: '确认发布？',
      success(res) {
        if (res.confirm) {
          _notify({
            content: that.data.content
          }).then(res => {
            wx.showToast({
              title: '发布成功',
              icon: 'none'
            })
            that.getLatestNotification()
          }).finally(() => {
            that.setData({
              isSubmiting: false,
              content: '',
            })
          })
        }
      }
    });
  }
})