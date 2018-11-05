// pages/friendList/index.js
const Page = require('../../utils/ald-stat.js').Page;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    friendList:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.onShow(); // 刷新页面
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.request({
      url: app.globalData.base_url + '/more_friends',
      data: {
        openid: wx.getStorageSync('openid')
      },
      success: function (res) {
        that.setData({
          friendList: res.data.res,
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var openid = wx.getStorageSync('openid')
    var nickname = wx.getStorageSync('nickname')
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: `${nickname}邀请你用步数免费换礼物，数量有限！先到先得！`,
      imageUrl: '../../imgs/share.png',
      path: '/pages/index/index?openid=' + openid
    }
  },
})