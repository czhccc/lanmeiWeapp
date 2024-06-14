// pages/self/purchaseList/purchaseList.js
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

  },
  _getListData() {

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

  addNew() {
    wx.navigateTo({
      url: '/pages/self/purchase/purchase',
    })
  },
  filter() {
    this.setData({ isShowFilter: true });
  },
  closeFilter() {
    this.setData({ isShowFilter: false });
  },

  itemClick() {
    wx.navigateTo({
      url: '/pages/self/purchase/purchase',
    })
  },
  
})