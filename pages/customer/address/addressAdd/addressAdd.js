// pages/customer/address/addressAdd/addressAdd.js
Page({
  data: {
    name: '',
    phone: '',
    region: '',
    detailAddress: '',
    isDefault: false
  },
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: options.flag === 'add' ? '新增收获地址' : '编辑收货地址'
    });
  },
  bindRegionChange(e) { // 选择省市区
    let regions = e.detail.value
    console.log(regions)
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
    wx.showModal({
      title: '确认删除？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定');
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    });
  },
  toSave() {
    console.log('保存')
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
    if (!this.data.detailAddress) {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none'
      })
      return;
    }

  }
})