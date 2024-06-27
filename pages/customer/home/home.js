// pages/home/home.js

Page({
  data: {
    swiper: [],
  },
  onLoad(options) {

  },
  onShow() {

  },
  seeBigSwiperItem(e) {
    console.log(e)
    wx.previewImage({
      urls: ['https://img0.baidu.com/it/u=3121065565,3649687365&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1422','https://i0.hdslb.com/bfs/article/442ddbb12b31a22e67bb99e524d1e69800e9ebf8.jpg','https://img1.baidu.com/it/u=1429192092,2564268011&fm=253&app=138&f=JPEG?w=800&h=1131'] // 需要预览的图片http链接列表
    });
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
    // getHomeSwiper().then(res => {
    //   this.setData({
    //     swiper: res.result
    //   })
    // })
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
  return() {
    wx.navigateTo({
      url: '/pages/temporary/home/home',
    })
  },
})