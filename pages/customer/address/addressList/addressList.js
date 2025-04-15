// pages/customer/address/addressList/addressList.js
import {
  _getAddressList,
} from '../../../../network/customer/address'

Page({
  data: {
    quantityLimited: false, // 数量上限
    isChoose: false,
    list: [],

    availableProvinces: [],
    availableProvincesString: '',
  },
  onLoad(options) {
    if (options.isChoose) {
      this.setData({
        isChoose: options.isChoose,
        availableProvinces: options.availableProvinces.split(','),
        availableProvincesString: options.availableProvinces.replaceAll(',', '、'),
      })
    }
  },
  onShow() {
    this.getAddressList()
  },
  getAddressList() {
    _getAddressList({
      create_by: wx.getStorageSync('phone')
    }).then(res => {
      if (res.data.length >= 10) {
        this.setData({ quantityLimited: true })
      }

      if (this.data.isChoose) {
        let list = res.data.map(item => {
          if (this.data.availableProvinces.includes(item.province)) { // 符合条件
            return {
              ...item,
              unavailable: false,
            }
          } else {
            return {
              ...item,
              unavailable: true,
            }
          }
        }).sort((a, b) => a.unavailable - b.unavailable);
        this.setData({
          list
        })
      } else {
        this.setData({
          list: res.data
        })
      }
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
    if (address.unavailable) {
      wx.showToast({
        title: '该地址不可用于当前商品',
        icon: 'none'
      })
      return;
    }

    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    if (prevPage.data.addressInfo) {
      prevPage.setData({
        addressInfo: address
      });
      if (prevPage.chooseAddressCallback) {
        prevPage.chooseAddressCallback()
      }
      wx.navigateBack();
    }
  },
})