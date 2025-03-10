// pages/self/comment/comment.js
import {
  _getCommentListByWechat,
  _response
} from '../../../network/self/comment'

Page({
  data: {
    tabIndex: 0,

    pageNo: 1,
    pageSize: 10,
    list: [],

    refresherTriggered: false,

    commentId: null,
    isShowResponsePanel: false,
    responseContent: '',

    isSubmitting: false,
  },
  onLoad(options) {
    this.getCommentListByWechat()
  },
  getCommentListByWechat() {
    _getCommentListByWechat({
      hasResponsed: Boolean(this.data.tabIndex),
      pageNo: this.data.pageNo,
      pageSize: this.data.pageSize,
    }).then(res => {
      this.setData({
        list: [...this.data.list, ...res.data.records]
      })

      if (res.data.records.length > 0) {
        this.setData({
          pageNo: this.data.pageNo + 1
        })
      }

      if (this.data.refresherTriggered) {
        this.setData({
          refresherTriggered: false
        })
      }
    })
  },
  tabChange(e) {
    this.setData({
      list: [],
      pageNo: 1,
      tabIndex: e.detail.index,
    })
    this.getCommentListByWechat()
  },
  bindrefresherrefresh() {
    this.setData({
      pageNo: 1,
      list: [],
      refresherTriggered: true
    })
    this.getCommentListByWechat()
  },
  onScrollToLower() {
    this.getCommentListByWechat()
  },

  closeResponsePanel() {
    this.setData({
      isShowResponsePanel: false,
      responseContent: '',
    })
  },
  response(e) {
    this.data.commentId = e.currentTarget.dataset.id
    this.setData({
      isShowResponsePanel: true
    })
  },
  submit() {
    var that = this;
    if (that.data.isSubmitting) {
      return;
    }
    if (!this.data.responseContent) {
      wx.showToast({
        title: '请输入回复内容',
        icon: 'none'
      })
      return;
    }
    wx.showModal({
      title: '确认提交？',
      success(res) {
        if (res.confirm) {
          that.data.isSubmitting = true
          _response({
            commentId: that.data.commentId,
            response: that.data.responseContent
          }).then(res => {
            wx.showToast({
              title: '回复成功',
              icon: 'none'
            })
            that.setData({
              pageNo: 1,
              list: [],
            })
            setTimeout(() => {
              that.getCommentListByWechat()
              that.closeResponsePanel()
              that.data.isSubmitting = false
            }, 1500)
          }).finally(() => {
            that.data.isSubmitting = false
          })
        }
      }
    });
  }
})