// pages/customer/comment/comment.js
import {
  _comment,
  _getUserComments
} from '../../../network/customer/comment'
import {
  _getIdempotencyKey
} from '../../../network/customer/utils'

import dayjs from 'dayjs'

Page({
  data: {
    activeName: ['1', '2'],
    comment: '',
    fileList: [],

    historyComments: [],

    isSubmitting: false,
    hasComment: false,
  },
  onLoad(options) {
    this.getHistoryComments()
  },
  getHistoryComments() {
    _getUserComments({
      author: wx.getStorageSync('phone'),
      startTime: dayjs().subtract(1, 'month').format('YYYY-MM-DD 00:00:00'),
      endTime: dayjs().format('YYYY-MM-DD 23:59:59')
    }).then(res => {
      this.setData({
        historyComments: res.data.records
      })
    })
  },
  onChange(e) {
    if (this.data.activeName !== e.detail) {
      this.setData({
        activeName: e.detail,
      });
    }
  },
  afterRead(event) {
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
  async submit() {
    if (this.data.isSubmitting) {
      return;
    }
    var that = this;

    if (!this.data.comment.trim()) {
      return;
    }

    that.data.isSubmitting = true

    let idempotencyKey;
    try {
      let getIdempotencyKeyResult = await _getIdempotencyKey({
        keyParams: {
          comment: that.data.comment,
        },
        keyPrefix: 'comment'
      });
      idempotencyKey = getIdempotencyKeyResult.data.idempotencyKey
    } catch (error) {
      this.data.isSubmitting = false
      return false;
    }

    wx.showModal({
      title: '确认提交？',
      success: (res) => {
        if (res.confirm) {
          _comment({
            idempotencyKey,
            comment: that.data.comment,
          }).then(res => {
            wx.showToast({
              title: '留言成功',
              icon: 'none'
            })
            setTimeout(() => {
              that.getHistoryComments()

              that.setData({
                comment: '',
                hasComment: false,
              })

              this.data.isSubmitting = false
            }, 1500)
          }).catch(() => {
            that.data.isSubmitting = false
          })
        }
      }
    });
  },
  commentChange(e) {
    const hasComment = !!e.detail.trim();
    if (this.data.hasComment !== hasComment) {
      this.setData({ 
        hasComment 
      });
    }
  }
})