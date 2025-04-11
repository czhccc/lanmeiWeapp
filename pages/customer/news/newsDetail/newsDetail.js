// pages/customer/news/newsDetail.js
import {
  _getNewsDetail
} from '../../../../network/customer/news.js'

import dayjs from 'dayjs'

Page({
  data: {
    theData: null
  },
  onLoad(options) {
    this.getNewsDetail(options.id)
  },
  getNewsDetail(id) {
    _getNewsDetail({ 
      id,
      flag: 'wechat' 
    }).then(res => {
      let theData = res.data
      theData.updateTimeToShow = dayjs(theData.updateTime).format('YYYY-MM-DD')

      this.setData({
        theData
      })
    })
  }
})