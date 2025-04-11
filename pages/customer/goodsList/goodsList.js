// pages/prefer/goodsList.js
import {
  _getCategoryList,
  _getGoodsList
} from '../../../network/customer/goods'

Page({
  data: {
    goodsName: '',

    categoryList: [],
    choosedCategoryId: -1,

    listData: [],

    refresherTriggered: false,
  },
  onLoad(options) {
    
  },
  onShow() {
    this.getCategory()
    this.getGoodsList({
      goodsCategoryId: this.data.choosedCategoryId
    })
  },
  getCategory() {
    _getCategoryList().then(res => {
      if (res.data.length === 0) {
        return;
      }

      this.setData({
        categoryList: res.data
      })
    })
  },
  getGoodsList(params) {
    _getGoodsList({
      ...params,
    }).then(res => {
      this.setData({
        listData: res.data.records
      })

      if (this.data.refresherTriggered) { // 下拉刷新
        this.setData({
          refresherTriggered: false
        })
      }
    })
  },
  categoryItemClick(e) {
    let categoryId = e.currentTarget.dataset.id
    this.setData({
      goodsName: '',
      choosedCategoryId: categoryId,
    })
    this.getGoodsList({goodsCategoryId: categoryId})
  },
  getAllGoods() {
    this.setData({
      goodsName: '',
      choosedCategoryId: -1
    })
    this.getGoodsList()
  },
  scrollToLower() {
    console.log('滑动到底部')
  },
  onSearch(e) {
    let params = {
      goodsName: e.detail
    }
    this.getGoodsList(params)
    this.setData({
      choosedCategoryId: -1,
    })
  },
  goodsClick(e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/customer/goodsList/goodsDetail/goodsDetail?id=${item.id}`,
    })
  },
  bindrefresherrefresh() { // 下拉刷新
    this.setData({
      listData: [],
      refresherTriggered: true
    })

    this.getCategory()
    if (this.data.choosedCategoryId === -1) { // 全部
      this.getGoodsList()
    } else { // 某个
      this.getGoodsList({goodsCategoryId: this.data.choosedCategoryId})
    }
  },
})