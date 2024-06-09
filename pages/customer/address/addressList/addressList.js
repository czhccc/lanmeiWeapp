// pages/customer/address/addressList/addressList.js
Page({
  data: {
    isChoose: false,
  },
  onLoad(options) {
    this.setData({
      isChoose: options.isChoose || false
    })
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
  },
  chooseItem() { // 购买或预约时选中
    if (!this.data.isChoose) {
      return;
    }

    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    prevPage.setData({
      addressInfo: {
        id: 1,
        name: '111',
        phone: '13989457856',
        detail: '22222222222222222'
      }
    });
    wx.navigateBack();
  },
})