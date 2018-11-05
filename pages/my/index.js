// pages/my/index.js
const Page = require('../../utils/ald-stat.js').Page;
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
    days: 0,
    perMessage: true,
    genderArray: ['男', '女'],
    ageArr: ageArr,
    heightArr: heightArr,
    weightArr: weightArr,
    test_log_id: '',
    type_id: '',
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
    const that = this;
    if (wx.getStorageSync('openid')) {
      var openids = wx.getStorageSync('openid');
    } else {
      var openids = 0;
    }
    wx.request({
      url: app.globalData.base_url + '/my',
      data: {
        openid: openids
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        that.setData({
          type_id: res.data.type_id,
          days: res.data.res.days,
        })
      }
    })

  },

  order: function(e) {
    var that=this;
    if (wx.getStorageSync('openid') && wx.getStorageSync('open_id')) {
      wx.navigateTo({
        url: '/pages/order/index',
      })
    } else {
      app.onLogin(function (res) {
        if (res) {
          that.onShow()
        }
      });
    }
  },
  hotMoney: function(e) {
    var that=this;
    if (wx.getStorageSync('openid') && wx.getStorageSync('open_id')) {
      wx.navigateTo({
        url: '/pages/heatMoney/index',
      })
    } else {
      app.onLogin(function (res) {
        if (res) {
          that.onShow()
        }
      });
    }
  },
  analysis: function(e) {
    var that = this;
    if (wx.getStorageSync('openid') && wx.getStorageSync('open_id')) {
      wx.request({
        url: app.globalData.base_url + '/see_test_info',
        data: {
          openid: wx.getStorageSync('openid')
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          var id = res.data.res.test_log_id;
          that.setData({
            test_log_id: id
          })
          if (res.data.state == 1) {
            wx.navigateTo({
              url: '/pages/analysis/index?id=' + id,
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
      app.onLogin(function(res) {
        if (res) {
          that.onShow();
        }
      });
      return;
    }
  },
  wsResult: function(e) {
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
    gender = gender == 1 ? "男" : "女";
    wx.request({
      url: app.globalData.base_url + '/save_info2',
      data: {
        gender: gender,
        age: age,
        height: height,
        weight: weight,
        openid: wx.getStorageSync('openid')
      },
      success: function(res) {
        let id=that.data.id;
        wx.navigateTo({
          url: '/pages/analysis/index?id=' + id,
        })
        that.setData({
          perMessage: true,
        })
      }
    })
  },
  hideHandle: function() {
    var that = this;
    that.setData({
      perMessage: true,
    })
  },
  address: function(e) {
    var that=this;
    if (wx.getStorageSync('openid') && wx.getStorageSync('open_id')) {
      wx.navigateTo({
        url: '/pages/address/index',
      })
    } else {
      app.onLogin(function(res) {
        if (res) {
          that.onShow()
        }
      });
    }
  },
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
      url: '/pages/rule/index',
    })
  },
  setting: function() {
    wx.navigateTo({
      url: '/pages/set/index',
    })
  },
})