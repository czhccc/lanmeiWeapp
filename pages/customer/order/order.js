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
  },
  onLoad(options) {
    this.getOrderList()
  },
  getOrderList() {
    _getOrderList({
      pageNo: 1,
      pageSize: 10,
      user: wx.getStorageSync('phone'),
      batch_type: this.data.tabIndex===0 ? 'preorder' : 'stock'
    }).then(res => {
      let listData = res.data.records.map(item => {
        let statusText = ''
        switch (item.status) {
          case 'reserved': statusText='已预订';break;
          case 'paid': statusText='已付款';break;
          case 'unpaid': statusText='未付款';break;
          case 'completed': statusText='已完成';break;
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

  bindrefresherrefresh() {
    this.setData({
      pageNo: 1,
      listData: [],
      refresherTriggered: true
    })
    this.getOrderList()
  },
  onScrollToLower() {
    console.log('触底')
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
  }
})