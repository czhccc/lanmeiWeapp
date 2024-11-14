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
      
    })
  },
  tabChange(e) {
    console.log(e)
    this.setData({
      tabIndex: e.detail.index
    })
  },

  bindrefresherrefresh() {
    console.log('下拉刷新')
    this.setData({
      pageNo: 1,
      listData: [],
      refresherTriggered: true
    })
    this._getListData()
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