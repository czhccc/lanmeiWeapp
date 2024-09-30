import {
  baseURL, timeOut
} from './config'

export default function(options, showToast=true) {
  // let token = wx.getStorageSync('token');
  let token = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicGhvbmUiOiIxMzk4OTUzNjkzNiIsIm5hbWUiOiJjemgiLCJyb2xlIjoyLCJpYXQiOjE3Mjc2NjExOTgsImV4cCI6MTcyNzc0NzU5OH0.V83LqksSHB4jGIEVc4eZz77iL3tU2NM8gIURAeQsTjY96ylSNJRS-woPnMocTDJEujI4dEmDXPA63dHHqYAOvfCn9k-nN2kHLHblplr3mGmgFLepOdlb-TDPPfaFTw1iSwmIdLBgEtsoRbw4NBw9PPGF1eQEA7OYglOyzemU9qoL0Z_iunBpi_hQa7rGP7NsteOQfhy3wVBYBfkeLpB90AEHt8CTm1t1xRg_g1WPVy3chTrdLsgBdzVpgC6qDOfUx092jpxGHopbDTXHARtlfhO3HggW0r4Vo09q5rWKHFEqAmsR15SaVWQUX7hqOQE6uqi_oZGpvIg3mzPasvzU4g';
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