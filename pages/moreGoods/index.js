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
    haveMore:true,
    noMore:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this;
    wx.request({
      url: app.globalData.base_url + '/zl_goods_list',
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
      url: '/pages/oneDetail/index?id=' + id,
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
        url: app.globalData.base_url + '/zl_goods_list',
        data: {
          page: page,
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res)
          that.data.zl_goods = that.data.zl_goods.concat(res.data.goods);
          that.setData({
            zl_goods: that.data.zl_goods,
            haveMore: res.data.more,
          })
          if (res.data.more) {
            that.setData({
              noMore: true,
            })
          } else {
            that.setData({
              noMore: false,
            })
          }
        }
      })
    }
  },


 
})