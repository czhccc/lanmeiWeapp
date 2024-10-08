// pages/customer/buyOrOrder/buyOrOrder.js
Page({
  data: {
    theData: null,
    currentBatchTypeText: null,

    num: 1,

    addressInfo: {},
    pickMethod: null,
    pickMethodArray: ['快递', '送货上门'],
    notes: '',
  },
  onLoad(options) {
    const app = getApp();
    this.setData({
      theData: app.globalData.currentGoodsDetail,
      currentBatchTypeText: app.globalData.currentGoodsDetail.currentBatch.batch_type===1?'购买':'预订'
    })

    wx.setNavigationBarTitle({
      title: this.data.theData.currentBatch.batch_type===1?'购买':'预订'
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