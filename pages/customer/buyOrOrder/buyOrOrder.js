// pages/customer/buyOrOrder/buyOrOrder.js
import {
  _createOrder,
} from '../../../network/customer/order'
import {
  _getDefaultAddress
} from '../../../network/customer/address'

Page({
  data: {
    theData: null,

    num: 1,

    provinces: [],
    addressInfo: {},
    defaultAddressNotAvailable: true,

    pickMethod: null,
    pickMethodArray: ['快递', '送货上门'],
    postage: '0.00',
    notes: '',

    totalMinPrice: '0.00',
    totalMaxPrice: '0.00',
    totalPrice: null,
    discountAmount: '0.00',
    finalPrice: '0.00',

    isSubmiting: false,
  },
  onLoad(options) {
    const app = getApp();
    this.setData({
      theData: app.globalData.currentGoodsDetail,
      provinces: app.globalData.currentGoodsDetail.batch_shipProvinces.map(item => item.name)
    })
    if (app.globalData.currentGoodsDetail.batch_type==='preorder') {
      this.setData({
        totalMinPrice: this.data.theData.batch_minPrice,
        totalMaxPrice: this.data.theData.batch_maxPrice,
      })
    } else {
      this.setData({
        totalPrice: app.globalData.currentGoodsDetail.batch_unitPrice
      })
    }
    this.calculateFinalPrice()

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
    })
  },
  numChange(e) {
    let num = e.detail
    if (this.data.theData.batch_type === 'preorder') { // 预订
      this.setData({
        num,
        totalMinPrice: (num * Number(this.data.theData.batch_minPrice)).toFixed(2),
        totalMaxPrice: (num * Number(this.data.theData.batch_maxPrice)).toFixed(2),
      })
    } else { // 现货
      this.setData({
        num,
        totalPrice: (num * Number(this.data.theData.batch_unitPrice)).toFixed(2)
      })
    }

    // 计算优惠
    let discountAmount = 0;
    this.data.theData.batch_discounts.forEach(item => {
      if (num >= item.quantity) {
        discountAmount = Math.max(discountAmount, item.discount);
      }
    })

    // 计算邮费
    this.calculatePostage()
    
    this.setData({
      discountAmount: discountAmount.toFixed(2)
    })

    this.calculateFinalPrice()
  },
  chooseAddress() {
    wx.navigateTo({
      url: `/pages/customer/address/addressList/addressList?isChoose=true&availableProvinces=${this.data.provinces}`,
    })
  },
  bindPickMethodChange(e) {
    this.setData({
      pickMethod: this.data.pickMethodArray[Number(e.detail.value)],
      postage: '10.00'
    })
    this.calculateFinalPrice()
  },
  calculatePostage() {
    if(!this.data.addressInfo.province) {
      return;
    }
    let postageRule = this.data.theData.batch_shipProvinces.find(item => item.name === this.data.addressInfo.province)

    if (postageRule.freeShippingNum&&this.data.num>=postageRule.freeShippingNum) { // 达到包邮条件
      this.setData({
        postage: '0.00'
      })
    } else {
      if (this.data.num <= postageRule.baseNum) { // 首重之内
        this.setData({
          postage: String(postageRule.basePostage.toFixed(2))
        })
      }
      if ((this.data.num>postageRule.baseNum)&&(this.data.num<postageRule.freeShippingNum)) { // 大于首重
        let excess = this.data.num - postageRule.baseNum; // 超出首重的数量
        let extraChargeUnits = Math.ceil(excess / postageRule.extraNum); // 向上取整计算需要支付的超额邮费次数
        this.setData({
          postage: String((postageRule.basePostage + extraChargeUnits * postageRule.extraPostage).toFixed(2))
        })
      }
    }
  },
  calculateFinalPrice() {
    let finalPrice = 0
    if (this.data.theData.batch_type==='preorder'){
      finalPrice = `${(Number(this.data.totalMinPrice)+Number(this.data.postage)-Number(this.data.discountAmount)).toFixed(2)} ~ ${(Number(this.data.totalMaxPrice)+Number(this.data.postage)-Number(this.data.discountAmount)).toFixed(2)}`
      this.setData({
        finalPrice
      })
    } else {
      finalPrice = Number(this.data.totalPrice) + Number(this.data.postage) - Number(this.data.discountAmount)
      this.setData({
        finalPrice: finalPrice.toFixed(2)
      })
    }
  },
  submit() {
    if (this.data.isSubmiting) {
      return;
    }
    this.data.isSubmiting = true

    let that = this
    if (!this.data.addressInfo.id) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none'
      })
      return;
    }
    if (addressInfo.district==='嵊州市' && !this.data.pickMethod) {
      wx.showToast({
        title: '请选择收货方式',
        icon: 'none'
      })
      return;
    }

    wx.showModal({
      title: `${this.data.theData.batch_type==='preorder' ? '确定预订' : '提交订单'}`,
      success(res) {
        if (res.confirm) {
          let params = {
            generation_type: 'auto',
            goods_id: that.data.theData.id,
            batch_no: that.data.theData.batch_no,
            batch_type: that.data.theData.batch_type,
            num: that.data.num,
            receive_method: that.data.pickMethod==='快递' ? 'ship' : 'delivery',
            receive_name: that.data.addressInfo.name,
            receive_phone: that.data.addressInfo.phone,
            receive_region: that.data.addressInfo.region,
            receive_address: that.data.addressInfo.detail,
            remark_customer: that.data.notes,
            discount_amount: that.data.discountAmount,
            postage: Number(that.data.postage),
            snapshot_coverImage: that.data.theData.goods_coverImage,
            snapshot_goodsName: that.data.theData.goods_name,
            snapshot_goodsUnit: that.data.theData.goods_unit,
            snapshot_goodsRemark: that.data.theData.goods_remark,
            snapshot_goodsRichText: that.data.theData.goods_richText,
            snapshot_discounts: JSON.stringify(that.data.theData.batch_discounts),
          }
          if (that.data.theData.batch_type === 'preorder') { // 预订
            params.total_minPrice = that.data.totalMinPrice
            params.total_maxPrice = that.data.totalMaxPrice
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
              wx.showToast({
                title: error.message,
                icon: 'error'
              })
            })
          } else { // 现货
            params.total_price = that.data.totalPrice
            _createOrder(params).then(res => {
              wx.showToast({
                title: '下单成功',
              })
              // 跳转到支付页
            }).catch(error => {
              wx.showToast({
                title: error.message,
                icon: 'error'
              })
            })
          }
        }
        if (res.cancel) {
          that.data.isSubmiting = false
        }
      }
    });
  },
  coverImageLoadError() {
    console.log('封面图加载失败，要在这里替换成默认图片')
  }
})