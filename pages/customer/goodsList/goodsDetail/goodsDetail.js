// pages/deal/dealPrefer/dealPreferDetail/dealPreferDetail.js
import {
  _getGoodsDetailById
} from '../../../../network/customer/goods'

import {
  formatNumber
} from '../../../../utils/utils'

Page({
  data: {
    id: null,
    theData: {},
    detailContet: '',
    isShowPopup: false,

    provinces: [],
  },
  onLoad(options) {
    this.data.id = options.id
  },
  onShow() {
    if (this.data.id) {
      this.getGoodsDetailById(this.data.id)
    }
  },
  getGoodsDetailById(id) {
    _getGoodsDetailById({ id }).then(res => {
      let theData = res.data

      if (theData.batch_discounts && theData.batch_discounts.length>0) {
        theData.batch_discounts = JSON.parse(theData.batch_discounts)
        for (const item of theData.batch_discounts) {
          item.discount = formatNumber(item.discount)
          item.quantity = formatNumber(item.quantity)
        }
      }
      
      theData.batch_minQuantity = formatNumber(theData.batch_minQuantity)
      theData.batch_remainingAmount = formatNumber(theData.batch_remainingAmount)
      if (theData.batch_type === 'preorder') {
        theData.batch_minPrice = theData.batch_minPrice
        theData.batch_maxPrice = theData.batch_maxPrice
      } else {
        theData.batch_unitPrice = theData.batch_unitPrice
        theData.batch_stock = formatNumber(theData.batch_stock)
      }

      this.setData({
        theData,
        provinces: theData.batch_shipProvinces.map(item => item.name).join('、')
      })
    })
  },
  gotoCart() {
    wx.navigateTo({
      url: '/pages/cart/cart',
    })
  },
  toBuyOrOrder() {
    if (this.data.theData.batch_type === 'stock') {
      if (this.data.theData.batch_stock <= 0) {
        wx.showToast({
          title: '已经卖完了...',
          icon: 'none'
        })
        return;
      }
    }

    const app = getApp();
    app.globalData.currentGoodsDetail = this.data.theData

    wx.navigateTo({
      url: `/pages/customer/buyOrOrder/buyOrOrder`,
    })
  },
})