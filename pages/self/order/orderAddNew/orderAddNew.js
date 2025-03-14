// pages/self/order/orderAddNew/orderAddNew.js
Page({
  data: {
    quantity: 1,
    typeArr: [  // 当前状态
      {value: 'USA', label: '购买'},
      {value: 'BRA', label: '预订'},
    ],
    type: '', // 订单类型
    status: '', // 当前状态
    statusArr: [  // 当前状态
      {value: 'USA', label: '预订中'},
      {value: 'BRA', label: '采购中'},
      {value: 'ENG', label: '销售中'},
      {value: 'FRA', label: '已完结'},
    ],

    name: '',
    phone: '',
    region: '', // 省市区
    addressDetail: '', // 详细地址

    pickMethod: null,
    pickMethodArr: [
      {value: 'kd', label: '快递'},
      {value: 'shsm', label: '送货上门'},
    ],
  },
  onLoad(options) {

  },
  quantityChnage(e) {
    this.setData({
      quantity: e.detail
    })
  },
  bindRegionChange(e) { // 选择省市区
    let regions = e.detail.value
    console.log(regions)
    this.setData({
      region: `${regions[0]}${regions[1]}${regions[2]}`
    })
  },
  pickMethodChange(e) {
    this.setData({
      pickMethod: this.data.pickMethodArray[Number(e.detail.value)]
    })
  }
})