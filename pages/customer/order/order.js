// pages/customer/order/order.js
import {
  _getOrderList
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
    orderNo: '',
    goodsName: '',
    status: '',
    startDate: '',
    endDate: '',
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
      user: wx.getStorageSync('phone'),
      generation_type: 'auto',
      batch_type: this.data.tabIndex===0 ? 'preorder' : 'stock',
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
          case 'paid': statusText='已付款';break;
          case 'unpaid': statusText='未付款';break;
          case 'completed': statusText='已完成';break;
          case 'canceled': statusText='已取消';break;
          case 'refunded': statusText='已退款';break;
          default: break;
        }
        let finalPrice = null
        if (item.batch_type==='preorder') {
          let minPrice = (Number(item.total_minPrice) + Number(item.postage) - Number(item.discount_amount)).toFixed(2)
          let maxPrice = (Number(item.total_maxPrice) + Number(item.postage) - Number(item.discount_amount)).toFixed(2)
          finalPrice = `${minPrice} ~ ${maxPrice}`
        } else {
          finalPrice = (Number(item.total_price) + Number(item.postage) - Number(item.discount_amount)).toFixed(2)
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
    if (e.detail.index === this.data.tabIndex) {
      return;
    } else {
      this.setData({
        tabIndex: e.detail.index
      })
      this.setData({
        pageNo: 1,
        listData: [],
        refresherTriggered: true
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
  cancelOrder() {
    wx.showModal({
      title: '确认取消预订？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定');
        } else if (res.cancel) {
          console.log('用户点击取消');
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
  seeDetail() {
    wx.navigateTo({
      url: '/pages/customer/order/orderDetail/orderDetail',
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
})