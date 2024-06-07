// pages/customer/comment/comment.js
Page({
  data: {
    activeName: ['1', '2'],
    comment: '',
    fileList: [],
  },
  onLoad(options) {

  },
  onReady() {

  },
  onChange(e) {
    console.log(e)
    if (this.data.activeName !== e.detail) {
      this.setData({
        activeName: e.detail,
      });
    }
  },
  afterRead(event) {
    console.log(event)
    const { file } = event.detail;
    const { fileList = [] } = this.data;
    if (Array.isArray(file)) { // 多选
      let theFileList = file.map(item => {
        return {
          ...item,
          url: item.tempFilePath
        }
      })
      this.setData({
        fileList: [...fileList, ...theFileList]
      })
    } else {
      fileList.push({ ...file, url: file.tempFilePath });
      this.setData({ fileList });
    }

    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    // wx.uploadFile({
    //   url: 'https://example.weixin.qq.com/upload', // 仅为示例，非真实的接口地址
    //   filePath: file.url,
    //   name: 'file',
    //   formData: { user: 'test' },
    //   success(res) {
    //     // 上传完成需要更新 fileList
    //     const { fileList = [] } = this.data;
    //     fileList.push({ ...file, url: res.data });
    //     this.setData({ fileList });
    //   },
    // });
  },
  deleteFile(e) {
    console.log(e)
    let index = e.detail.index;
    let fileList = this.data.fileList;
    fileList.splice(index, 1);
    this.setData({
      fileList
    })
  },
  contactUs() {
    wx.navigateTo({
      url: '/pages/customer/seeSeller/seeSeller',
    })
  },
  submit() {
    wx.showModal({
      title: '确认提交？',
      success: (res) => {
        if (res.confirm) {
          console.log('用户点击确定');
          // 这里处理用户点击确定的逻辑
        } else if (res.cancel) {
          console.log('用户点击取消');
          // 这里处理用户点击取消的逻辑
        }
      }
    });
  }
})