// pages/customer/buyOrOrder/buyOrOrder.js
Page({
  data: {
    num: 1,

    addressInfo: {},
    pickMethod: null,
    pickMethodArray: ['快递', '送货上门'],
    notes: '',
  },
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '预约或购买'
    });
  },
  numChnage(e) {
    this.setData({
      num: e.detail
    })
  },
  chooseAddress() {
    wx.navigateTo({
      url: '/pages/customer/address/addressList/addressList?isChoose=true',
    })
  },
  bindPickMethodChange(e) {
    console.log(e)
    this.setData({
      pickMethod: this.data.pickMethodArray[Number(e.detail.value)]
    })
  },
  submit() {
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
})