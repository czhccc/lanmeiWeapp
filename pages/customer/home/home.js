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
  getLocation(){
    // wx.getLocation({
    //   type: 'wgs84',
    //   isHighAccuracy: true,
    //   success: res => {
    //     wx.setStorageSync('longitude', res.longitude)
    //     wx.setStorageSync('latitude', res.latitude)
    //   },
    // })
  },
  getLatestNotification() {
    _getLatestNotification().then(res => {
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
  return() {
    wx.navigateTo({
      url: '/pages/temporary/home/home',
    })
  },
})