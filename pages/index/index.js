// pages/index/index.js
const Page = require('../../utils/ald-stat.js').Page;
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
    zllqcg:true,
    readyZl: true,
    nocs: true,
    xrzlSuc: true,
    oldzlSuc: true,
    zlclicked: true,
    zlclickeds: true,
    zlclickedcc: true,
    sign: true,
    step: '0',
    time: '22:00',
    zl_goods: '',
    jx_goods: '',
    xr_goods: '',
    free_goods: '',
    userInfo: '',
    share: true,
    measure:true,
    zanwu: true,
    shouquan: true,
    shouIndex: true,
    newUser: true,
    openid: '',
    result: '',
    page: 1,
    haveMore: true,
    noMore: '',
    newuserclick: true,
    clicked: true,
    clim: true,
    isOpenWXRun: true,
    isOpenWXRuns: true, //为了区分运动授权，打开运动设置
    is_new: true, //false代表新人 未领取币
    perMessage: true,
    genderArray: ['男', '女'],
    ageArr: ageArr,
    heightArr: heightArr,
    weightArr: weightArr,
    is_dh: '',
    goods_id: '',
    xr: '',
    zl: '',
    jx: '',
    total_currency: '',
    today_currency: '',
    count_day: '',
    today_rlb: '',
    tomorrow_rlb: '',
    is_sign: '',
    is_rule: '',
    yiqd: false,
    dhcg: false,
    bespoke: false,
    indexzclick: true,
    indexz: true,
    y_step: '',
    calorie: '',
    percent1: '',
    percent2: '',
    isHaveopenid: true,
    bj_picture:'',
    notice_title:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    const that = this;
    if (options.gzjl == 100 && wx.getStorageSync('openid')) {
      wx.request({
        url: app.globalData.base_url + '/follow_wechat',
        data: {
          openid: wx.getStorageSync('openid')
        },
        success: function(res) {
          if (res.data.wechat) {
            console.log('已领取')
          } else {
            wx.showModal({
              title: '领取成功',
              content: '关注任务已完成，您的10热力币已到账',
              showCancel: false,
            })
          }
        }
      })
    }
    if (options.jx == 55) {
      that.setData({
        jx: options.jx,
        openid: options.openid
      })
    }
    if (options.xr == 77) {
      that.setData({
        openid: options.openid,
        goods_id: options.goods_id,
        xr: options.xr,
      })
    }
    if (options.zl == 66) {
      that.setData({
        openid: options.openid,
        goods_id: options.goods_id,
        zl: options.zl,
      })
    }
    if (app.globalData.scene === 1089) {
      wx.request({
        url: app.globalData.base_url + '/is_add_tc',
        data: {
          openid: wx.getStorageSync('openid')
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          if (res.data.tc_state && res.data.is_add) {
            wx.request({
              url: app.globalData.base_url + '/add_xcx03',
              data: {
                openid: wx.getStorageSync('openid')
              },
              method: 'GET',
              header: {
                'content-type': 'application/json'
              },
              success: function(res) {
                wx.showModal({
                  title: '领取成功',
                  content: '添加到我的任务已完成，10热力币已到账',
                  showCancel: false,
                })
              }
            })
          }
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(cb) {
    var that = this;
    if (wx.getStorageSync('openid') && wx.getStorageSync('open_id') != 0) {
      that.setData({
        newUser: true,
        isHaveopenid: true
      })
      that.onRun();
      var openids = wx.getStorageSync('openid');
      if (that.data.jx == 55) {
        wx.request({
          url: app.globalData.base_url + '/share03',
          data: {
            openid: that.data.openid,
            hy_openid: wx.getStorageSync('openid')
          },
          success: function(res) {
            console.log('jx', res)
          }
        })
      }
      if (that.data.xr == 77) {
        wx.request({
          url: app.globalData.base_url + '/invitation03',
          data: {
            goods_id: that.data.goods_id,
            openid: that.data.openid,
            hy_openid: wx.getStorageSync('openid')
          },
          success: function(res) {

          }
        })
      }
    } else {
      var openids = 0;
      if (that.data.zl == 66) {
        that.setData({
          shouquan: false,
          isHaveopenid: false
        })
      } else {
        that.setData({
          newUser: false,
          isHaveopenid: false
        })
      }
    }
    wx.request({
      url: app.globalData.base_url + '/home_content06',
      data: {
        openid: openids
      },
      header: {
        'content-type': 'application/json; charset=utf-8', // 默认值
        'Cache-Control': 'max-age=60', //60秒
      },
      success: function(res) {
        wx.hideLoading();
        console.log(res)
        that.setData({
          notice_title: res.data.notice_title,
          bj_picture: res.data.bj_picture,
          zl_goods: res.data.zl_goods,
          jx_goods: res.data.jx_goods,
          xr_goods: res.data.xr_goods,
          result: res.data.result,
          total_currency: res.data.total_currency,
          today_currency: res.data.today_currency,
          is_new: res.data.is_new,
          is_sign: res.data.is_sign,
          is_rule: res.data.is_rule,
          count_day: res.data.count_day,
        })
        typeof cb == "function" && cb(that.data.is_new);
        if (wx.getStorageSync('openid')) {
          if (that.data.zl == 66) {
            wx.request({
              url: app.globalData.base_url + '/assistance03',
              data: {
                goods_id: that.data.goods_id,
                openid: that.data.openid,
                hy_openid: wx.getStorageSync('openid')
              },
              success: function(res) {
                console.log('zl', res)
                if (res.data.state == 1) {
                  that.setData({
                    xrzlSuc: false,
                  })
                  return
                } else if (res.data.state == 2) {
                  that.setData({
                    oldzlSuc: false,
                  })
                  return
                } else if (res.data.state == 3 || res.data.state == 4) {
                  that.setData({
                    readyZl: false,
                  })
                  return
                } else if (res.data.state == 5 || res.data.state == 6) {
                  that.setData({
                    nocs: false,
                  })
                  return
                }
              }
            })
            return
          } else if (app.globalData.scene === 1035 && that.data.jx != 55 && that.data.xr != 77) {
            if (that.data.result.type_id == 2) {
              that.setData({
                zanwu: false,
              })
            } else {
              that.setData({
                measure: false,
              })
            }
            return
          }
        }
      }
    });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    let that = this;
    wx.showNavigationBarLoading() //在标题栏中显示加载
    that.onShow(); // 刷新页面
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  bindTimeChange: function(e) {
    const that = this;
    var signtime = e.detail.value;
    that.setData({
      time: signtime
    })
  },

  sportSQS: function() {
    var that = this;
    wx.getWeRunData({
      fail: function(res) {
        that.setData({
          isOpenWXRuns: false,
        })
      },
      complete: function() {
        that.onShow()
      },
    })
  },
  music: function() {
    innerAudioContext.src = 'https://www.mnancheng.com/Public/home/bj_music.mp3'
    innerAudioContext.play()
  },

  exchange: function(e) {
    const that = this
    var form_id = e.detail.formId;
    var step = that.data.step;
    var is_dh = that.data.is_dh;
    var step = that.data.step;
    var money = (step / 5000).toFixed(2);
    that.setData({
      dhcg: true,
    })
    if (step < 50) {
      wx.showModal({
        // title: '兑换失败',
        content: '可兑换步数低于50无法兑换热力币，多走些步数再来兑换吧',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            that.setData({
              dhcg: false,
            })
          }
        }
      })
    } else {
      if (is_dh == 1) {
        wx.showModal({
          title: '热力币兑换',
          content: `你将消耗${step}步，兑换${money}个热力币，确认兑换？`,
          success: function(res) {
            if (res.confirm) {
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
                      that.setData({
                        step: 0,
                        share: false,
                        dhcg: false,
                      })
                      that.music();
                      if (!that.data.share) {
                        that.onShow();
                      }
                      return
                    }
                  }, 0);
                }
              })
            } else if (res.cancel) {
              that.setData({
                dhcg: false,
              })
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
  },
  onRun: function(cb) {
    var that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.werun']) {
          that.setData({
            isOpenWXRun: false,
          })
        } else {
          if (!wx.getStorageSync('session')) {
            that.setData({
              isOpenWXRun: false,
            })
          } else {
            wx.checkSession({
              success: function() {
                wx.showLoading({
                  title: '正在获取步数',
                })
                wx.getWeRunData({
                  success(res) {
                    wx.request({
                      url: app.globalData.base_url + '/wxrun',
                      data: {
                        encryptedData: encodeURIComponent(res.encryptedData),
                        iv: encodeURIComponent(res.iv),
                        session: wx.getStorageSync('session'),
                        openid: wx.getStorageSync('openid'),
                      },
                      method: 'GET',
                      header: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                      },
                      success: function(res) {
                        if (res.data.status == 1) {
                          that.setData({
                            isOpenWXRun: true,
                            step: res.data.data,
                            is_dh: res.data.is_dh,
                          }, () => {
                            wx.hideLoading();
                            if (app.globalData.scene !== 1035 && that.data.zl != 66) {
                              wx.request({
                                url: app.globalData.base_url + '/yesterday_step',
                                data: {
                                  openid: wx.getStorageSync('openid')
                                },
                                method: 'GET',
                                header: {
                                  'content-type': 'application/json'
                                },
                                success: function(res) {
                                  if (res.data.step_state) {
                                    that.setData({
                                      y_step: res.data.y_step,
                                      calorie: res.data.calorie,
                                      percent1: res.data.percent1,
                                      percent2: res.data.percent2,
                                      indexz: false,
                                    })
                                  }
                                }
                              })
                            }
                          })
                        } else {
                          that.setData({
                            isOpenWXRun: false,
                          })
                          wx.login({
                            success: res => {
                              wx.getUserInfo({
                                withCredentials: true,
                                success: function(res_user) {
                                  wx.request({
                                    url: app.globalData.base_url + '/login03',
                                    data: {
                                      auth_type: 0,
                                      scene_value: 0,
                                      code: res.code,
                                      encryptedData: encodeURIComponent(res_user.encryptedData),
                                      iv: encodeURIComponent(res_user.iv)
                                    },
                                    method: 'GET',
                                    header: {
                                      'content-type': 'application/json'
                                    },
                                    success: function(res) {
                                      wx.setStorageSync('session', res.data.hash);
                                      wx.setStorageSync('openid', res.data.openid);
                                      wx.setStorageSync('open_id', res.data.open_id);
                                      that.onShow();
                                    }
                                  })
                                },
                              })
                            },

                          })
                        }
                      }
                    })
                  }
                })
              },
              fail: function() {
                wx.login({
                  success: res => {
                    if (res.code) {
                      wx.getUserInfo({
                        withCredentials: true,
                        success: function(res_user) {
                          wx.request({
                            url: app.globalData.base_url + '/login03',
                            data: {
                              auth_type: 0,
                              scene_value: 0,
                              code: res.code,
                              encryptedData: encodeURIComponent(res_user.encryptedData),
                              iv: encodeURIComponent(res_user.iv)
                            },
                            method: 'GET',
                            header: {
                              'content-type': 'application/json'
                            },
                            success: function(res) {
                              wx.setStorageSync('session', res.data.hash);
                              wx.setStorageSync('openid', res.data.openid);
                              wx.setStorageSync('open_id', res.data.open_id);
                              that.onShow();
                            }
                          })
                        },
                      })
                    } else {
                      console.log('获取用户登录态失败！' + res.errMsg)
                    }
                  },
                })
              }
            })

          }
        }
      }
    })
  },

  goSignForm: function(e) {
    const that = this;
    var form_id = e.detail.formId;
    var day = that.data.count_day;
    that.setData({
      yiqd: true,
    }, () => {
      wx.request({
        url: app.globalData.base_url + '/sign02',
        data: {
          form_id: form_id,
          count_day: day,
          openid: wx.getStorageSync('openid')
        },
        success: function(res) {
          that.music();
          that.setData({
            sign: false,
            today_rlb: res.data.today_rlb,
            tomorrow_rlb: res.data.receive_rlb
          })
          that.onShow();
        }
      })
    })
  },
  bespeak: function(e) {
    const that = this;
    var form_id = e.detail.formId;
    var time = that.data.time;
    that.setData({
      bespoke: true,
    }, () => {
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
    })
  },
  rule: function() {
    const that = this;
    wx.request({
      url: app.globalData.base_url + '/rule_explain03',
      data: {
        openid: wx.getStorageSync('openid')
      },
      success: function(res) {
        that.setData({
          is_rule: false,
        })
        wx.navigateTo({
          url: '/pages/rule/index',
        })
      }
    })
  },
  authorizeNows: function (e) {
    const that = this;
    if (that.data.openid) {
      app.yqLogin(function (res) {
        wx.showLoading({
          title: '授权中',
        })
        if (res) {
          wx.hideLoading();
          that.onShow();
          that.sportSQS();
          that.setData({
            shouquan: true,
            shouIndex: false,
          })
        }
        that.sportSQS;
      });
    } else {
      app.onLogin(function (res) {
        wx.showLoading({
          title: '授权中',
        })
        if (res) {
          wx.hideLoading();
          that.onShow();
          that.sportSQS();
          that.setData({
            newUser: true,
            newuserclick: false,
          })
        }
      });
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
          that.onShow();
          that.setData({
            shouquan: true,
            shouIndex: false,
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
          that.onShow();
          that.setData({
            newUser: true,
            newuserclick: false,
          })
        }
      });
    }
  },
  chengzhong: function(e) {
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
      success: function(res) {
        that.setData({
          measure: true,
          zanwu: true,
          clicked: false,
          clim: false,
        })
        if (!that.data.is_new) {
          that.onShow(function(res) {
            that.setData({
              zllqcg: false,
            })
          });
        }
      }
    })
  },
  zlactive: function() {
    wx.navigateTo({
      url: '/pages/zlGoods/index',
    })
  },
  newUserLingqus: function() {
    const that = this;
    if (that.data.openid) {
      app.xrLogin(function (res) {
        wx.showLoading({
          title: '授权中',
        })
        if (res) {
          wx.hideLoading();
          that.onShow();
          that.setData({
            newUser: true,
            zllqcg: false,
            newuserclick: false,
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
          that.onShow();
          that.setData({
            newUser: true,
            zllqcg: false,
            newuserclick: false,
          })
        }
      });
    }
  },
  golqnew: function(e) {
    const that = this;
    var form_id = e.detail.formId;
    wx.request({
      url: app.globalData.base_url + '/is_new03',
      data: {
        form_id: form_id,
        openid: wx.getStorageSync('openid')
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res)
        that.onShow()
        that.setData({
          zllqcg: false,
        })
      }
    })
  },
  newUserLingqu: function(e) {
    const that = this;
    var form_id = e.detail.formId;
    wx.request({
      url: app.globalData.base_url + '/is_new03',
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
          zllqcg: true,
          zlclickedcc: false,
        })
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
      that.authorizeNow();
    }
  },
  sfxr: function(e) {
    const that = this;
    var form_id = e.detail.formId;
    wx.request({
      url: app.globalData.base_url + '/black_is_new03',
      data: {
        form_id: form_id,
        openid: wx.getStorageSync('openid')
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res)
        that.setData({
          xrzlSuc: true,
          newUser: true,
          newuserclick: false,
          zlclickeds: false,
          zllqcg: true,
          zlclickedcc: false,
        })
      }
    })
  },
  sfxrs: function(e) {
    const that = this;
    var form_id = e.detail.formId;
    wx.request({
      url: app.globalData.base_url + '/black_is_new03',
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
          zanwu: true,
          measure: true,
          clicked: false,
          clim: false,
        })
      }
    })
  },
  xrlqs: function() {
    const that = this;
    that.setData({
      zanwu: true,
      measure: true,
      clicked: false,
      clim: false,
    })
  },
  xrlq: function() {
    const that = this;
    that.setData({
      xrzlSuc: true,
      newUser: true,
      newuserclick: false,
      zlclickeds: false,
    })
  },

  zlDetail: function(e) {
    var form_id = e.detail.formId;
    var id = e.detail.target.dataset.id;
    wx.navigateTo({
      url: '/pages/oneDetail/index?id=' + id + '&&form_id=' + form_id + '&&parements=ss',
    })
  },
  xrDetail: function(e) {
    var form_id = e.detail.formId;
    var id = e.detail.target.dataset.id;
    wx.navigateTo({
      url: '/pages/newDetail/index?id=' + id + '&&form_id=' + form_id + '&&parements=ss',
    })
  },
  freeDetail: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/detail/index?id=' + id + '&&parements=ss',
    })
  },
  seeMore: function() {
    wx.navigateTo({
      url: '/pages/moreGoods/index',
    })
  },
  seezlMore: function() {
    wx.navigateTo({
      url: '/pages/zlGoods/index',
    })
  },
  seexrMore: function() {
    wx.navigateTo({
      url: '/pages/xrGoods/index',
    })
  },
  gotoRule: function() {
    wx.navigateTo({
      url: '/pages/rule/index',
    })
  },

  analysis: function() {
    const that = this;
    if (wx.getStorageSync('openid') && wx.getStorageSync('open_id') != 0) {
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
    } else {
      that.authorizeNow();
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
    let that = this;
    if (wx.getStorageSync('openid') && wx.getStorageSync('open_id') != 0) {
      wx.navigateTo({
        url: '/pages/step/index',
      })
    } else {
      that.authorizeNow();
    }
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
      perMessage: true,
      sign: true,
    })
  },
  hideHandls: function() {
    const that = this;
    that.setData({
      readyZl: true,
      nocs: true,
      oldzlSuc: true,
      zlclicked: false,
    })
  },
  hideHand: function(e) {
    const that = this;
    var form_id = e.detail.formId;
    wx.request({
      url: app.globalData.base_url + '/close_yesterday_step',
      data: {
        openid: wx.getStorageSync('openid'),
        form_id: form_id
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        that.setData({
          indexzclick: false,
          indexz: true,
        })
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    var openid = wx.getStorageSync('openid')
    return {
      title: '步数换好礼，我正在用步数免费领礼品，你也快来！',
      imageUrl: '../../imgs/share.png',
      path: '/pages/index/index?openid=' + openid + '&&jx=55'
    }
  },
})