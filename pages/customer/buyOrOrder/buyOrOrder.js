// pages/customer/buyOrOrder/buyOrOrder.js
import {
  _getDefaultAddress
} from '../../../network/customer/address'

Page({
  data: {
    theData: null,

    num: 1,

    totalPrice: null,

    addressInfo: {},
    pickMethod: null,
    pickMethodArray: ['快递', '送货上门'],
    notes: '',
  },
  onLoad(options) {
    const app = getApp();
    this.setData({
      theData: app.globalData.currentGoodsDetail,
    })
    if (app.globalData.currentGoodsDetail.batch_type==='preorder') {
      this.setData({
        totalPrice: `
          ${this.data.theData.batch_minPrice} ~ ${this.data.theData.batch_maxPrice}
        `
      })
    } else {
      this.setData({
        totalPrice: app.globalData.currentGoodsDetail.batch_unitPrice
      })
    }

    wx.setNavigationBarTitle({
      title: this.data.theData.batch_type==='preorder'?'预订':'购买'
    });

    this.getDefaultAddress()
  },
  getDefaultAddress() { // 获取用户默认地址
    _getDefaultAddress({
      user: wx.getStorageSync('phone')
    }).then(res => {
      if (res.data.length > 0) {
        this.setData({
          addressInfo: res.data[0]
        })
      }
    })
  },
  numChange(e) {
    if (this.data.theData.batch_type === 'preorder') { // 预订
      this.setData({
        num: e.detail,
        totalPrice: `
          ${(e.detail * Number(this.data.theData.batch_minPrice)).toFixed(2)} ~ ${(e.detail * Number(this.data.theData.batch_maxPrice)).toFixed(2)}
        `
      })
    } else { // 现货
      this.setData({
        num: e.detail,
        totalPrice: (e.detail * Number(this.data.theData.batch_unitPrice)).toFixed(2)
      })
    }
  },
  chooseAddress() {
    wx.navigateTo({
      url: '/pages/customer/address/addressList/addressList?isChoose=true',
    })
  },
  bindPickMethodChange(e) {
    console.log(e)
    this.setData({
      pickMethod: this.data.pickMethodArray[Number(e.detail.value)]
    })
  },
  submit() {
    if (!this.data.addressInfo.id) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none'
      })
      return;
    }
    if (!this.data.pickMethod) {
      wx.showToast({
        title: '请选择收货方式',
        icon: 'none'
      })
      return;
    }

    wx.showModal({
      title: '确认提交？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定');
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    });
  },
  coverImageLoadError() {
    console.log('封面图加载失败，要在这里替换成默认图片')
  }
})