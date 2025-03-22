// pages/customer/address/addressAdd/addressAdd.js
import {
  _addAddress,
  _editAddress,
  _deleteAddress,
  _getAll,
} from '../../../../network/customer/address'

Page({
  data: {
    flag: null,
    id: null,
    name: '',
    phone: '',
    province: '',
    provinceCode: '',
    city: '',
    cityCode: '',
    district: '',
    districtCode: '',
    detail: '',
    isDefault: false,

    isSubmitting: false,

    provinces: [],
    cities: [],
    districts: [],
    isShowPopup: false,
    popupArray: [],
    popupTitle: '',
    popupFlag: 'province',
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
        province: info.province,
        provinceCode: info.provinceCode,
        city: info.city,
        cityCode: info.cityCode,
        district: info.district,
        districtCode: info.districtCode,
        detail: info.detail,
        isDefault: info.isDefault===1 ? true: false
      })
    }

    this.getProvinces()
  },
  getProvinces() { // 获取全部省
    _getAll({ level: 'province' }).then(res => {
      this.setData({
        provinces: res.data
      })
    })
  },
  chooseProvince() {
    this.setData({
      popupFlag: 'province',
      popupArray: this.data.provinces.map(item => item.name),
      popupTitle: '选择省',
      isShowPopup: true,
    })
  },
  chooseCity() {
    let code = this.data.provinces.find(item => item.name===this.data.province).code
    _getAll({ level: 'city', code }).then(res => {
      this.setData({
        cities: res.data,
        popupFlag: 'city',
        popupArray: res.data.map(item => item.name),
        popupTitle: '选择市',
        isShowPopup: true,
      })
    })
  },
  chooseDistrict() {
    let code = this.data.cities.find(item => item.name===this.data.city).code
    _getAll({ level: 'district', code }).then(res => {
      this.setData({
        districts: res.data,
        popupFlag: 'district',
        popupArray: res.data.map(item => item.name),
        popupTitle: '选择区',
        isShowPopup: true,
      })
    })
  },
  popupCancel() {
    this.setData({
      isShowPopup: false,
    })
  },
  popupConfirm(e) {
    let flagArray = null
    switch (this.data.popupFlag) {
      case 'province':
        flagArray = this.data.provinces;
        break;
      case 'city':
        flagArray = this.data.cities;
        break;
      case 'district':
        flagArray = this.data.districts;
        break;
      default: break;
    }
    this.setData({
      [this.data.popupFlag]: e.detail.value,
      [`${this.data.popupFlag}Code`]: flagArray.find(item => item.name===e.detail.value).code,
      isShowPopup: false,
    })
  },
  defaultChange(e) { // 默认地址
    this.setData({
      isDefault: e.detail.value
    })
  },
  toDelete() {
    if (this.data.isSubmitting) {
      return;
    }
    var that = this;
    wx.showModal({
      title: '确认删除？',
      success(res) {
        if (res.confirm) {
          that.data.isSubmitting = true
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
            that.data.isSubmitting = false
          })
        }
      }
    });
  },
  toSave() {
    if (this.data.isSubmitting) {
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
    if (!this.data.provinceCode) {
      wx.showToast({
        title: '请选择省',
        icon: 'none'
      })
      return;
    }
    if (!this.data.cityCode) {
      wx.showToast({
        title: '请选择市',
        icon: 'none'
      })
      return;
    }
    if (!this.data.districtCode) {
      wx.showToast({
        title: '请选择区',
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
          that.data.isSubmitting = true
          if (that.data.flag === 'add') { // 新增
            _addAddress({
              name: that.data.name, 
              phone: that.data.phone, 
              create_by: wx.getStorageSync('phone'), 
              provinceCode: that.data.provinceCode, 
              cityCode: that.data.cityCode, 
              districtCode: that.data.districtCode, 
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
              that.data.isSubmitting = false
            })
          } else { // 编辑
            _editAddress({
              id: that.data.id,
              name: that.data.name, 
              phone: that.data.phone, 
              provinceCode: that.data.provinceCode, 
              cityCode: that.data.cityCode, 
              districtCode: that.data.districtCode, 
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
              that.data.isSubmitting = false
            })
          }
        } else if (res.cancel) {
          that.data.isSubmitting = false
        }
      }
    });
  }
})