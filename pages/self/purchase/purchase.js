// pages/self/purchase/purchase.js
Page({
  data: {
    date: '', // 采购时间
    batch: '', // 批次
    name: '', // 产品名
    resource: '', // 来源
    num: 0, // 数量
    unit: '', // 单位
    goodsCosts: 0, // 货物成本
    otherCosts: 0, // 其他总成本
    otherCostsDetail: '', // 其他成本详情
    remarks: '', // 备注
  },
  onLoad(options) {
    this.init()
  },
  init() {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    this.setData({
      batch: `${year}${month}${day}${hours}${minutes}${seconds}`
    })
  },
  chooseDate(e) {
    console.log(e)
    let date = e.detail.value // 2024-06-13
    let dateString = date.split('-')[0]+date.split('-')[1]+date.split('-')[2]
    console.log(dateString)
    this.setData({
      date
    })
  }
})