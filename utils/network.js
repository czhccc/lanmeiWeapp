export default function(options, showToast=true) {
	let token = wx.getStorageSync('token');
	let header = {}
	if (token) {
		header = { 'X-Access-Token': token }
    if (options.isFormData) {
      header['content-type'] = 'application/x-www-form-urlencoded'
    }
	}
  return new Promise((resolve, reject) => {
    if (showToast) {
      wx.showLoading({ title: '加载中' })
    }
    wx.request({
			header,
      url: 'https://dev.zjwocai.com/hhym-api' + options.url,
      timeout: 5000,
      method: options.method || 'GET',
      data: options.data || {},
      success: res => {
        let data = res.data
        
        if (!data.success) { // 不成功
          if (showToast) {
            wx.showToast({ title: data.message, icon: 'none' })
          }
					if (data.code === 1024) {
            const pages = getCurrentPages();
            const currentPage = pages[pages.length - 1];
            const currentPageUrl = currentPage.route;
            if (currentPageUrl != 'pages/login/login') {
              setTimeout(() => {
                wx.reLaunch({
                  url: '/pages/login/login',
                })
              }, 1500)
            }
					} else {
            if (showToast) {
              wx.showToast({ title: data.message, icon: 'none' })
            }
          }
        } else { // 成功
          if (showToast) {
            wx.hideLoading({ fail: err => {} })
          }
          resolve(data)
        }
			},
      fail: err => {
        if (showToast) {
          wx.hideLoading({ fail: err => {} })
        }
				wx.showToast({ title: '网络请求错误', icon: 'none' })
        reject(err)
      },
    })
  })
}