// pages/customer/seeSeller/seeSeller.js
import {
  _getAboutUs
} from '../../../network/customer/aboutUs'

Page({
  data: {
    theData: {}
  },
  onLoad(options) {
    this.getAboutUs()
  },
  getAboutUs() {
    _getAboutUs().then(res => {
      this.setData({
        theData: res.data
      })
    })
  },
  onChange(e) {
    this.setData({
      activeName: e.detail
    })
  },
  addressBtnClick(e) {
    let item = e.currentTarget.dataset.item
    wx.openLocation({
      longitude: Number(item.lon),
      latitude: Number(item.lat),
      scale: 18,
      address: item.address
    });
  },
  phoneBtnClick(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  copyContact(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.contact,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
        });
      },
      fail: function (err) {
        wx.showToast({
          title: '复制失败',
          icon: 'none',
        });
      }
    });
  }
})