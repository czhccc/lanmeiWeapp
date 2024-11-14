import {
  baseURL, timeOut
} from './config'

export default function(options, showToast=true) {
  let token = wx.getStorageSync('token');
  // let token = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IjEzOTg5NTM2OTM2IiwiaWF0IjoxNzMxNDg5NDc3LCJleHAiOjE3MzE1NzU4Nzd9.nIpBFPRsjkimHDhyGLJqEobNY_bXN0zQ5HHGA1ms8kZXRrq6s-QovRpJcXrw2bPbjC-GN60f6vxrP7f6649qf4_xGq7lHmcf9xagEuyn4supki9ovHEPWrXppIHOFRH5MI5VHEMLpGiGL4xaG9SHs7Cue1EUR1a5JACgsZZA6luiMOimqP6kyDsz9duxKK-0ZdQwW2Xc8fpNJALfzHTbMwVWu49fFnWdYfCS7IewbI6kKpiiXG5PHKZ4zMjGatA2QsC6bOPuskiduMh1rCwqYE4bRlwB_f2p4EdSnpabde_O0d49SI3mopx74_L-dqvpzb3mRw3RpEzfCzqz__X7Vg';
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
            reject(data)
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