import {
  baseURL, timeOut
} from './config'

export default function(options, showToast=true) {
  // let token = wx.getStorageSync('token');
  let token = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicGhvbmUiOiIxMzk4OTUzNjkzNiIsIm5hbWUiOiJjemgiLCJyb2xlIjoyLCJpYXQiOjE3MjgzNDkzOTgsImV4cCI6MTcyODQzNTc5OH0.d9pn4KnerGvCgqaAXeHcukDdCzgzdD5w30EFhk9728oNxGPOaHedIv21B_KepU-elBXGrFa4moeRFI6_H_c3QeEtjvKfhnyzNbYVp7Xb8jjM6EKWi4EUK0cX5PUANXuROldkl47ZO44IYwk3T0VmmicuG3FXDLVqxVmuEZ36KyIlca8cAwjZKqTjRFu1gQp8uX3OxTrCoMp1DkAm7rxokGX8LdCYh3WrnwNsR0oPmeAwHVz6hf6PSH_qxtacvokqOmbB5zw3iq6LqwjKzOHcyXXN_Riogl21FJLLvvbJhJ5VoBXjfHnxXrQCjjfKvocwU_KJnQ__tZOL3lAtqfdyLg';
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