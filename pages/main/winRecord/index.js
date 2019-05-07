// pages/winRecord/index.js
const Page = require('../../../utils/ald-stat.js').Page;
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    haveMore: '',
    record: '',
    page: 1,
    state: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this;
    wx.request({
      url: app.globalData.base_url + '/turntable_jl',
      data: {
        page: 1,
        openid: wx.getStorageSync('openid')
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        that.setData({
          haveMore:res.data.more,
          state: res.data.state,
          record: res.data.res,
        })
      }
    })
  },
  // 上拉触底事件，请求记录数据
  onReachBottom: function () {
    const that = this
    let page = that.data.page;
    if (that.data.haveMore) {
      // 请求下一页数据
      page++;
      that.data.page = page;
      wx.request({
        url: app.globalData.base_url + '/turntable_jl',
        data: {
          page: page,
          openid: wx.getStorageSync('openid')
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res)
          var record = that.data.record.concat(res.data.res);
          that.setData({
            record: record,
            haveMore: res.data.more,
          })
        }
      })
    } else {
      console.log('没有更多商品')
    }

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  }

})