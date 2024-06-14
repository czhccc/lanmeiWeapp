// pages/self/goods/goods.js
Page({
  data: {
    goodsId: '', // 产品编号
    name: '', // 产品名称
    totalNum: 0, // 总数量
    unit: '', // 单位
    remainsNum: 0, // 剩余数量
    unitPrice: 0, // 单价
    canMail: true, // 是否可以邮寄
    isSale: true, // 是否上架
    status: '', // 当前状态
    statusArr: ['预订中', '采购中', '销售中', '已完结'], // 当前状态
  },
  onLoad(options) {

  },
  canMailChange(e) { // 是否可以邮寄
    this.setData({
      canMail: e.detail.value
    })
  },
  isSaleChange(e) { // 是否上架
    this.setData({
      isSale: e.detail.value
    })
  },
  statusChange(e) { // 当前状态
    console.log(e)
    this.setData({
      status: this.data.statusArr[`${Number(e.detail.value)}`]
    })
  }
})