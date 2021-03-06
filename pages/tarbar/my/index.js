// pages/my/index.js
const Page = require('../../../utils/ald-stat.js').Page;
const util = require('../../../utils/throttle.js');
const app = getApp();
const ageArr = [],
  heightArr = [],
  weightArr = []
for (let i = 1; i < 101; i++) {
  ageArr.push(i)
}
for (let i = 120; i < 220; i++) {
  heightArr.push(i)
}
for (let i = 30; i < 180; i++) {
  weightArr.push(i)
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    perMessage: true,
    genderArray: ['男', '女'],
    ageArr: ageArr,
    heightArr: heightArr,
    weightArr: weightArr,
    yq_num:0,
    is_new:'',
    order_num:0,
    money:0,
    xr_goods:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
  },

  onPullDownRefresh: function() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.onShow(); // 刷新页面
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  adsuc:function(res){
    console.log(1,res)
  },
  adfail:function(res){
    console.log(2,res)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    const that = this;
    if (wx.getStorageSync('openid')) {
      var openids = wx.getStorageSync('openid');
    } else {
      var openids = 0;
    }
    wx.request({
      url: app.globalData.base_url + '/my03',
      data: {
        openid: openids
      },
      method: 'GET',
      header: {
        'Cache-Control': 'max-age=60,public', //60秒
      },
      success: function(res) {
        wx.hideLoading();
        console.log(res)
        that.setData({
          is_new: res.data.is_new,
          order_num: res.data.help_order,
          money: res.data.my_currency,
          yq_num: res.data.friends_num,
          xr_goods: res.data.xr_goods,
        })
      }
    })

  },

  order: util.throttle(function(e) {
    var that=this;
    if (wx.getStorageSync('openid') && wx.getStorageSync('open_id')) {
      wx.navigateTo({
        url: '../../other/order/index',
      })
    } else {
      app.onLogin(function (res) {
        wx.showLoading({
          title: '授权中',
        })
        if (res) {
          wx.hideLoading();
          that.onShow();
        }
      });
    }
  },1500),
  gotoFriend: util.throttle(function(){
    const that=this;
    if (wx.getStorageSync('openid') && wx.getStorageSync('open_id')) {
      wx.navigateTo({
        url: '../../other/friendList/index',
      })
    } else {
      app.onLogin(function (res) {
        wx.showLoading({
          title: '授权中',
        })
        if (res) {
          wx.hideLoading();
          that.onShow();
        }
      });
    }

  },1500),
  gotoXr:function(){
    wx.navigateTo({
      url: '../../main/xrGoods/index',
    })
  },
  hotMoney: util.throttle(function(e) {
    var that=this;
    if (wx.getStorageSync('openid') && wx.getStorageSync('open_id')) {
      wx.navigateTo({
        url: '../../main/heatMoney/index',
      })
    } else {
      app.onLogin(function (res) {
        wx.showLoading({
          title: '授权中',
        })
        if (res) {
          wx.hideLoading();
          that.onShow();
        }
      });
    }
  },1500),
  assistance: util.throttle(function(){
    var that = this;
    if (wx.getStorageSync('openid') && wx.getStorageSync('open_id')) {
      wx.navigateTo({
        url: '../../main/assistance/index',
      })
    } else {
      app.onLogin(function (res) {
        wx.showLoading({
          title: '授权中',
        })
        if (res) {
          wx.hideLoading();
          that.onShow();
        }
      });
    }
  },1500),
  analysis: util.throttle(function(e) {
    var that = this;
    if (wx.getStorageSync('openid') && wx.getStorageSync('open_id')) {
      wx.request({
        url: app.globalData.base_url + '/see_test_info',
        data: {
          openid: wx.getStorageSync('openid')
        },
        method: 'GET',
        header: {
          'Cache-Control': 'max-age=60,public', //60秒
        },
        success: function(res) {
          if (res.data.state == 1) {
            wx.navigateTo({
              url: '../../main/analysis/index',
            })
          } else {
            that.setData({
              userInfo: res.data.res,
              perMessage: false,
            })
          }
        }
      })
    } else {
      app.onLogin(function (res) {
        wx.showLoading({
          title: '授权中',
        })
        if (res) {
          wx.hideLoading();
          that.onShow();
        }
      });
    }
  },1500),
  wsResult: util.throttle(function(e) {
    var that = this;
    var userInfo = that.data.userInfo;
    var gender = null;
    if (e.detail.value.gender > 0) {
      gender = e.detail.value.gender + 1;
    } else if (userInfo.gender > 0) {
      gender = userInfo.gender;
    } else {
      gender = ""
    }
    var height = null;
    if (e.detail.value.height > 0) {
      height = e.detail.value.height;
    } else if (userInfo.height > 0) {
      height = userInfo.height;
    } else {
      height = ""
    }
    var weight = null;
    if (e.detail.value.weight > 0) {
      weight = e.detail.value.weight;
    } else if (userInfo.weight > 0) {
      weight = userInfo.weight;
    } else {
      weight = ""
    }
    let age = e.detail.value.age;
    let mes = "";
    if (weight === "" || weight == 0) {
      mes = "体重"
      wx.showModal({
        title: '信息不完整',
        content: `${mes}未填写，请补充`,
        showCancel: false,
        confirmText: '知道了',
        success: function(res) {}
      })
      return
    }
    if (height === "" || height == 0) {
      mes = "身高"
      wx.showModal({
        title: '信息不完整',
        content: `${mes}未填写，请补充`,
        showCancel: false,
        confirmText: '知道了',
        success: function(res) {}
      })
      return
    }
    if (gender === "" || gender == null) {
      mes = "性别"
      wx.showModal({
        title: '信息不完整',
        content: `${mes}未填写，请补充`,
        showCancel: false,
        confirmText: '知道了',
        success: function(res) {}
      })
      return
    }
    if (age === "" || age == 0) {
      mes = "年龄"
      wx.showModal({
        title: '信息不完整',
        content: `${mes}未填写，请补充`,
        showCancel: false,
        confirmText: '知道了',
        success: function(res) {}
      })
      return
    }
    var gender = gender == 1 ? "男" : "女";
    wx.request({
      url: app.globalData.base_url + '/save_info',
      data: {
        gender: gender,
        age: age,
        height: height,
        weight: weight,
        openid: wx.getStorageSync('openid')
      },
      success: function(res) {
        wx.navigateTo({
          url: '../../main/analysis/index',
        })
        that.setData({
          perMessage: true,
        })
      }
    })
  },1500),
  hideHandle: function() {
    var that = this;
    that.setData({
      perMessage: true,
    })
  },
  address: util.throttle(function(e) {
    var that=this;
    if (wx.getStorageSync('openid') && wx.getStorageSync('open_id')) {
      wx.navigateTo({
        url: '../../main/address/index',
      })
    } else {
      app.onLogin(function (res) {
        wx.showLoading({
          title: '授权中',
        })
        if (res) {
          wx.hideLoading();
          that.onShow();
        }
      });
    }
  },1500),
  pickGender: function(e) {
    this.setData({
      [`userInfo.gender`]: Number.parseInt(e.detail.value) + 1
    })
  },
  pickAge: function(e) {
    this.setData({
      [`userInfo.age`]: Number.parseInt(e.detail.value) + 1
    })
  },
  pickHeight: function(e) {
    this.setData({
      [`userInfo.height`]: Number.parseInt(e.detail.value) + 120
    })
  },
  pickWeight: function(e) {
    this.setData({
      [`userInfo.weight`]: Number.parseInt(e.detail.value) + 30
    })
  },
  rule: function() {
    wx.navigateTo({
      url: '../../other/rule/index',
    })
  },
  setting: function() {
    wx.navigateTo({
      url: '../../other/set/index',
    })
  },
})