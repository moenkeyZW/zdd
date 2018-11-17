// pages/index/index.js
const Page = require('../../utils/ald-stat.js').Page;
// const common = require('../../utils/common.js');
const app = getApp();
const innerAudioContext = wx.createInnerAudioContext();

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
    step: 0,
    money: 0,
    zl_goods: '',
    free_goods: '',
    measure: true,
    zanwu: true,
    share: true,
    shouquan: true,
    shouIndex: true,
    newUser: true,
    openid: '',
    result: '',
    page: 1,
    haveMore: true,
    scene_value: '',
    noMore: true,
    clicked: true,
    clim: true,
    isOpenWXRun: true,
    is_new: true,
    top_num: 0,
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
    wx.showLoading({
      title: '加载中',
    })
    const that = this;
    if (options.openid) {
      that.setData({
        openid: options.openid
      })
    }
    wx.request({
      url: app.globalData.base_url + '/free_goods_list',
      data: {
        page: 1,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        that.setData({
          free_goods: res.data.goods,
        })
      }
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
        }
      })
      var openids = wx.getStorageSync('openid');
      that.setData({
        isHaveopenid: true
      })
      if (that.data.openid) {
        var openid = that.data.openid
        wx.request({
          url: app.globalData.base_url + '/invite_friends',
          data: {
            openid: openid,
            hy_openid: wx.getStorageSync('openid')
          },
          success: function(res) {}
        })
      }
    } else {
      var openids = 0;
      that.setData({
        shouquan: false,
        isHaveopenid: false
      })
    }
    wx.request({
      url: app.globalData.base_url + '/home_content',
      data: {
        openid: openids
      },
      success: function(res) {
        wx.hideLoading();
        console.log(res)
        that.setData({
          zl_goods: res.data.zl_goods,
          result: res.data.result,
          money: res.data.currency,
          scene_value: res.data.scene_value,
          top_num: res.data.top_num, 
          is_new: res.data.is_new,
        })
        if (res.data.scene_value == 1) {
          if (res.data.result.type_id == 2) {
            that.setData({
              zanwu: false,
            })
          } else {
            that.setData({
              measure: false,
            })
          }
        }
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
      complete: function() {
        that.onShow();
      },
    })
  },

  // 上拉触底事件，请求记录数据
  onReachBottom: function() {
    const that = this
    let page = that.data.page;
    if (that.data.haveMore) {
      // 请求下一页数据
      page++;
      that.data.page = page
      wx.request({
        url: app.globalData.base_url + '/free_goods_list',
        data: {
          page: page,
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          that.data.free_goods = that.data.free_goods.concat(res.data.goods);
          that.setData({
            free_goods: that.data.free_goods,
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

  authorizeNow: function(e) {
    var that = this;
    if (that.data.openid){
      app.yqLogin(function (res) {
        wx.showLoading({
          title: '授权中',
        })
        if (res) {
          wx.hideLoading();
          that.setData({
            shouquan: true,
            shouIndex: false,
            newUser: false,
          })
        }
      });
    }else{
      app.onLogin(function (res) {
        wx.showLoading({
          title: '授权中',
        })
        if (res) {
          wx.hideLoading();
          that.setData({
            shouquan: true,
            shouIndex: false,
            newUser: false,
          })
        }
      });
    }
  
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
        console.log(res)
        that.setData({
          newUser: true,
        })
        that.sportSQ();
      }
    })
  },
  goHeat: function(e) {
    var that = this;
    if (wx.getStorageSync('openid') && wx.getStorageSync('open_id') != 0) {
      wx.navigateTo({
        url: '/pages/heatMoney/index',
      })
    } else {
      if(that.data.openid){
        app.yqLogin(function (res) {
          wx.showLoading({
            title: '授权中',
          })
          if (res) {
            wx.hideLoading();
            that.setData({
              newUser: false,
            })
          }
        });
      }else{
        app.onLogin(function (res) {
          wx.showLoading({
            title: '授权中',
          })
          if (res) {
            wx.hideLoading();
            that.setData({
              newUser: false,
            })
          }
        });
      }
 
    }
  },
  zlDetail: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/oneDetail/index?id=' + id,
    })
  },

  freeDetail: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/detail/index?id=' + id,
    })
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
  seeMore: function() {
    wx.navigateTo({
      url: '/pages/moreGoods/index',
    })
  },
  heiping: function() {
    const that = this;
    that.setData({
      measure: true,
      zanwu: true,
      clicked: false,
      clim: false,
    })
    that.sportSQ();
  },
  wsMessage: function(e) {
    var that = this;
    var form_id = e.detail.formId;
    wx.request({
      url: app.globalData.base_url + '/tishi2',
      data: {
        form_id: form_id,
        openid: wx.getStorageSync('openid')
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        that.setData({
          measure: true,
          zanwu: true,
          clicked: false,
          clim: false,
        })
      }
    })
    that.sportSQ();
  },
  drawMore: function() {
    wx.switchTab({
      url: '/pages/step/index',
    })
  },
  openShare: function() {
    const that = this
    that.setData({
      shareFriend: false,
    })
  },
  shouquan: function() {
    const that = this;
    that.setData({
      shouquan: true,
      shouIndex: false,
    })
  },
  hideHandle: function() {
    const that = this;
    that.setData({
      share: true,
      shareFriend: true,
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    var that = this;
    var openid = wx.getStorageSync('openid')
    var nickname = wx.getStorageSync('nickname')

    return {
      title: `${nickname}邀请你用步数免费换礼物，数量有限，先到先得！`,
      imageUrl: '../../imgs/share.png',
      path: '/pages/index/index?openid=' + openid
    }
  },
})