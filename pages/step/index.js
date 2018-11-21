// pages/index/index.js
const Page = require('../../utils/ald-stat.js').Page;
const app = getApp();
const innerAudioContext = wx.createInnerAudioContext();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    step: 0,
    money: 0,
    goods: '',
    sign:true,
    share: true,
    openid: '',
    result: '',
    haveMore: true,
    count_day: '',
    goods_detail: '',
    isOpenWXRun: true,
    isHaveopenid: '',
    dhcg: false,
    is_dh: '',
    weeks:'',
    is_sign:0,
    is_follow:'',
    today_rlb:'',
    tomorrow_rlb:'',
    time:'07:00',
    yiqd:false,
    contact:true,
    is_new:'',
    goods_num:'',
    newUser:true,
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
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    if (wx.getStorageSync('openid') && wx.getStorageSync('open_id') != 0) {
      app.onRun(function(res) {
        that.setData({
          isOpenWXRun: app.globalData.isOpenWXRun
        })
        if (res == undefined) {
          console.log('获取运动步数失败')
        } else {
          that.getStepRecord(res.data);
          that.setData({
            is_dh: res.is_dh
          })
        }
      })
      var openids = wx.getStorageSync('openid');
      that.setData({
        isHaveopenid: true
      })
    } else {
      var openids = 0;
      that.setData({
        isHaveopenid: false
      })
    }
    wx.request({
      url: app.globalData.base_url + '/earn_rlb',
      data: {
        openid: openids
      },
      success: function(res) {
        wx.hideLoading();
        console.log(res)
        that.setData({
          is_new:res.data.is_new,
          goods_num:res.data.goods_num,
          money: res.data.my_currency,
          weeks:res.data.sign,
          is_sign:res.data.is_sign,
          is_follow: res.data.is_follow,
          count_day: res.data.count_day,
        })
      }
    })
  },
  sportSQ: function() {
    var that = this;
    wx.getWeRunData({
      fail: function(res) {
        that.setData({
          isOpenWXRun: app.globalData.isOpenWXRun
        })
      },
      success: function(res) {
        app.onRun(function(res) {
          that.setData({
            isOpenWXRun: app.globalData.isOpenWXRun
          })
          that.getStepRecord(res.data);
        })
      },
      complete: function () {
        wx.switchTab({
          url: '/pages/index/index',
        })
      },
    })
  },
  newUserLingqu: function () {
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
        that.sportSQ();
      }
    })
  },
  goRule:function(){
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
        that.setData({
          newUser: false,
        })
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
      app.onLogin(function (res) {
        wx.showLoading({
          title: '授权中',
        })
        if (res) {
          wx.hideLoading();
          that.onShow();
          that.setData({
            newUser: false,
          })
        }
      });
    }
  },

  goRun: function(e) {
    var that = this;
    wx.getWeRunData({
      fail: function(rs) {
        wx.showModal({
          title: '提示',
          content: '微信运动授权未开启，无法统计运动步数，请重新授权！',
          success: function(re) {
            if (re.confirm) {
              wx.openSetting({
                success: (res) => {
                  if (res.authSetting['scope.werun']) {
                    app.onRun(function(res) {
                      console.log(res, app.globalData.isOpenWXRun)
                      that.setData({
                        isOpenWXRun: app.globalData.isOpenWXRun
                      })
                      that.getStepRecord(res.data);
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
          that.getStepRecord(res.data);
        })
      }
    })
  },

  exchange: function(e) {
    const that = this
    var form_id = e.detail.formId;
    var step = that.data.step;
    var is_dh = that.data.is_dh;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.werun']) {
          var step = that.data.step;
          var money = (step / 5000).toFixed(2);
          if (step < 1000) {
            wx.showModal({
              // title: '兑换失败',
              content: '可兑换步数低于1000无法兑换热力币，多走些步数再来兑换吧',
              showCancel: false,
            })
          } else {
            if (is_dh == 1) {
              wx.showModal({
                title: '热力币兑换',
                content: `你将消耗${step}步，兑换${money}个热力币，确认兑换？`,
                success: function(res) {
                  if (res.confirm) {
                    that.setData({
                      dhcg: true,
                    })
                    wx.request({
                      url: app.globalData.base_url + '/exchange',
                      data: {
                        form_id: form_id,
                        step_num: step,
                        openid: wx.getStorageSync('openid')
                      },
                      method: 'GET',
                      header: {
                        'content-type': 'application/json'
                      },
                      success: function(res) {
                        setTimeout(function() {
                          while (step > 0) {
                            step -= 50;
                            that.setData({
                              step: step
                            })
                            if (step <= 50) {
                              that.music();
                              that.setData({
                                step: 0,
                                share: false,
                                dhcg: false,
                              })
                              if (!that.data.share) {
                                that.onShow();
                              }
                              return
                            }
                          }
                        }, 0);
                      }
                    })
                  } else if (res.cancel) {
                    return
                  }
                }
              })
            } else {
              wx.showModal({
                content: '今日步数兑换已达上限，明天再兑换吧',
                showCancel: false,
              })
            }
          }
        } else {
          that.setData({
            isOpenWXRun: false,
          })
        }
      }
    })
  },
  getStepRecord: function(runData) {
    var that = this;
    var runData = app.globalData.wxRunData;
    if (runData) {
      var count = runData.data;
    } else {
      var count = 0;
    }
    that.setData({
      step: count
    })
  },

  goSign:function(){
    const that=this;
    var day=that.data.count_day;
    wx.request({
      url: app.globalData.base_url + '/sign',
      data: {
        count_day: day,
        openid: wx.getStorageSync('openid')
      },
      success: function (res) {
        that.setData({
          sign:false,
          yiqd:true,
          today_rlb: res.data.today_rlb,
          tomorrow_rlb:res.data.receive_rlb
        })
      }
    })
  },
  bespeak:function(e){
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
      success: function (res) {
        that.setData({
          sign:true,
        })
        that.onShow();
      }
    })
  },
  opencontact:function(){
    this.setData({
      contact:false,
    })
  },
  hideHandle:function(){
    const that=this;
    that.setData({
      sign:true,
    })
    that.onShow();
  },

  hideShare:function(){
    const that=this;
    that.setData({
      share:true,
      contact:true,
    })
  },
  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
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
    that.setData({
      share: true,
    })
    var openid = wx.getStorageSync('openid')
    var nickname = wx.getStorageSync('nickname')
    return {
      title: `${nickname}邀请你用步数免费换礼物，数量有限，先到先得！`,
      imageUrl: '../../imgs/share.png',
      path: '/pages/index/index?openid=' + openid
    }
  },
})