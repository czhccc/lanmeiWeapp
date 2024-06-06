// pages/prefer/prefer.js
// import {
//   getPreferCategory,
//   getPreferList
// } from '../../network/prefer'

Page({
  data: {
    category: [
      {
        createTime: null,
        id: "1787413356614189057",
        name: "水果",
        parentId: "",
        sort: 1,
        children: [
          {
            createTime: null,
            id: "1787413389069713409",
            name: "蓝莓",
            parentId: "1787413356614189057",
            sort: 1,
          },
          {
            createTime: null,
            id: "1787413505910439938",
            name: "苹果",
            parentId: "1787413356614189057",
            sort: 2,
          }
        ]
      },
      {
        createTime: null,
        id: "1787413356614189057",
        name: "养殖类",
        parentId: "",
        sort: 1,
        children: [
          {
            createTime: null,
            id: "1787413389069713402",
            name: "甲鱼",
            parentId: "1787413356614189057",
            sort: 1,
          },
          {
            createTime: null,
            id: "1787413505910439931",
            name: "公鸡",
            parentId: "1787413356614189057",
            sort: 2,
          }
        ]
      }
    ], // 分类
    pageNo: 1,
    pageSize: 10,
    listData: [
      {
        briefImage: "https://img0.baidu.com/it/u=2986344397,1978358800&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
        briefImages: "https://img0.baidu.com/it/u=2986344397,1978358800&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
        cashPrice: 0.01,
        id: "1787415085388857345",
        name: "【弘焕】时光逆龄",
        points: null,
        saleNum: 1,
        skuName: null,
      },
      {
        briefImage: "https://c-ssl.dtstatic.com/uploads/blog/202106/25/20210625220950_2b6b7.thumb.1000_0.jpg",
        briefImages: "https://c-ssl.dtstatic.com/uploads/blog/202106/25/20210625220950_2b6b7.thumb.1000_0.jpg",
        cashPrice: 0.01,
        id: "1787415085388857345",
        name: "【弘焕】时光逆龄",
        points: null,
        saleNum: 1,
        skuName: null,
      },
    ], // 列表数据
    choosedCategoryId: '', // tab
    searchParam: '',
    sortType: '',
    sortOrder: 'asc', // 排序 升序/降序
  },
  onLoad(options) {
    // this._getPreferCategory()
  },
  _getPreferCategory() {
    getPreferCategory().then(res => {
      console.log(res)
      let category = []
      for (const item of res.result) {
        if (item.children.length>0) {
          category.push(item)
        }
      }
      this.setData({
        category,
        choosedCategoryId: category[0].children[0].id
      })
      this._getPreferList()
    })
  },
  _getPreferList() {
    return;
    let params = {
      pageNo: this.data.pageNo,
      pageSize: this.data.pageSize,
      shopType: '5',
      gpId: this.data.choosedCategoryId,
      name: this.data.searchParam,
    }
    if (this.data.sortType) {
      params.sortField = this.data.sortType
      params.sortOrder = this.data.sortOrder
    }
    getPreferList(params).then(res => {
      console.log('列表', res)
      this.setData({
        listData: [...this.data.listData, ...res.result.records],
      })
      if (res.result.records.length > 0) {
        this.setData({
          pageNo: this.data.pageNo+1
        })
      }
    })
  },
  categoryItemClick(e) {
    console.log(e)
    this.setData({
      // listData: [],
      choosedCategoryId: e.currentTarget.dataset.item.id,
      pageNo: 1,
    })
    this._getPreferList()
  },
  scrollToLower() {
    console.log('滑动到底部')
    this._getPreferList()
  },
  onSearch(e) {
    console.log(e)
    this.setData({
      searchParam: e.detail,
      pageNo: 1,
      listData: []
    })
    this._getPreferList()
  },
  sortClick(e) {
    console.log(e)
    let flag = e.currentTarget.dataset.flag
    if (flag !== this.data.sortType) { // 切换类型
      this.setData({
        sortType: flag || null,
        listData: [],
        pageNo: 1
      })
      this._getPreferList()
    } else { // 切换排序
      this.setData({
        sortOrder: this.data.sortOrder==='asc'?'desc':'asc',
        listData: [],
        pageNo: 1
      })
      this._getPreferList()
    }
  },
  goodsClick(e) {
    let item = e.currentTarget.dataset.item
    console.log(item)
    wx.navigateTo({
      url: `/pages/customer/goodsList/goodsDetail/goodsDetail?id=${item.id}`,
    })
  }
})