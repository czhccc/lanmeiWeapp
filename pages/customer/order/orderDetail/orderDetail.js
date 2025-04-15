// pages/customer/order/orderDetail/orderDetail.js
import {
  _getOrderDetailById,
  _cancelOrder,
  _payOrder,
  _completeOrder,
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
        case 'canceled': statusText='已取消';break;
        case 'unpaid': statusText='未付款';break;
        case 'paid': statusText='已付款';break;
        case 'shipped': statusText='已发货';break;
        case 'completed': statusText='已完结';break;
        case 'refunded': statusText='已退款';break;
        default: break;
      }
      theData.statusText = statusText

      theData.preorder_time = theData.preorder_time ? dayjs(theData.preorder_time).format("YYYY-MM-DD HH:mm:ss") : null
      theData.cancel_time = theData.cancel_time ? dayjs(theData.cancel_time).format("YYYY-MM-DD HH:mm:ss") : null
      theData.pay_time = theData.pay_time ? dayjs(theData.pay_time).format("YYYY-MM-DD HH:mm:ss") : null
      theData.complete_time = theData.complete_time ? dayjs(theData.complete_time).format("YYYY-MM-DD HH:mm:ss") : null

      let finalPrice = null
      let extraOptionsTotalAmount = 0 
      if (Array.isArray(theData.extraOptions)) {
        extraOptionsTotalAmount = theData.extraOptions.reduce((total, item) => total+item.amount, 0)
      }

      if (theData.batch_type==='preorder') { // preorder
        if (theData.status==='reserved' || theData.status==='canceled') { // 预订阶段
          theData.totalMinPrice = (Number(theData.preorder_minPrice)*Number(theData.quantity)).toFixed(2)
          theData.totalMaxPrice = (Number(theData.preorder_maxPrice)*Number(theData.quantity)).toFixed(2)

          let finalMinPrice = (Number(theData.preorder_minPrice)*Number(theData.quantity) + extraOptionsTotalAmount + Number(theData.postage) - Number(theData.discountAmount_promotion)).toFixed(2)
          let finalMaxPrice = (Number(theData.preorder_maxPrice)*Number(theData.quantity) + extraOptionsTotalAmount + Number(theData.postage) - Number(theData.discountAmount_promotion)).toFixed(2)
          finalPrice = `${finalMinPrice} ~ ${finalMaxPrice}`
        } else if (theData.status==='unpaid' || theData.status==='paid' || theData.status==='shipped' || theData.status==='completed') { // 售卖阶段
          theData.totalPrice = (Number(theData.preorder_finalPrice)*Number(theData.quantity)).toFixed(2)

          finalPrice = (Number(theData.preorder_finalPrice)*Number(theData.quantity) + extraOptionsTotalAmount + Number(theData.postage) - Number(theData.discountAmount_promotion)).toFixed(2)
        }
      } else if (theData.batch_type === 'stock') {  // stock
        theData.totalPrice = (Number(theData.stock_unitPrice)*Number(theData.quantity)).toFixed(2)
        finalPrice = (Number(theData.stock_unitPrice)*Number(theData.quantity) + extraOptionsTotalAmount + Number(theData.postage) - Number(theData.discountAmount_promotion)).toFixed(2)
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

    _cancelOrder({
      orderId: this.data.orderId,
      cancelOrderReason: this.data.cancelOrderReason,
    }).then(res => {
      this.setData({
        isShowCancelOrderPopup: false,
      })
      wx.showToast({
        title: '取消预订成功',
      })
      setTimeout(() => {
        this.getOrderDetailById()
      }, 1500)
    })
  },
  payOrder() { // 付款
    if (this.data.isSubmitting) {
      return;
    }

    this.data.isSubmitting = true
    _payOrder({
      orderId: this.data.orderId
    }).then(res => {
      wx.showToast({
        title: '付款成功',
      })
      setTimeout(() => {
        this.getOrderDetailById()
      }, 1500)
    })
  },
  completeOrder(e) { // 确认收货
    var that = this;

    if (this.data.isSubmitting) {
      return;
    }

    that.data.isSubmitting = true

    wx.showModal({
      title: '确认收货？',
      success(res) {
        if (res.confirm) {
          _completeOrder({ orderId: that.data.orderId }).then(res => {
            wx.showToast({
              title: '收货成功',
            })
            setTimeout(() => {
              that.getOrderDetailById()
            }, 1500)
          }).catch(error => {
            that.data.isSubmitting = false
          })
        }
        if (res.cancel) {
          that.data.isSubmitting = false
        }
      }
    });
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
  copyTrackingNumber(e) {
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