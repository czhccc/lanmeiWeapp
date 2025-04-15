// pages/customer/buyOrOrder/buyOrOrder.js
import {
  _createOrder,
  _generateOrderInfo,
} from '../../../network/customer/order'
import {
  _getDefaultAddress
} from '../../../network/customer/address'
import {
  _getIdempotencyKey
} from '../../../network/customer/utils'

import {
  debounce
} from '../../../utils/utils.js'

Page({
  data: {
    theData: null,

    quantity: 1,

    defaultAddressNotAvailable: true,
    provinces: [],
    addressInfo: {},
    isHomeDelivery: false,

    notes: '',

    extraOptions: [],

    isSubmitting: false,

    calculatedOrderInfo: {},
  },
  onLoad(options) {
    const app = getApp();

    let theData = app.globalData.currentGoodsDetail
    console.log(theData)
    let provinces = theData.batch_shipProvinces&&theData.batch_shipProvinces.length>0 
                      ? theData.batch_shipProvinces.map(item => item.name) 
                      : []
    let extraOptions = theData.batch_extraOptions&&theData.batch_extraOptions.length>0 
                        ? theData.batch_extraOptions.map(item => {
                                                  return { ...item, isChoosed: false, }
                                                }) 
                        : []

    this.setData({
      theData,
      quantity: theData.batch_minQuantity,
      provinces,
      extraOptions,
    })

    wx.setNavigationBarTitle({
      title: this.data.theData.batch_type==='preorder'?'预订':'购买'
    });

    this.getDefaultAddress()
  },
  getDefaultAddress() { // 获取用户默认地址
    _getDefaultAddress({
      create_by: wx.getStorageSync('phone')
    }).then(res => {
      if (res.data.length > 0) {
        let addressInfo = res.data[0]
        if (this.data.provinces.includes(addressInfo.province)) { // 默认地址符合可邮寄省份
          this.setData({
            addressInfo
          })
        } else {
          this.setData({
            defaultAddressNotAvailable: true
          })
        }
        
      }

      this.generateOrderInfo()
    })
  },
  quantityChange(e) {
    this.setData({
      quantity: e.detail
    })

    this.debounceGenerateOrderInfo()
  },
  chooseAddress() {
    wx.navigateTo({
      url: `/pages/customer/address/addressList/addressList?isChoose=true&availableProvinces=${this.data.provinces}`,
    })
  },
  async submit() {
    if (this.data.isSubmitting) {
      return;
    }

    let that = this
    if (this.data.quantity < this.data.theData.batch_minQuantity) {
      wx.showToast({
        title: `最少${this.data.theData.batch_type==='preorder'?'预订':'购买'}${this.data.theData.batch_minQuantity}${this.data.theData.goods_unit}`,
        icon: 'none'
      })
      return;
    }
    if (!this.data.addressInfo.id) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none'
      })
      return;
    }

    this.data.isSubmitting = true

    let idempotencyKey;
    try {
      let getIdempotencyKeyResult = await _getIdempotencyKey({
        keyParams: {
          goodsId: this.data.theData.id,
          quantity: this.data.quantity,
          addressId: this.data.id
        },
        keyPrefix: 'order'
      });
      idempotencyKey = getIdempotencyKeyResult.data.idempotencyKey
    } catch (error) {
      this.data.isSubmitting = false
      return false;
    }
    
    wx.showModal({
      title: `${this.data.theData.batch_type==='preorder' ? '确定预订' : '提交订单'}`,
      success(res) {
        if (res.confirm) {
          let params = {
            idempotencyKey,
            goods_id: that.data.theData.id,
            quantity: that.data.quantity,
            receive_isHomeDelivery: that.data.addressInfo.district==='嵊州市' ? (that.data.isHomeDelivery ? 1 : 0) : 0,
            receive_name: that.data.addressInfo.name,
            receive_phone: that.data.addressInfo.phone,
            receive_provinceCode: that.data.addressInfo.provinceCode,
            receive_cityCode: that.data.addressInfo.cityCode,
            receive_districtCode: that.data.addressInfo.districtCode,
            receive_address: that.data.addressInfo.detail,
            remark_customer: that.data.notes,
            extraOptionsIds: that.data.extraOptions.filter(item => item.isChoosed).map(item => item.id)
          }
          if (that.data.theData.batch_type === 'preorder') { // 预订
            _createOrder(params).then(res => {
              wx.showToast({
                title: '预订成功',
              })
              setTimeout(() => {
                wx.navigateBack({
                  delta: 2  // 返回上上页
                });
              }, 1500)
            }).catch(error => {
              that.data.isSubmitting = false
            })
          } else { // 现货
            params.total_price = that.data.totalPrice
            _createOrder(params).then(res => {
              wx.showToast({
                title: '下单成功',
              })
              setTimeout(() => {
                wx.switchTab({
                  url: '/pages/customer/goodsList/goodsList',
                })
              }, 1500)
              // 跳转到支付页
            }).catch(error => {
              that.data.isSubmitting = false
            })
          }
        }
        if (res.cancel) {
          that.data.isSubmitting = false
        }
      }
    });
  },
  isHomeDeliveryChange(e) { // 送货上门
    this.setData({
      isHomeDelivery: e.detail
    })
  },
  debounceGenerateOrderInfo: debounce(function() {
    this.generateOrderInfo();
  }, 300),
  generateOrderInfo() {
    _generateOrderInfo({
      goodsId: this.data.theData.id,
      quantity: this.data.quantity,
      provinceCode: this.data.addressInfo&&this.data.addressInfo.provinceCode,
      extraOptionsIds: this.data.extraOptions.filter(item => item.isChoosed).map(item => item.id)
    }).then(res => {
      this.setData({
        calculatedOrderInfo: res.data
      })
    }).catch(err => {
      let unknownError = false
      let message = ''
      switch (err.message) {
        case '商品已下架':
          message = '商品已下架'
          break;
        default:
          message = `十分抱歉😢，存在未知错误，请联系管理员`
          unknownError = true
          break;
      }
      wx.showToast({
        title: message,
        icon: 'none',
        duration: 2000
      })

      if (unknownError) {
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/customer/seeSeller/seeSeller',
          })
        }, 2000)
      } else {
        setTimeout(() => {
          wx.navigateBack()
        }, 2000)
      }
    })
  },
  chooseAddressCallback() {
    this.generateOrderInfo()
  },
  coverImageLoadError() {
    console.log('封面图加载失败，要在这里替换成默认图片')
  },
  extraOptionChange(e) {
    let id = e.currentTarget.dataset.id
    let changedItem = this.data.extraOptions.find(item => item.id===id)
    changedItem.isChoosed = !changedItem.isChoosed
    this.setData({
      extraOptions: this.data.extraOptions
    })

    this.debounceGenerateOrderInfo()
  }
})