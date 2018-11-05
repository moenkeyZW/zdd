// pages/login/index.js
const Page = require('../../utils/ald-stat.js').Page;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isHaveShow: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    if (app.globalData.scene === 1035) {
      if (wx.getStorageSync('openid') && wx.getStorageSync('open_id')) {
        wx.showLoading({
          title: '正在获取中',
        })
        app.onRefreshs(function(res) {
          if (res) {
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
        });
      } else {
        that.setData({
          isHaveShow: true,
        })
      }
    } else {
      wx.showLoading({
        title: '正在获取中',
      })
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  authorizeNow: function(e) {
    app.onLogins(function(res) {
      wx.showLoading({
        title: '授权中',
      })
      if (res) {
        wx.hideLoading();
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
    });
  },
})