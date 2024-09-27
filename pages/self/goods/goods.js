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
    statusArr: [  // 当前状态
      {value: 'USA', name: '预订中'},
      {value: 'BRA', name: '采购中'},
      {value: 'ENG', name: '销售中'},
      {value: 'FRA', name: '已完结'},
    ],
    details: '', // 产品详情
    editorCtx: null,
    imgList: [],
    
  },
  onLoad(options) {

  },
  onEditorReady() {
    wx.createSelectorQuery().select('#details').context(res => {
      console.log('??', res)
      this.data.editorCtx = res.context;
      this.getData();
    }).exec();
  },
  getData() {
    // wx.request({
    //   url: 'https://your-server-url/api/getRichText', // 替换为你的接口地址
    //   method: 'GET',
    //   success: (res) => {
    //     if (res.statusCode === 200) {
          
    //     }
    //   },
    // });

    let details = '<p>111111</p>'
    this.data.editorCtx.setContents({
      html: details
    });
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
      status: e.detail.value
    })
  },
  delete() {
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
  submit() {
    let that = this;
    wx.showModal({
      title: '确认保存？',
      success(res) {
        if (res.confirm) {
          let details = ''
          that.data.editorCtx.getContents({
            success(res) {
              console.log(res.html)
              details = res.html
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    });
  }
})