// pages/friendList/index.js
const Page = require('../../utils/ald-stat.js').Page;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    friendList:'',
    page:1,
    noMore:'',
    haveMore:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    wx.request({
      url: app.globalData.base_url + '/yq_friends',
      data: {
        page: 1,
        openid: wx.getStorageSync('openid')
      },
      success: function (res) {
        that.setData({
          friendList: res.data.list,
          noMore:res.data.more,
          haveMore: res.data.more
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
      that.data.page = page
      wx.request({
        url: app.globalData.base_url + '/yq_friends',
        data: {
          page: page,
          openid: wx.getStorageSync('openid')
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          that.data.friendList = that.data.friendList.concat(res.data.list);
          that.setData({
            friendList: that.data.friendList,
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

  },

})