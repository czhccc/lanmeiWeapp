// pages/deal/dealPrefer/dealPreferDetail/dealPreferDetail.js
import {
  _getGoodsDetailById,
  _getGoodsStockRemainingQuantityFromRedis,
} from '../../../../network/customer/goods'

import {
  formatNumber
} from '../../../../utils/utils'

Page({
  data: {
    id: null,
    batch_type: null,

    theData: {},
    detailContet: '',

    stock_RemainingQuantity: null,

    isShowPopup: false,

    provinces: [],
  },
  onLoad(options) {
    this.data.id = options.id
    this.data.batch_type = options.batch_type
  },
  onShow() {
    this.getGoodsDetailById()
    
    if (this.data.batch_type === 'preorder') {

    } else if (this.data.batch_type === 'stock') {
      this.getGoodsStockRemainingQuantityFromRedis()
    }
  },
  getGoodsDetailById() {
    _getGoodsDetailById({ id: this.data.id }).then(res => {
      let theData = res.data

      if (theData.batch_discounts_promotion && theData.batch_discounts_promotion.length>0) {
        for (const item of theData.batch_discounts_promotion) {
          item.discount = formatNumber(item.discount)
          item.quantity = formatNumber(item.quantity)
        }
      }
      
      theData.batch_minQuantity = formatNumber(theData.batch_minQuantity)
      theData.batch_remainingQuantity = formatNumber(theData.batch_remainingQuantity)
      if (theData.batch_type === 'preorder') {
        theData.batch_preorder_minPrice = theData.batch_preorder_minPrice
        theData.batch_preorder_maxPrice = theData.batch_preorder_maxPrice
      } else {
        theData.batch_stock_unitPrice = theData.batch_stock_unitPrice
        theData.batch_stock = formatNumber(theData.batch_stock)
      }

      this.setData({
        theData,
        provinces: theData.batch_ship_provinces.map(item => item.name).join('、')
      })
    })
  },
  getGoodsStockRemainingQuantityFromRedis() {
    _getGoodsStockRemainingQuantityFromRedis({ id: this.data.id }).then(res => {
      this.setData({
        stock_RemainingQuantity: res.data.remainingQuantity
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
      url: `/pages/customer/buyOrOrder/buyOrOrder?id=${this.data.id}`,
    })
  },
})