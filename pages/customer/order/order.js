// pages/customer/order/order.js
import dayjs from 'dayjs'

import {
  _getOrderList,
  _cancelOrder,
  _getOrderDetailById,
  _payOrder,
  _completeOrder,
} from '../../../network/customer/order'

Page({
  data: {
    tabIndex: 0,
    isShowFilter: false,
    filterOrderId: '',

    refresherTriggered: false,
    pageNo: 1,
    pageSize: 10,
    listData: [],

    // 筛选项
    status: '',
    orderNo: '',
    goodsName: '',
    startDate: '',
    endDate: '',

    dateRangeStart: dayjs().subtract(1, 'year').startOf('year').format('YYYY-MM-DD'),
    dateRangeEnd: dayjs().format('YYYY-MM-DD'),

    // 取消预订
    isShowCancelOrderPopup: false,
    cancelOrderReason: '',

    currentOrderId: null, // 正在操作的订单的id
    isSubmitting: false,
  },
  onLoad(options) {
    this.getOrderList()
  },
  bindrefresherrefresh() { // 下拉刷新
    this.setData({
      pageNo: 1,
      listData: [],
      refresherTriggered: true
    })
    this.getOrderList()
  },
  onScrollToLower() { // 触底
    this.getOrderList()
  },
  getOrderList() {
    _getOrderList({
      pageNo: this.data.pageNo,
      pageSize: this.data.pageSize,
      create_by: wx.getStorageSync('phone'),
      order_no: this.data.orderNo,
      snapshot_goodsName: this.data.goodsName,
      status: this.data.status,
      startTime: this.data.startDate ? `${this.data.startDate} 00:00:00` : '',
      endTime: this.data.endDate ? `${this.data.endDate} 23:59:59` : '',
    }).then(res => {
      let listData = res.data.records.map(item => {
        let statusText = ''
        switch (item.status) {
          case 'reserved': statusText='已预订';break;
          case 'canceled': statusText='已取消';break;
          case 'unpaid': statusText='未付款';break;
          case 'paid': statusText='已付款';break;
          case 'shipped': statusText='已发货';break;
          case 'completed': statusText='已完结';break;
          case 'refunded': statusText='已退款';break;
          default: break;
        }
        let finalPrice = null
        if (item.batch_type==='preorder') {
          if (item.status==='reserved' || item.status==='canceled') { // 预订阶段
            let finalMinPrice = (Number(item.preorder_minPrice)*Number(item.quantity) + Number(item.postage) - Number(item.discountAmount_promotion)).toFixed(2)
            let finalMaxPrice = (Number(item.preorder_maxPrice)*Number(item.quantity) + Number(item.postage) - Number(item.discountAmount_promotion)).toFixed(2)
            finalPrice = `${finalMinPrice} ~ ${finalMaxPrice}`
          } else if (item.status==='unpaid') { // 售卖阶段
            finalPrice = (Number(item.preorder_finalPrice)*Number(item.quantity) + Number(item.postage) - Number(item.discountAmount_promotion)).toFixed(2)
          }
        } else {
          finalPrice = (Number(item.stock_unitPrice)*Number(item.quantity) + Number(item.postage) - Number(item.discountAmount_promotion)).toFixed(2)
        }
        return {
          ...item,
          statusText,
          finalPrice,
        }
      })
      this.setData({
        listData: [...this.data.listData, ...listData]
      })
      if (res.data.records.length > 0) {
        this.setData({
          pageNo: this.data.pageNo + 1
        })
      }
      if (this.data.refresherTriggered) {
        this.setData({
          refresherTriggered: false
        })
      }
      if (this.data.isShowFilter) {
        this.setData({
          isShowFilter: false
        })
      }
    })
  },
  tabChange(e) {
    console.log(e)
    if (e.detail.index === this.data.tabIndex) {
      return;
    } else {
      let status = ''
      switch (e.detail.index) {
        case 0: status='';break;
        case 1: status='reserved';break;
        case 2: status='paid';break;
        case 3: status='completed';break;
        default: break;
      }
      this.setData({
        tabIndex: e.detail.index,
        pageNo: 1,
        listData: [],
        orderNo: '',
        goodsName: '',
        startDate: '',
        endDate: '',
        status,
      })
      this.getOrderList()
    }
  },
  filter() {
    this.setData({ isShowFilter: true });
  },
  closeFilter() {
    this.setData({ isShowFilter: false });
  },

  // 取消预订
  closeCancelOrderPopup() {
    this.setData({
      isShowCancelOrderPopup: false,
    })
  },
  cancelOrderPopupConfirm() {
    this.data.isSubmitting = true

    _cancelOrder({
      orderId: this.data.currentOrderId,
      cancelOrderReason: this.data.cancelOrderReason,
    }).then(res => {
      this.setData({
        isShowCancelOrderPopup: false,
      })
      wx.showToast({
        title: '取消预订成功',
      })
      setTimeout(() => {
        this.replaceOrderItem()
      }, 1500)
    }).catch(error => {
      this.data.isSubmitting = false
    })
  },
  cancelOrder(e) {
    this.data.currentOrderId = e.currentTarget.dataset.orderid

    if (this.data.isSubmitting) {
      return;
    }
    this.setData({
      isShowCancelOrderPopup: true,
      cancelOrderReason: '',
    })
  },
  payOrder(e) { // 付款
    this.data.currentOrderId = e.currentTarget.dataset.orderid

    _payOrder({ orderId: this.data.currentOrderId }).then(res => {
      wx.showToast({
        title: '付款成功',
      })
      setTimeout(() => {
        this.replaceOrderItem()
      }, 1500)
    }).catch(error => {
      this.data.isSubmitting = false
    })
  },
  completeOrder(e) { // 确认收货
    var that = this;

    if (this.data.isSubmitting) {
      return;
    }

    this.data.currentOrderId = e.currentTarget.dataset.orderid

    that.data.isSubmitting = true

    wx.showModal({
      title: '确认收货？',
      success(res) {
        if (res.confirm) {
          _completeOrder({ orderId: that.data.currentOrderId }).then(res => {
            wx.showToast({
              title: '收货成功',
            })
            setTimeout(() => {
              that.replaceOrderItem()
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
  refund() {
    wx.showModal({
      title: '确认退款？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定');
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    });
  },
  seeDetail(e) {
    wx.navigateTo({
      url: `/pages/customer/order/orderDetail/orderDetail?id=${e.currentTarget.dataset.orderid}`,
    })
  },
  filterStatusClick(e) {
    let status = e.currentTarget.dataset.flag
    this.setData({
      status
    })
  },
  startDateChange(e) {
    this.setData({
      startDate: e.detail.value
    })
  },
  endDateChange(e) {
    this.setData({
      endDate: e.detail.value
    })
  },
  filterReset() {
    this.setData({
      orderNo: '',
      goodsName: '',
      status: '',
      startDate: '',
      endDate: '',
    })
  },
  filterConfirm() {
    this.setData({
      listData: [],
      pageNo: 1
    })
    this.getOrderList()
  },
  copyOrderId(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function () {
        wx.showToast({
          title: '复制成功',
          icon: 'success'
        });
      },
    });
  },
  replaceOrderItem() { // 操作列表项后替换被操作的那一项
    _getOrderDetailById({id: this.data.currentOrderId}).then(res => {
      let theData = res.data
      let statusText = ''
      switch (theData.status) {
        case 'reserved': statusText='已预订';break;
        case 'paid': statusText='已付款';break;
        case 'unpaid': statusText='未付款';break;
        case 'completed': statusText='已完结';break;
        case 'canceled': statusText='已取消';break;
        case 'refunded': statusText='已退款';break;
        default: break;
      }
      theData.statusText = statusText

      let finalPrice = null
      if (theData.batch_type==='preorder') {
        if (!theData.preorder_finalPrice) { // 预订阶段
          let finalMinPrice = (Number(theData.preorder_minPrice)*Number(theData.quantity) + Number(theData.postage) - Number(theData.discountAmount_promotion)).toFixed(2)
          let finalMaxPrice = (Number(theData.preorder_maxPrice)*Number(theData.quantity) + Number(theData.postage) - Number(theData.discountAmount_promotion)).toFixed(2)
          finalPrice = `${finalMinPrice} ~ ${finalMaxPrice}`
        } else { // 售卖阶段
          finalPrice = (Number(theData.preorder_finalPrice)*Number(theData.quantity) + Number(theData.postage) - Number(theData.discountAmount_promotion)).toFixed(2)
        }
      } else {
        finalPrice = (Number(theData.stock_unitPrice)*Number(theData.quantity) + Number(theData.postage) - Number(theData.discountAmount_promotion)).toFixed(2)
      }
      theData.finalPrice = finalPrice

      let index = this.data.listData.findIndex(item => item.id===this.data.currentOrderId)
      this.data.listData[index] = theData

      this.setData({
        listData: this.data.listData,
        isSubmitting: false,
      })
    })
  }
})