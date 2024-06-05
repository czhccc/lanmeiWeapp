// pages/customer/address/addressList/addressList.js
Page({
  data: {

  },
  onLoad(options) {

  },
  toAdd() { // 新增
    wx.navigateTo({
      url: '/pages/customer/address/addressAdd/addressAdd?flag=add',
    })
  },
  toEdit() { // 编辑
    console.log('toEdit')
    wx.navigateTo({
      url: '/pages/customer/address/addressAdd/addressAdd?flag=edit',
    })
  }
})