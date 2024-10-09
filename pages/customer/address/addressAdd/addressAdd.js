// pages/customer/address/addressAdd/addressAdd.js
import {
  _addAddress,
  _editAddress,
  _deleteAddress,
} from '../../../../network/customer/address'

Page({
  data: {
    flag: null,
    id: null,
    name: '',
    phone: '',
    region: '',
    detail: '',
    isDefault: false,

    isSubmiting: false,
  },
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: options.flag === 'add' ? '新增收获地址' : '编辑收货地址'
    });
    this.setData({
      flag: options.flag
    })
    
    if (options.info) {
      let info = JSON.parse(options.info)
      this.setData({
        id: info.id,
        name: info.name,
        phone: info.phone,
        region: info.region,
        detail: info.detail,
        isDefault: info.isDefault===1 ? true: false
      })
    }
  },
  bindRegionChange(e) { // 选择省市区
    let regions = e.detail.value
    this.setData({
      region: `${regions[0]}${regions[1]}${regions[2]}`
    })
  },
  defaultChange(e) { // 默认地址
    this.setData({
      isDefault: e.detail.value
    })
  },
  toDelete() {
    var that = this;
    wx.showModal({
      title: '确认删除？',
      success(res) {
        if (res.confirm) {
          that.data.isSubmiting = true
          _deleteAddress({
            id: that.data.id
          }).then(res => {
            wx.showToast({
              title: res.message,
              icon: 'none'
            })

            setTimeout(() => {
              wx.navigateBack()
            }, 1500)
          }).finally(() => {
            that.data.isSubmiting = false
          })
        }
      }
    });
  },
  toSave() {
    if (this.data.isSubmiting) {
      return;
    }

    if (!this.data.name) {
      wx.showToast({
        title: '请输入收货人姓名',
        icon: 'none'
      })
      return;
    }
    if (!this.data.phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return;
    }

    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(this.data.phone)) {
      wx.showToast({
        title: '手机号格式有误',
        icon: 'none'
      })
      return;
    }
    if (!this.data.region) {
      wx.showToast({
        title: '请选择省市区',
        icon: 'none'
      })
      return;
    }
    if (!this.data.name) {
      wx.showToast({
        title: '请输入收货人姓名',
        icon: 'none'
      })
      return;
    }
    if (!this.data.detail) {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none'
      })
      return;
    }

    var that = this;
    wx.showModal({
      title: '确认提交？',
      success(res) {
        if (res.confirm) {
          that.data.isSubmiting = true
          if (that.data.flag === 'add') { // 新增
            _addAddress({
              name: that.data.name, 
              phone: that.data.phone, 
              user: wx.getStorageSync('phone'), 
              region: that.data.region, 
              detail: that.data.detail, 
              isDefault: that.data.isDefault,
            }).then(res => {
              wx.showToast({
                title: res.message,
                icon: 'none'
              })

              setTimeout(() => {
                wx.navigateBack()
              }, 1500)
            }).finally(() => {
              that.data.isSubmiting = false
            })
          } else { // 编辑
            _editAddress({
              id: that.data.id,
              name: that.data.name, 
              phone: that.data.phone, 
              user: wx.getStorageSync('phone'), 
              region: that.data.region, 
              detail: that.data.detail, 
              isDefault: that.data.isDefault,
            }).then(res => {
              wx.showToast({
                title: res.message,
                icon: 'none'
              })

              setTimeout(() => {
                wx.navigateBack()
              }, 1500)
            }).finally(() => {
              that.data.isSubmiting = false
            })
          }
        }
      }
    });
  }
})