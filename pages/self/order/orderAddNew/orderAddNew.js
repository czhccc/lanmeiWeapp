// pages/self/order/orderAddNew/orderAddNew.js
Page({
  data: {
    typeArr: [  // 当前状态
      {value: 'USA', name: '购买'},
      {value: 'BRA', name: '预订'},
    ],
    type: '', // 订单类型

    region: '', // 省市区
  },
  onLoad(options) {

  },

  bindRegionChange(e) { // 选择省市区
    let regions = e.detail.value
    console.log(regions)
    this.setData({
      region: `${regions[0]}${regions[1]}${regions[2]}`
    })
  },
})