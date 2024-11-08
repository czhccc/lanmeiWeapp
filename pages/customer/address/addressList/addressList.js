// pages/customer/address/addressList/addressList.js
import {
  _getAddressList,
} from '../../../../network/customer/address'

Page({
  data: {
    isChoose: false,
    list: [],
  },
  onLoad(options) {
    this.setData({
      isChoose: options.isChoose || false
    })
  },
  onShow() {
    this.getAddressList()
  },
  getAddressList() {
    _getAddressList({
      user: wx.getStorageSync('phone')
    }).then(res => {
      this.setData({
        list: res.data
      })
    })
  },
  toAdd() { // 新增
    wx.navigateTo({
      url: '/pages/customer/address/addressAdd/addressAdd?flag=add',
    })
  },
  toEdit(e) { // 编辑
    console.log('toEdit', e)
    let info = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/customer/address/addressAdd/addressAdd?flag=edit&info=${JSON.stringify(info)}`,
    })
  },
  chooseItem(e) { // 购买或预订时选中
    let address = e.currentTarget.dataset.item
    if (!this.data.isChoose) {
      return;
    }

    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    if (prevPage.data.addressInfo) {
      prevPage.setData({
        addressInfo: address
      });
      wx.navigateBack();
    }
  },
})