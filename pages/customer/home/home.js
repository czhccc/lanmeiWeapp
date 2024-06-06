// pages/home/home.js
import { 
  getWaitingNumber,
  getHomeSwiper,
  getHomeRecommend
} from '../../network/home'

Page({
  data: {
    swiper: [],
    waitingNumber: 0,
    recommend: [],
  },
  onLoad(options) {
    this.getLocation()
    this._getSwiper()
    this._getRecommend()
  },
  onShow() {
    let token = wx.getStorageSync('token');
    if (token) {
      this._getWaitingNumber()
    }
  },
  getLocation(){
    wx.getLocation({
      type: 'wgs84',
      isHighAccuracy: true,
      success: res => {
        wx.setStorageSync('longitude', res.longitude)
        wx.setStorageSync('latitude', res.latitude)
      },
    })
  },
  _getSwiper() { // 轮播图
    getHomeSwiper().then(res => {
      this.setData({
        swiper: res.result
      })
    })
  },
  _getWaitingNumber() { // 待服务数量
    getWaitingNumber().then(res => {
      this.setData({
        waitingNumber: res.result
      })
    })
  },
  _getRecommend() { // 推荐主题及商品
    getHomeRecommend().then(res => {
      this.setData({
        recommend: res.result
      })
    })
  },
  navigate(e) {
    console.log(e)
    let flag = e.currentTarget.dataset.flag
    switch (flag) {
      case 'ljyy':
        wx.switchTab({
          url: '/pages/order/order',
        })
        break;
      case 'yxsc':
        wx.switchTab({
          url: '/pages/prefer/prefer',
        })
        break;
      case 'jfsc':
        wx.switchTab({
          url: '/pages/point/point',
        })
        break;
      case 'vipqy':
        wx.navigateTo({
          url: '/pages/vip/vip',
        })
        break;
      default:
        break;
    }
  },
  goodsClick(e) { // 点击商品
    console.log(e.currentTarget.dataset.item)
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/prefer/preferGoodsDetail/preferGoodsDetail?id=${item.id}`,
    })
  },
  toOrderRecord() {
    wx.navigateTo({
      url: '/pages/order/orderRecord/orderRecord',
    })
  }
})