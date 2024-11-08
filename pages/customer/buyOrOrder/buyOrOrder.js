// pages/customer/buyOrOrder/buyOrOrder.js
Page({
  data: {
    theData: null,

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
    })

    wx.setNavigationBarTitle({
      title: this.data.theData.batch_type==='preorder'?'预订':'购买'
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
  coverImageLoadError() {
    console.log('封面图加载失败，要在这里替换成默认图片')
  }
})