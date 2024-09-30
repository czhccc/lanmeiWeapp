// pages/deal/dealPrefer/dealPreferDetail/dealPreferDetail.js
import {
  _getGoodsDetailById
} from '../../../../network/customer/goods'


Page({
  data: {
    theData: {},
    detailContet: '',
    isShowPopup: false,

    popConfirmFlag: 'addCart',
  },
  onLoad(options) {
    this.getGoodsDetailById(options.id)
  },
  getGoodsDetailById(id) {
    _getGoodsDetailById({
      id
    }).then(res => {
      this.setData({
        theData: res.data
      })
    })
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