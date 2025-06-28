// pages/home/home.js
import {
  _getLatestNotification
} from '../../../network/customer/notify'

import {
  _getRecommendList
} from '../../../network/customer/recommend'

import {
  _getNewsListForWechat
} from '../../../network/customer/news.js'

import {
  _getWxpayParams
} from '../../../network/customer/wxpay.js'

import dayjs from 'dayjs'

Page({
  data: {
    notification: {
      content: '',
      time: '',
    },
    swiper: [],
    news: [],
  },
  onLoad(options) {

  },
  onShow() {
    this.getLatestNotification()
    this.getRecommendList()
    this.getNewsList()
  },
  getLatestNotification() {
    _getLatestNotification().then(res => {
      console.log('????????',res)

      if (res.data) {
        this.setData({
          notification: {
            content: res.data.content,
            createTime: res.data.createTime
          }
        })
      }
    })
  },
  getRecommendList() { // 轮播图
    _getRecommendList().then(res => {
      let swiper = res.data
      swiper.sort((a, b) => a.sort - b.sort);

      this.setData({
        swiper
      })
    })
  },
  swiperItemClick(e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/customer/goodsList/goodsDetail/goodsDetail?id=${item.goods_id}`,
    })
  },
  navigate(e) {
    let flag = e.currentTarget.dataset.flag
    switch (flag) {
      case 'myOrder':
        wx.navigateTo({
          url: '/pages/order/order',
        })
        break;
      case 'comment':
        wx.navigateTo({
          url: '/pages/customer/comment/comment',
        })
        break;
      case 'aboutUs':
        wx.navigateTo({
          url: '/pages/customer/seeSeller/seeSeller',
        })
        break;
      default:
        break;
    }
  },
  getNewsList() {
    _getNewsListForWechat().then(res => {
      let news = res.data.map(item => {
        return {
          id: item.id,
          title: item.title,
          isPin: item.isPin,
          createTime: item.createTime,
          isShowNewTip: dayjs(item.createTime).isAfter(dayjs().subtract(7, 'day')),
        }
      })
      news.sort((a, b) => {
        if (b.isPin !== a.isPin) {
          return b.isPin - a.isPin; // isPin 为 1 的排前面
        }
        return new Date(b.createTime) - new Date(a.createTime); // createTime 降序
      });

      this.setData({
        news
      })
    })
  },
  newsItemClick(e) {
    console.log(e)
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/customer/news/newsDetail/newsDetail?id=${item.id}`,
    })
  },


  async testPay() {
    const loginRes = await wx.login()
    const code = loginRes.code

    const wxpayParamsRes = await _getWxpayParams({
      code,
      orderNo: '202505021736454516936dNk'
    })
    const wxpayParams = wxpayParamsRes.data
    console.log('wxpayParams', wxpayParams)
    wx.requestPayment({
      timeStamp: wxpayParams.timeStamp,
      nonceStr: wxpayParams.nonceStr,
      package: wxpayParams.package,
      signType: wxpayParams.signType,
      paySign: wxpayParams.paySign,
      success: (res) => { // res === { errMsg: "requestPayment:ok" }
        wx.showToast({ title: '支付成功', icon: 'success' });
        // 处理支付成功逻辑
      },
      fail: (err) => {
        if (err.errMsg === 'requestPayment:fail cancel') {
          wx.showToast({ title: '支付已取消', icon: 'none' });
        } else {
          wx.showToast({ title: '支付失败，请重试', icon: 'none' });
        }
      }
    });
  }
})