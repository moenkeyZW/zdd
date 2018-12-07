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
    // step: 0,
    yq_num:'',
    money: 0,
    zl_goods: '',
    free_goods: '',
    userInfo: '',
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
    noMore: '',
    clicked: true,
    clim: true,
    // isOpenWXRun: true,
    is_new: true,
    top_num: 0,
    perMessage: true,
    genderArray: ['男', '女'],
    ageArr: ageArr,
    heightArr: heightArr,
    weightArr: weightArr,
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
          noMore: res.data.more,
          haveMore: res.data.more
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
      // that.onRun();
      var openids = wx.getStorageSync('openid');
      that.setData({
        shouquan: true,
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
          yq_num: res.data.yq_num,
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
      // fail: function(res) {
      //   that.setData({
      //     isOpenWXRun: false,
      //   })
      // },
      // success: function(res) {
      //   that.onRun()
      // },
      complete: function() {
        that.onShow();
      },
    })
  },
  // onRun: function(cb) {
  //   var that = this;
  //   wx.getSetting({
  //     success(res) {
  //       if (!res.authSetting['scope.werun']) {
  //         that.setData({
  //           isOpenWXRun: false,
  //         })
  //       } else {
  //         if (!wx.getStorageSync('session')) {
  //           that.setData({
  //             isOpenWXRun: false,
  //           })
  //         } else {
  //           wx.checkSession({
  //             success: function() {
  //               wx.getWeRunData({
  //                 success(res) {
  //                   wx.request({
  //                     url: app.globalData.base_url + '/wxrun',
  //                     data: {
  //                       encryptedData: encodeURIComponent(res.encryptedData),
  //                       iv: encodeURIComponent(res.iv),
  //                       session: wx.getStorageSync('session'),
  //                       openid: wx.getStorageSync('openid'),
  //                     },
  //                     method: 'GET',
  //                     header: {
  //                       'Content-Type': 'application/x-www-form-urlencoded'
  //                     },
  //                     success: function(res) {
  //                       console.log(21, res)
  //                       if (res.data.status == 1) {
  //                         that.setData({
  //                           isOpenWXRun: true,
  //                           step: res.data.data,
  //                         })
  //                       } else {
  //                         that.setData({
  //                           isOpenWXRun: false,
  //                         })
  //                         wx.login({
  //                           success: res => {
  //                             wx.getUserInfo({
  //                               withCredentials: true,
  //                               success: function(res_user) {
  //                                 wx.request({
  //                                   url: app.globalData.base_url + '/login',
  //                                   data: {
  //                                     auth_type: 0,
  //                                     scene_value: 0,
  //                                     code: res.code,
  //                                     encryptedData: encodeURIComponent(res_user.encryptedData),
  //                                     iv: encodeURIComponent(res_user.iv)
  //                                   },
  //                                   method: 'GET',
  //                                   header: {
  //                                     'content-type': 'application/json'
  //                                   },
  //                                   success: function(res) {
  //                                     wx.setStorageSync('nickname', res.data.userinfo.nickname);
  //                                     wx.setStorageSync('session', res.data.hash);
  //                                     wx.setStorageSync('openid', res.data.openid);
  //                                     wx.setStorageSync('open_id', res.data.open_id);
  //                                     that.onShow();
  //                                   }
  //                                 })
  //                               },
  //                             })
  //                           },

  //                         })
  //                       }
  //                     }
  //                   })
  //                 }
  //               })
  //             },
  //             fail: function() {
  //               wx.login({
  //                 success: res => {
  //                   if (res.code) {
  //                     wx.getUserInfo({
  //                       withCredentials: true,
  //                       success: function(res_user) {
  //                         wx.request({
  //                           url: app.globalData.base_url + '/login',
  //                           data: {
  //                             auth_type: 0,
  //                             scene_value: 0,
  //                             code: res.code,
  //                             encryptedData: encodeURIComponent(res_user.encryptedData),
  //                             iv: encodeURIComponent(res_user.iv)
  //                           },
  //                           method: 'GET',
  //                           header: {
  //                             'content-type': 'application/json'
  //                           },
  //                           success: function(res) {
  //                             wx.setStorageSync('nickname', res.data.userinfo.nickname);
  //                             wx.setStorageSync('session', res.data.hash);
  //                             wx.setStorageSync('openid', res.data.openid);
  //                             wx.setStorageSync('open_id', res.data.open_id);
  //                             that.onShow();
  //                           }
  //                         })
  //                       },
  //                     })
  //                   } else {
  //                     console.log('获取用户登录态失败！' + res.errMsg)
  //                   }
  //                 },
  //               })
  //             }
  //           })

  //         }
  //       }
  //     }
  //   })
  // },


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
    } else {
      // wx.showToast({
      //   title: '商品加载完毕',
      //   icon: 'success',
      //   duration: 1500,
      // })
    }
  },

  authorizeNow: function(e) {
    const that = this;
    if (that.data.openid) {
      app.yqLogin(function(res) {
        wx.showLoading({
          title: '授权中',
        })
        if (res) {
          wx.hideLoading();
          that.onShow()
          that.setData({
            shouquan: true,
            shouIndex: false,
            newUser: false,
          })
        }
      });
    } else {
      app.onLogin(function(res) {
        wx.showLoading({
          title: '授权中',
        })
        if (res) {
          wx.hideLoading();
          that.onShow()
          that.setData({
            shouquan: true,
            shouIndex: false,
            newUser: false,
          })
        }
      });
    }
  },
  chengzhong:function(e){
    const that = this;
    var form_id = e.detail.formId;
    wx.request({
      url: app.globalData.base_url + '/collect',
      data: {
        form_id: form_id,
        openid: wx.getStorageSync('openid')
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          measure: true,
          zanwu: true,
          clicked: false,
          clim: false,
        })
        that.sportSQ();
      }
    })
  },
  newUserLingqu: function(e) {
    const that = this;
    var form_id = e.detail.formId;
    wx.request({
      url: app.globalData.base_url + '/is_new02',
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
      if (that.data.openid) {
        app.yqLogin(function(res) {
          wx.showLoading({
            title: '授权中',
          })
          if (res) {
            wx.hideLoading();
            that.onShow()
            that.setData({
              newUser: false,
            })
          }
        });
      } else {
        app.onLogin(function(res) {
          wx.showLoading({
            title: '授权中',
          })
          if (res) {
            wx.hideLoading();
            that.onShow()
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

  // goRun: function(e) {
  //   var that = this;
  //   wx.getWeRunData({
  //     fail: function(rs) {
  //       wx.showModal({
  //         title: '提示',
  //         content: '微信运动授权未开启，无法统计运动步数，请重新授权！',
  //         success: function(re) {
  //           if (re.confirm) {
  //             wx.openSetting({
  //               success: (res) => {
  //                 if (res.authSetting['scope.werun']) {
  //                   that.onRun();
  //                   // that.onRun(function(res) {
  //                   //   that.setData({
  //                   //     isOpenWXRun: app.globalData.isOpenWXRun
  //                   //   })
  //                   //   that.getStepRecord(res.data);
  //                   // })
  //                 }
  //               }
  //             })
  //           }
  //         }
  //       })
  //     },
  //     success: function(res) {
  //       that.onRun();
  //       // that.onRun(function(res) {
  //       //   that.setData({
  //       //     isOpenWXRun: app.globalData.isOpenWXRun
  //       //   })
  //       //   that.getStepRecord(res.data);
  //       // })
  //     }
  //   })
  // },
  seeMore: function() {
    wx.navigateTo({
      url: '/pages/moreGoods/index',
    })
  },
  gotoRule:function(){
    wx.navigateTo({
      url: '/pages/rule/index',
    })
  },
  drawMores:function(){
    const that=this;
    if (wx.getStorageSync('openid') && wx.getStorageSync('open_id') != 0){
      wx.navigateTo({
        url: '/pages/friendList/index',
      })
    }else{
      if (that.data.openid) {
        app.yqLogin(function (res) {
          wx.showLoading({
            title: '授权中',
          })
          if (res) {
            wx.hideLoading();
            that.onShow()
            that.setData({
              newUser: false,
            })
          }
        });
      } else {
        app.onLogin(function (res) {
          wx.showLoading({
            title: '授权中',
          })
          if (res) {
            wx.hideLoading();
            that.onShow()
            that.setData({
              newUser: false,
            })
          }
        });
      }

    }
  },
  seeExchange: function() {
    const that = this;
    if (wx.getStorageSync('openid') && wx.getStorageSync('open_id') != 0) {
      if (that.data.top_num == 0) {
        wx.showModal({
          title: '提示',
          content: '您的热力币不足，暂无可领取礼品',
          showCancel: false,
        })
      } else {
        wx.navigateTo({
          url: '/pages/exchange/index',
        })
      }

    } else {
      if (that.data.openid) {
        app.yqLogin(function(res) {
          wx.showLoading({
            title: '授权中',
          })
          if (res) {
            wx.hideLoading();
            that.onShow()
            that.setData({
              newUser: false,
            })
          }
        });
      } else {
        app.onLogin(function(res) {
          wx.showLoading({
            title: '授权中',
          })
          if (res) {
            wx.hideLoading();
            that.onShow()
            that.setData({
              newUser: false,
            })
          }
        });
      }

    }

  },
  analysis: function() {
    const that = this;
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
        console.log(res)
        if (res.data.state == 1) {
          wx.navigateTo({
            url: '/pages/analysis/index',
          })
        } else {
          that.setData({
            userInfo: res.data.res,
            perMessage: false,
          })
        }
      }
    })
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
          url: '/pages/analysis/index',
        })
        that.setData({
          perMessage: true,
        })
      }
    })
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
      perMessage: true,
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