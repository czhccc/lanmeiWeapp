// pages/deal/dealPrefer/dealPreferDetail/dealPreferDetail.js

Page({
  data: {
    theData: {},
    detailContet: '',
    isShowPopup: false,

    popConfirmFlag: 'addCart',

    popupNum: 1,
  },
  onLoad(options) {
    console.log(options.id)
    this._getPreferGoodsDetail(options.id)
  },
  _getPreferGoodsDetail(id) {
    // getPreferGoodsDetail({
    //   id
    // }).then(res => {
    //   this.setData({
    //     theData: res.result
    //   })
    // })
  },
  gotoCart() {
    wx.navigateTo({
      url: '/pages/cart/cart',
    })
  },
  toBuyOrOrder() {
    wx.navigateTo({
      url: '/pages/customer/buyOrOrder/buyOrOrder',
    })
  },
})