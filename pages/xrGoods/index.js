// pages/moreGoods/index.js
const Page = require('../../utils/ald-stat.js').Page;
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    zl_goods:'',
    page:1,
    haveMore:'',
    noMore:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this;
    wx.request({
      url: app.globalData.base_url + '/xr_goods_list03',
      data: {
        page: 1,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        that.setData({
          zl_goods: res.data.goods,
          noMore: res.data.more,
          haveMore: res.data.more
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  onDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/newDetail/index?id=' + id,
    })
  },
  // 上拉触底事件，请求记录数据
  onReachBottom: function () {
    const that = this
    let page = that.data.page;
    if (that.data.haveMore) {
      // 请求下一页数据
      page++;
      that.data.page = page
      wx.request({
        url: app.globalData.base_url + '/xr_goods_list03',
        data: {
          page: page,
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          that.data.zl_goods = that.data.zl_goods.concat(res.data.goods);
          that.setData({
            zl_goods: that.data.zl_goods,
            haveMore: res.data.more,
            noMore: res.data.more
          })
        }
      })
    }
  },


 
})