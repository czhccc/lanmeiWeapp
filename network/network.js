import {
  baseURL, timeOut
} from './config'

export default function(options, showToast=true) {
  let token = wx.getStorageSync('token');
  // let token = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IjEzOTg5NTM2OTM2IiwiaWF0IjoxNzI5NjUxODQyLCJleHAiOjE3Mjk3MzgyNDJ9.lBOfmoZT3-VpVFcS-a2XKDGO6RgRnqi-03P5Jj5GeCJfoenBfEOY0rJeJ7ehPezFQhyIkysQFx8bj-p_L6vIeyoI9G9Yt_Y3g5WgopcYxVRk1SOxMpdWmocF3ah-oBo_dxNfj-Han5QhCvfLihHSFBYEY31mfB8PKUDPmotTHSzr6ChVRk2VKvIJ2LNNtAhs8ZJVkQVpsb2BV-SzzLkohaymhnHhr4aNBsNHNWq-FMwe5zIfvBItPoup5uSe_aADM9Nyyv_8QpyGerhcJii7CZ_6iEc5SIMoAP0W1QEvrEOMLWV_ZJaHgUIKe3Z8BkDXHgLMVvjvEBBY33vWDIBa8A';
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
            wx.removeStorageSync('phone')
            
            const pages = getCurrentPages();
            const currentPage = pages[pages.length - 1];
            const currentPageUrl = currentPage.route;
            if (currentPageUrl != 'pages/customer/mine/mine') {
              setTimeout(() => {
                wx.switchTab({
                  url: `/pages/customer/mine/mine`,
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