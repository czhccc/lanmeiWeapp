// pages/customer/order/orderDetail/orderDetail.js
import {
  _getOrderDetailById,
  _cancelSingleReservedOrder,
  _payOrder,
} from '../../../../network/customer/order'

import dayjs from 'dayjs'

Page({
  data: {
    orderId: null,
    theData: null,
    isShowBottom: false,

    isShowCancelOrderPopup: false,
    cancelOrderReason: '',

    isSubmitting: false,
  },
  onLoad(options) {
    this.data.orderId = options.id

    this.getOrderDetailById()
  },
  getOrderDetailById() {
    _getOrderDetailById({id: this.data.orderId}).then(res => {
      let theData = res.data
      let statusText = ''
      switch (theData.status) {
        case 'reserved': statusText='已预订';break;
        case 'paid': statusText='已付款';break;
        case 'unpaid': statusText='未付款';break;
        case 'completed': statusText='已完成';break;
        case 'canceled': statusText='已取消';break;
        case 'refunded': statusText='已退款';break;
        default: break;
      }
      theData.statusText = statusText

      theData.preorder_time = theData.preorder_time ? dayjs(theData.preorder_time).format("YYYY-MM-DD HH:mm:ss") : null
      theData.cancel_time = theData.cancel_time ? dayjs(theData.cancel_time).format("YYYY-MM-DD HH:mm:ss") : null
      theData.pay_time = theData.pay_time ? dayjs(theData.pay_time).format("YYYY-MM-DD HH:mm:ss") : null
      theData.complete_time = theData.complete_time ? dayjs(theData.complete_time).format("YYYY-MM-DD HH:mm:ss") : null

      let finalPrice = null
      if (theData.batch_type==='preorder') {
        if (theData.status==='reserved' || theData.status==='canceled') { // 预订阶段
          theData.totalMinPrice = (Number(theData.preorder_minPrice)*Number(theData.num)).toFixed(2)
          theData.totalMaxPrice = (Number(theData.preorder_maxPrice)*Number(theData.num)).toFixed(2)

          let finalMinPrice = (Number(theData.preorder_minPrice)*Number(theData.num) + Number(theData.postage) - Number(theData.discountAmount_promotion) - Number(theData.discountAmount_custom)).toFixed(2)
          let finalMaxPrice = (Number(theData.preorder_maxPrice)*Number(theData.num) + Number(theData.postage) - Number(theData.discountAmount_promotion) - Number(theData.discountAmount_custom)).toFixed(2)
          finalPrice = `${finalMinPrice} ~ ${finalMaxPrice}`
        } else if (theData.status==='unpaid') { // 售卖阶段
          theData.totalPrice = (Number(theData.preorder_finalPrice)*Number(theData.num)).toFixed(2)

          finalPrice = (Number(theData.preorder_finalPrice)*Number(theData.num) + Number(theData.postage) - Number(theData.discountAmount_promotion) - Number(theData.discountAmount_custom)).toFixed(2)
        }
      } else {
        finalPrice = (Number(theData.stock_unitPrice)*Number(theData.num) + Number(theData.postage) - Number(theData.discountAmount_promotion) - Number(theData.discountAmount_custom)).toFixed(2)
      }
      theData.finalPrice = finalPrice

      this.setData({
        theData: res.data,
        isSubmitting: false,
        isShowBottom: theData.status==='reserved'||theData.status==='unpaid'||theData.status==='paid',
      })
    })
  },
  // 取消订单
  cancelOrder() {
    if (this.data.isSubmitting) {
      return;
    }
    this.setData({
      isShowCancelOrderPopup: true,
      cancelOrderReason: '',
    })
  },
  closeCancelOrderPopup() {
    this.setData({
      isShowCancelOrderPopup: false,
    })
  },
  cancelOrderPopupConfirm() {
    this.data.isSubmitting = false

    _cancelSingleReservedOrder({
      orderId: this.data.orderId,
      cancelOrderReason: this.data.cancelOrderReason,
    }).then(res => {
      if (res.code === 200) {
        this.setData({
          isShowCancelOrderPopup: false,
        })
        wx.showToast({
          title: '取消预订成功',
        })
        setTimeout(() => {
          this.getOrderDetailById()
        }, 1500)
      } else {
        wx.showToast({
          title: res.message,
          icon: 'error'
        })
      }
    })
  },
  // 付款
  payOrder() {
    if (this.data.isSubmitting) {
      return;
    }

    this.data.isSubmitting = true
    _payOrder({
      orderId: this.data.orderId
    }).then(res => {
      if (res.code === 200) {
        wx.showToast({
          title: '付款成功',
        })
        setTimeout(() => {
          this.getOrderDetailById()
        }, 1500)
      }
    })
  },
  copyOrderId(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success(res) {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
        });
      },
    });
  },
})