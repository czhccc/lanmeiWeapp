// pages/self/order/order.js
Page({
  data: {
    tabIndex: 0,
    searchParam: '',

    isShowFilter: false,
    filterOrderId: '',

    refresherTriggered: false,
    pageNo: 1,
    pageSize: 10,
    listData: [],
  },
  onLoad(options) {

  },
  _getListData() {

  },
  tabChange(e) {
    console.log(e)
    this.setData({
      tabIndex: e.detail.index
    })
  },
  searchConfirm(e) {

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

  addNew() {
    wx.navigateTo({
      url: '/pages/self/order/orderAddNew/orderAddNew',
    })
  },
  filter() {
    this.setData({ isShowFilter: true });
  },
  closeFilter() {
    this.setData({ isShowFilter: false });
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
      url: '/pages/self/order/orderDetail/orderDetail',
    })
  },
  
})