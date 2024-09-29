import {
  baseURL, timeOut
} from './config'

export default function(options, showToast=true) {
  // let token = wx.getStorageSync('token');
  let token = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicGhvbmUiOiIxMzk4OTUzNjkzNiIsIm5hbWUiOiJjemgiLCJyb2xlIjoyLCJpYXQiOjE3Mjc1NzM4NjIsImV4cCI6MTcyNzY2MDI2Mn0.MtZNCLk8XxnC75Kr3LvDbWKkWc2Jknz7Lyhcjzeo7IOgcr5nEQq7uJCL6F6S4mJjrl7vJplpTy2sylmCznqr0DjpjRnqX1pATT9pK3JgWNYkEKhz2suka7peojAKcEXTevPwgkhaqUIwbKk10cNUFjkhxbZLhNBspI8me8UJHiF-FZppphQYRbV6UmTMBzSIc2ZcwzVhoU0hCw4L7F7EFIM_0j5NlwBdViHY0ntrTiHJsW32si4sCQ7XGIeTOb3ZcQVJKheo-Gk-uxsqimbQubMDAlMfytpjm6RkrYCCVfc9pWCutPHyzvIyvvlHOozlR8lWBV1i5yqm2leHp7QMpQ';
	let header = {}
	if (token) {
		header = { 'Authorization': token }
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
      url: baseURL + options.url,
      timeout: timeOut,
      method: options.method || 'GET',
      data: options.data || {},
      success: res => {
        let data = res.data
        
        if (data.code !== 200) { // 不成功
          if (showToast) {
            wx.showToast({ title: data.message, icon: 'none' })
          }
					if (data.code === 401) {
            wx.removeStorageSync('token')
            const pages = getCurrentPages();
            const currentPage = pages[pages.length - 1];
            const currentPageUrl = currentPage.route;
            if (currentPageUrl != 'pages/mine/mine') {
              setTimeout(() => {
                wx.reLaunch({
                  url: `/pages/mine/mine?flag=expire`,
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