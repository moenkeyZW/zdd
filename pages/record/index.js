// pages/record/index.js
const Page = require('../../utils/ald-stat.js').Page;
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordList:'',
    haveMore:true,
    page:1,
    state:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.request({
      url: app.globalData.base_url + '/get_weight',
      data: {
        openid: wx.getStorageSync('openid')
      },
      success: function (res) {
       console.log(res)
       that.setData({
         state:res.data.state,
       })
       if(res.data.state===1){
         that.setData({
           recordList: res.data.res
         })
       }
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
      // wx.showLoading({
      //   title: '加载中',
      // })
      wx.request({
        url: app.globalData.base_url + '/get_weight_list',
        data: {
          page: page,
          openid: wx.getStorageSync('openid')
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          that.data.recordList = that.data.recordList.concat(res.data.res);
          that.setData({
            recordList: that.data.recordList,
            haveMore: res.data.more,
          })
        }
      })
    } else {
      // wx.showToast({
      //   title: '数据加载完毕',
      //   icon: 'success',
      //   duration: 1500,
      // })
    }
  },

})