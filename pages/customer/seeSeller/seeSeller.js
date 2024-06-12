// pages/customer/seeSeller/seeSeller.js
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
  addressBtnClick(e) {
    console.log(e)
    wx.openLocation({
      longitude: 121.4737,
      latitude: 31.2304,
      scale: 18,
      name: '花桥村',
      address: '浙江省绍兴市嵊州市花桥村'
    });
  },
  phoneBtnClick(e) {
    console.log(e)
    wx.makePhoneCall({
      phoneNumber: '13989536366'
    })
  },
  copyContact(e) {
    console.log(e)
    wx.setClipboardData({
      data: 'aaaaa',
      success: function (res) {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
        });
      },
      fail: function (err) {
        wx.showToast({
          title: '复制失败',
          icon: 'none',
        });
      }
    });
  }
})