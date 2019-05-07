// pages/set/index.js
const Page = require('../../../utils/ald-stat.js').Page;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isOpenWXRun: '',
    openid: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  onPullDownRefresh: function() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.onShow(); // 刷新页面
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    if (wx.getStorageSync('openid')) {
      that.setData({
        openid: true
      })
    } else {
      that.setData({
        openid: false
      })
    }
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.werun']) {
          that.setData({
            isOpenWXRun: true,
          })
        } else {
          that.setData({
            isOpenWXRun: false
          })
        }
      }
    })
  },
  goLogin: function(e) {
    app.onLogin();
    if (e.detail.errMsg == "getUserInfo:ok") {
      this.setData({
        openid: true
      })
    } else {
      this.setData({
        openid: false
      })
    }
  },
  goRun: function(e) {
    const that = this
    if (wx.getStorageSync('openid')) {
      wx.getWeRunData({
        fail: function(rs) {
          wx.showModal({
            title: '提示',
            content: '微信运动授权未开启，无法统计运动步数，请重新授权！',
            // showCancel: false,
            success: function(re) {
              if (re.confirm) {
                // console.log('用户点击确定')
                // 微信运动步数 提示授权
                wx.openSetting({
                  success: (res) => {
                    if (res.authSetting['scope.werun']) {
                      app.onRun(function(res) {
                        that.setData({
                          isOpenWXRun: app.globalData.isOpenWXRun
                        })

                      })
                    }
                  }
                })
              }
            }
          })
        },
        success: function(res) {
          app.onRun(function(res) {
            that.setData({
              isOpenWXRun: app.globalData.isOpenWXRun
            })
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '授权微信运动，需要先授权个人信息',
        showCancel:false,
        success: function (res) {
        }
      })
    }
  }
})