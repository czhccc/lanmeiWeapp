// app.js
App({
  onLaunch() {
    // scroll-view 参考

    // wx.showModal({
    //   title: '确认取消预订？',
    //   success(res) {
    //     if (res.confirm) {
    //       console.log('用户点击确定');
    //     } else if (res.cancel) {
    //       console.log('用户点击取消');
    //     }
    //   }
    // });
  },
  globalData: {
    userInfo: null
  }
})
