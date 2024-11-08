// pages/deal/dealPrefer/dealPreferDetail/dealPreferDetail.js
import {
  _getGoodsDetailById
} from '../../../../network/customer/goods'

import {
  formatNumber
} from '../../../../utils/utils'

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
    _getGoodsDetailById({ id }).then(res => {
      let theData = res.data
      theData.batch_discounts = JSON.parse(theData.batch_discounts)
      for (const item of theData.batch_discounts) {
        item.discount = formatNumber(item.discount)
        item.quantity = formatNumber(item.quantity)
      }
      theData.batch_minQuantity = formatNumber(theData.batch_minQuantity)
      if (theData.batch_type === 0) {
        theData.batch_minPrice = formatNumber(theData.batch_minPrice)
        theData.batch_maxPrice = formatNumber(theData.batch_maxPrice)
      } else {
        theData.batch_unitPrice = formatNumber(theData.batch_unitPrice)
      }

      this.setData({
        theData,
      })
    })
  },
  gotoCart() {
    wx.navigateTo({
      url: '/pages/cart/cart',
    })
  },
  toBuyOrOrder() {
    const app = getApp();
    app.globalData.currentGoodsDetail = this.data.theData

    wx.navigateTo({
      url: `/pages/customer/buyOrOrder/buyOrOrder`,
    })
  },
})