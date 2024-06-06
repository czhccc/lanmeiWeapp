// components/common/TabBar/TabBar.js
Component({
  properties: {
    // tabIndex: {
    //   type: Number,
    //   value: 0
    // },
  },
  data: {
    tabIndex: 0,
    currentUrl: '',
  },
  lifetimes: {
    attached() {
      let pages = getCurrentPages();
      let currentPage = pages[pages.length - 1];
      let currentUrl = `/${currentPage.route}`;
      this.setData({
        currentUrl
      })
    },
  },
  methods: {
    switchTabHandle(e) {
      let index = Number(e.currentTarget.dataset.index)
      let pages = getCurrentPages()
      let currentPage = pages[pages.length-1]
      let url = `/${currentPage.route}`
      let urls = ['/pages/home/home', '/pages/prefer/prefer', '/pages/point/point', '/pages/mine/mine', '/pages/order/order']
      if (url !== urls[index]) {
        this.setData({
          tabIndex: index
        })
        wx.switchTab({
          url: urls[index],
        })
      }
    }
  }
})