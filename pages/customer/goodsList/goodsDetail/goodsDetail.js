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
    currentBatchType: null,
    currentBatchTypeText: null,
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
      let theData = res.data
      theData.currentBatch.batch_discounts = JSON.parse(theData.currentBatch.batch_discounts)
      for (const item of theData.currentBatch.batch_discounts) {
        item.discount = formatNumber(item.discount)
        item.quantity = formatNumber(item.quantity)
      }
      theData.currentBatch.batch_minQuantity = formatNumber(theData.currentBatch.batch_minQuantity)
      if (theData.currentBatch.batch_type === 0) {
        theData.currentBatch.batch_minPrice = formatNumber(theData.currentBatch.batch_minPrice)
        theData.currentBatch.batch_maxPrice = formatNumber(theData.currentBatch.batch_maxPrice)
      } else {
        theData.currentBatch.batch_unitPrice = formatNumber(theData.currentBatch.batch_unitPrice)
      }

      this.setData({
        theData,
        currentBatchType: theData.currentBatch.batch_type,
        currentBatchTypeText: theData.currentBatch.batch_type === 1 ? '购买' : '预订'
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