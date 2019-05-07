// pages/success/index.js
const Page = require('../../../utils/ald-stat.js').Page;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addinfo:'',
    msg:'',
    orderId:'',
    tel:'',
    num:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId: options.orderId
    })
    if(options.num){
      this.setData({
        num:options.num
      })
    }
  },

  copyText: function (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this;
    var orderId=that.data.orderId
    wx.request({
      url: app.globalData.base_url + '/duihuan_success',
      data: {
        order_id: orderId,
        openid: wx.getStorageSync('openid')
      },
      success: function (res) {
        console.log(res)
        that.setData({
          addinfo:res.data.addinfo,
          msg:res.data.res,
        })
      }
    })
  },

})