// pages/index/index.js
const Page = require('../../utils/ald-stat.js').Page;
const app = getApp();
const innerAudioContext = wx.createInnerAudioContext();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    money: 0,
    sign: true,
    openid: '',
    isHaveopenid: '',
    weeks: '',
    is_sign: 0,
    is_follow: '',
    today_rlb: '',
    tomorrow_rlb: '',
    time: '07:00',
    yiqd: false,
    contact: true,
    addmy: true,
    is_add: '',
    is_add_tc:'',
    count_day: '',
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.onShow(); // 刷新页面
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {


  },
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    const that = this;
    if (wx.getStorageSync('openid') && wx.getStorageSync('open_id') != 0) {
      // var openids = wx.getStorageSync('openid');
      that.setData({
        isHaveopenid: true
      })
    } else {
      // var openids = 0;
      that.setData({
        isHaveopenid: false
      })
    }
    wx.request({
      url: app.globalData.base_url + '/earn_rlb03',
      data: {
        openid: wx.getStorageSync('openid')
      },
      success: function(res) {
        console.log(res)
        that.setData({
          count_day: res.data.count_day,
          contact: true,
          money: res.data.today_currency,
          weeks: res.data.sign,
          is_sign: res.data.is_sign,
          is_follow: res.data.is_follow,
          is_add: res.data.is_add,
          is_add_tc:res.data.is_add_tc,
        })
      }
    })
  },
  lookMoney: function() {
    wx.navigateTo({
      url: '/pages/heatMoney/index',
    })
  },
  seeExchange: function() {
    wx.navigateTo({
      url: '/pages/exchange/index',
    })
  },
  goRule: function() {
    wx.navigateTo({
      url: '/pages/rule/index',
    })
  },
  music: function() {
    innerAudioContext.src = 'https://www.mnancheng.com/Public/home/bj_music.mp3'
    innerAudioContext.play()
  },
  authorizeNow: function(e) {
    var that = this;
    app.onLogin(function(res) {
      wx.showLoading({
        title: '授权中',
      })
      if (res) {
        wx.hideLoading();
        that.onShow();
      }
    });
  },

  goHeat: function(e) {
    var that = this;
    if (wx.getStorageSync('openid') && wx.getStorageSync('open_id') != 0) {
      wx.navigateTo({
        url: '/pages/heatMoney/index',
      })
    } else {
      app.onLogin(function(res) {
        wx.showLoading({
          title: '授权中',
        })
        if (res) {
          wx.hideLoading();
          that.onShow();
        }
      });
    }
  },

  goSign: function(e) {
    const that = this;
    var form_id = e.detail.formId;
    var day = that.data.count_day;
    that.setData({
      yiqd: true,
    },()=>{
      wx.request({
        url: app.globalData.base_url + '/sign02',
        data: {
          form_id: form_id,
          count_day: day,
          openid: wx.getStorageSync('openid')
        },
        success: function (res) {
          that.music();
          that.setData({
            sign: false,
            today_rlb: res.data.today_rlb,
            tomorrow_rlb: res.data.receive_rlb
          })
        }
      })
    })
  },
  bespeak: function(e) {
    const that = this;
    var form_id = e.detail.formId;
    var time = that.data.time;
    wx.request({
      url: app.globalData.base_url + '/bespeak',
      data: {
        form_id: form_id,
        yy_time: time,
        openid: wx.getStorageSync('openid')
      },
      success: function(res) {
        that.setData({
          sign: true,
        })
        that.onShow();
      }
    })
  },
  openAdd: function() {
    let that = this;
    wx.request({
      url: app.globalData.base_url + '/is_add03',
      data: {
        openid: wx.getStorageSync('openid')
      },
      success: function(res) {
        that.setData({
          addmy: false,
        })
      }
    })

  },
  opencontact: function() {
    this.setData({
      contact: false,
    })
  },
  hideHandle: function() {
    const that = this;
    that.setData({
      sign: true,
      addmy: true,
    })
    that.onShow();
  },

  hideShare: function() {
    const that = this;
    that.setData({
      contact: true,
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.onShow(); // 刷新页面
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    const that = this;
    var openid = wx.getStorageSync('openid')
    return {
      title: '步数换好礼，我正在用步数免费领礼品，你也快来！',
      imageUrl: '../../imgs/share.png',
      path: '/pages/index/index?openid=' + openid + '&&jx=55'
    }
  },
})