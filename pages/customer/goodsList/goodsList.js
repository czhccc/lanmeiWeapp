// pages/prefer/goodsList.js
import {
  _getCategory,
  _getGoodsList
} from '../../../network/customer/goods'

Page({
  data: {
    goodsName: '',

    categoryList: [],
    choosedCategoryId: null,

    listData: [],
  },
  onLoad(options) {
    this.getCategory()
  },
  onShow() {
    this.getGoodsList({goodsCategoryId: this.data.choosedCategoryId})
  },
  getCategory() {
    var that = this;
    _getCategory({
      isSelling: true
    }).then(res => {
      if (res.data.length > 0) {
        that.getGoodsList({goodsCategoryId: res.data[0].children[0].id})
      }

      this.setData({
        categoryList: res.data,
        choosedCategoryId: res.data[0].children[0].id
      })
    })
  },
  getGoodsList(params) {
    _getGoodsList({
      ...params,
      pageNo: 1,
      pageSize: 999,
      goodsIsSelling: 1,
    }).then(res => {
      this.setData({
        listData: res.data.records
      })
    })
  },
  categoryItemClick(e) {
    let categoryId = e.currentTarget.dataset.id
    this.setData({
      choosedCategoryId: categoryId,
    })
    this.getGoodsList({goodsCategoryId: categoryId})
  },
  getAllGoods() {
    this.setData({
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
      goodsName: null,
      choosedCategoryId: -1,
    })
  },
  goodsClick(e) {
    let item = e.currentTarget.dataset.item
    console.log(item)
    wx.navigateTo({
      url: `/pages/customer/goodsList/goodsDetail/goodsDetail?id=${item.id}`,
    })
  }
})