import {
  baseURL, timeOut
} from './config'

export default function(options, showToast=true) {
  // let token = wx.getStorageSync('token');
  let token = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicGhvbmUiOiIxMzk4OTUzNjkzNiIsIm5hbWUiOiJjemgiLCJyb2xlIjoyLCJpYXQiOjE3Mjc0MTc0NTksImV4cCI6MTcyNzUwMzg1OX0.Yx5JdaJ-Th7fJ9_RqScr2LZb2BQnSaAJw3RG38pn2CFDlKS5koKdzGz4SAJMNnCKeduT2RpTUitALPoghjpZKkOaDxHvN3tE9WTVy1YVALMmpsVUbKYon9DExqTNKw8bNETnaQtpy3qh09htbW7Ycaru0OncoQHZ97eZpwBZ_zCgd8Ll9TtKigWB-Mydsuyp-gYAtlKp5J2zh4GfX_aLOmhOg8ND3-DNTUb9dcf-XGmgLXDxNEOdNqIdqWZkb8FK_C-npJqZ-7JA56V1QQ91H0BrxRk3qviDYmZtFNQj5CxIbD_4aySjx4hBIeeM4MlYv0POP6ysD_QIed1rJB_s6Q';
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