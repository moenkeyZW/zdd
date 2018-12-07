// pages/share/index.js
const Page = require('../../utils/ald-stat.js').Page;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newUser: true,
    state: 0,
    openid: '',
    goods_id: '',
    goods: '',
    userInfo: '',
    hy_num: '',
    friend: '',
    goods_num:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this;
    that.setData({
      goods_id: options.goods_id,
      openid: options.openid
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    const that = this;
    const goods_id = that.data.goods_id;
    const openid = that.data.openid;
    var hy_openid = '';
    if (wx.getStorageSync('openid')) {
      var hy_openid = wx.getStorageSync('openid')
    } else {
      hy_openid = 0;
    }
    wx.request({
      url: app.globalData.base_url + '/zl_con',
      data: {
        goods_id: goods_id,
        openid: openid,
        hy_openid: hy_openid,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res)
        that.setData({
          goods_num: res.data.goods_num,
          state: res.data.state,
          userInfo: res.data.users,
          goods: res.data.goods,
          friend: res.data.friends,
          hy_num: res.data.hy_num,
        })
      }
    })

  },
  fhindex:function(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  goExchange:function(){
    const that = this;
    const goods_id = that.data.goods_id;
    const dh = 100;
    wx.navigateTo({
      url: '/pages/oneDetail/index?id=' + goods_id + '&&dh=' + dh,
    })
  },
  goOnedetail: function() {
    const that = this;
    const goods_id = that.data.goods_id;
    wx.navigateTo({
      url: '/pages/oneDetail/index?id=' + goods_id,
    })
  },
  sportSQ: function() {
    var that = this;
    wx.getWeRunData({
      complete: function() {
        wx.switchTab({
          url: '/pages/index/index',
        })
      },
    })
  },
  authorizeNow: function() {
    const that = this;
    app.zlLogin(function(res) {
      wx.showLoading({
        title: '授权中',
      })
      if (res) {
        wx.hideLoading();
        that.onShow();
        that.forFriend();
      }
    });
  },
  newUserLingqu: function() {
    const that = this;
    wx.request({
      url: app.globalData.base_url + '/is_new',
      data: {
        openid: wx.getStorageSync('openid')
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        that.setData({
          newUser: true,
        })
        that.sportSQ();
      }
    })
  },
  forFriend: function() {
    const that = this;
    const goods_id = that.data.goods_id;
    const openid = that.data.openid;
    if (wx.getStorageSync('openid')) {
      wx.request({
        url: app.globalData.base_url + '/zl_friends',
        data: {
          goods_id: goods_id,
          openid: openid,
          hy_openid: wx.getStorageSync('openid')
        },
        success: function(res) {
          if(res.data.is_right==1){
            that.setData({
              newUser: false,
            })
          }else{
            that.sportSQS();
          }
        }
      })
    }else{
      that.authorizeNow();
    }

  },
  sportSQS: function () {
    var that = this;
    wx.getWeRunData({
      complete:function(){
        that.onShow();
      },
    })
  },
  newUserLingqus: function () {
    const that = this;
    wx.request({
      url: app.globalData.base_url + '/is_new',
      data: {
        openid: wx.getStorageSync('openid')
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          newUser: true,
        })
        that.sportSQS();
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    const that = this;
    const openid = that.data.openid;
    const photo = that.data.goods.share_img;
    const goods_id = that.data.goods.id;
    const title = that.data.goods.title;
    return {
      title: `免费拿${title}，点击有份，速度来！`,
      imageUrl: photo,
      path: '/pages/share/index?openid=' + openid + '&&goods_id=' + goods_id
    }
  }
})