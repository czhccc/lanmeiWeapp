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
      console.log('1111', currentUrl)
      this.setData({
        currentUrl
      })
    },
  },
  methods: {
    switchTabHandle(e) {
      let flag = e.currentTarget.dataset.flag
      let pages = getCurrentPages()
      let currentPage = pages[pages.length-1]
      let url = `/${currentPage.route}`
      console.log(flag)
      console.log(url)

      if (flag==='home') {
        wx.switchTab({
          url: '/pages/customer/home/home',
        })
      } else if (flag==='mine') {
        wx.switchTab({
          url: '/pages/customer/mine/mine',
        })
      } else if (flag==='goodsList') {
        wx.switchTab({
          url: '/pages/customer/goodsList/goodsList',
        })
      }
    }
  }
})