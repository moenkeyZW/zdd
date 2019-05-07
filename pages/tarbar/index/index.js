// pages/index/index.js
const Page = require('../../../utils/ald-stat.js').Page;
const util = require('../../../utils/throttle.js');
const app = getApp();
const innerAudioContext = wx.createInnerAudioContext();
const base_url = 'https://www.mnancheng.com/admin/Wechatluck';
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
let videoAd = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weekss: ['../../../imgs/daya.png', '../../../imgs/dayb.png', '../../../imgs/dayc.png', '../../../imgs/dayd.png', '../../../imgs/daye.png', '../../../imgs/dayf.png', '../../../imgs/dayg.png'],
    tryfail: true,
    trysuc: true,
    stepdh: true,
    luck: true,
    tjjl: true,
    gzjl: true,
    addmy: true,
    contact: true,
    zllqcg: true,
    readyZl: true,
    nocs: true,
    xrzlSuc: true,
    oldzlSuc: true,
    zlclicked: true,
    zlclickeds: true,
    zlclickedcc: true,
    sign: true,
    step: '获取步数',
    zl_goods: '',
    jx_goods: '',
    xr_goods: '',
    free_goods: '',
    userInfo: '',
    share: true,
    measure: true,
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
    bj_picture: '',
    notice_title: '',
    timer: '',
    is_add: '',
    lucky_ad: '',
    is_follow: '',
    dayed: 1,
    step_ad: '',
    x_times: '',
    noluck: false,
    money: '',
    ad_data: {},
    plate: '',
    number: '',
    clickedfail: true,
    clickedsuc: true,
    erweima: '',
    seat: '', //签到12，步数兑换11,幸运奖励13
    ra: '',
    home_lucky_ad: '',
    rand_rlb: '',
    flow: false, //防止流量主广告点击回来出弹框
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    const that = this;
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-d760aa330a1e1bcb'
      });
      videoAd.load();
      videoAd.onError(function(res) {
        console.log(101, res)
        if (res.errMsg == 'no advertisement' || res.errMsg == 'no ad unit id' || res.errCode == 1004) {
          that.setData({
            noluck: true,
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(cb) {
    var that = this;
    if (that.data.erweima == 3) {
      that.setData({
        clickedsuc: true,
        trysuc: false,
      })
      if (that.data.plate == 1) {
        that.setData({
          step: 0
        })
      }
      that.data.erweima = 0
    } else if (that.data.erweima == 4) {
      that.setData({
        clickedfail: true,
        tryfail: false,
      })
      that.data.erweima = 0
    }
    if (app.globalData.scene === 1038 && that.data.flow) {
      if (that.data.plate == 1) {
        var ra = thta.data.ra;
        var ratio = that.data.x_times;
        var step = that.data.step;
      } else {
        var ra = "",
          step = "",
          ratio = "";
      }
      wx.request({
        url: base_url + '/back_adv',
        data: {
          openid: wx.getStorageSync('openid'),
          type: 2,
          ad_id: that.data.ad_data.ad_id,
          plate: that.data.plate,
          ra: ra,
          ratio: ratio,
          step: step
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          console.log(res.data.msg, res)
          that.data.erweima = 0;
          app.globalData.scene = 1001;
          if (res.data.status == 1) {
            if (that.data.plate == 1) {
              that.setData({
                step: 0
              })
            }
            that.setData({
              number: res.data.number,
              trysuc: false,
              clickedsuc: true,
            })
          } else {
            that.setData({
              tryfail: false,
              clickedfail: true
            })
          }
        }
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
                  success(res) {
                    if (res.confirm) {
                      that.setData({
                        is_add: 1
                      })
                    }
                  }
                })
              }
            })
          }
        }
      })
    }
    if (wx.getStorageSync('openid') && wx.getStorageSync('open_id') != 0) {
      that.setData({
        newUser: true,
        isHaveopenid: true
      })
      if (that.data.step >= 0) {
        console.log(666)
        that.data.timer = setInterval(function() {
          that.onRun()
        }, 120000)
      } else {
        that.onRun();
      }
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
      url: app.globalData.base_url + '/home_content',
      data: {
        openid: openids
      },
      header: {
        'Cache-Control': 'max-age=60,public', //60秒
      },
      success: function(res) {
        wx.hideLoading();
        console.log(res)
        that.setData({
          is_add: res.data.is_add,
          is_follow: res.data.is_follow,
          result: res.data.result,
          total_currency: res.data.total_currency,
          today_currency: res.data.today_currency,
          is_new: res.data.is_new,
          lucky_ad: res.data.lucky_ad,
          is_sign: res.data.is_sign,
          is_rule: res.data.is_rule,
          home_lucky_ad: res.data.home_lucky_ad
        })
        that.data.step_ad=res.data.step_ad,
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
            if (res.data.result.type_id == 2) {
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
  // 监听页面初次渲染完成,在onShow之后运行
  onReady() {
    const that = this;
    wx.request({
      url: app.globalData.base_url + '/down_home_content04',
      header: {
        'Cache-Control': 'max-age=60,public', //60秒
      },
      success: function(res) {
        console.log(res)
        that.setData({
          notice_title: res.data.notice_title,
          bj_picture: res.data.bj_picture,
          xr_goods: res.data.xr_goods,
          zl_goods: res.data.zl_goods,
          jx_goods: res.data.jx_goods,
        })
      }
    })
  },
  onHide: function() {
    wx.hideLoading();
    this.setData({
      addmy: true,
    })
    app.globalData.scene = 1001;
    clearInterval(this.data.timer);
  },
  onUnload: function() {
    wx.hideLoading();
    clearInterval(this.data.timer);
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

  stepchange: util.throttle(function(e) {
    const that = this
    var form_id = e.detail.formId;
    var is_dh = that.data.is_dh;
    var step = that.data.step;
    var money = (step / 5000).toFixed(2);
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
      success: function (res) {
        setTimeout(function () {
          while (step > 0) {
            that.setData({
              money: money,
              step: 0,
              share: false,
              dhcg: false,
              stepdh: true,
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
  }, 1500),
  exchange: util.throttle(function(e) {
    const that = this
    var form_id = e.detail.formId;
    var is_dh = that.data.is_dh;
    var step = that.data.step;
    var money = (step / 5000).toFixed(2);
    that.data.ra = money;
    that.setData({
      dhcg: true,
    })
    if (step < 50) {
      wx.showModal({
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
    } else if (is_dh == 1) {
      wx.showModal({
        title: '热力币兑换',
        content: `你将消耗${step}步，兑换${money}个热力币，确认兑换？`,
        success: function(res) {
          if (res.confirm) {
            if (that.data.step_ad == 0) {
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
                        money: money,
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
            } else {
              wx.request({
                url: app.globalData.base_url + '/ad_setp_type',
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
                  console.log(123, res)
                  that.setData({
                    stepdh: false,
                    x_times: res.data.x_times,
                    ad_data: res.data.ad.ad_data
                  })
                }
              })
            }
          } else if (res.cancel) {
            that.setData({
              dhcg: false,
            })
          }
        }
      })
    } else if (is_dh == 2) {
      wx.showModal({
        content: '今日步数兑换已达上限，明天再兑换吧',
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
      wx.showModal({
        content: '暂无获取到步数，请重新获取',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            that.setData({
              dhcg: false,
            })
            that.onShow();
          }
        }
      })
    }
  }, 1500),
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
                        console.log(res)
                        if (res.data.status == 1) {
                          that.data.is_dh = res.data.is_dh;
                          that.setData({
                            isOpenWXRun: true,
                            step: res.data.data,
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

  navigateToAd: function(e) {
    const that = this;
    that.data.seat = e.target.dataset.seat;
    const plate = e.target.dataset.plate;
    that.data.plate = plate;
    const ad_data = that.data.ad_data;
    const ad_id = ad_data.ad_id;
    var x_times = that.data.x_times;
    var rand_rlb = that.data.rand_rlb;
    var ra = that.data.ra;
    if (ad_data.way == 1) {
      wx.navigateToMiniProgram({
        appId: ad_data.appid,
        path: ad_data.path,
        envVersion: 'develop',
        success(res) {
          wx.request({
            url: base_url + '/back_adv',
            data: {
              openid: wx.getStorageSync('openid'),
              type: 1,
              ad_id: ad_id,
              plate: plate,
              ra: ra,
              ratio: x_times
            },
            method: 'GET',
            header: {
              'content-type': 'application/json'
            },
            success: function(res) {
              console.log('跳转成功', res)
              that.setData({
                dhcg: false,
                sign: true,
                stepdh: true,
                luck: true,
              })
              that.data.flow = true;
            }
          })
        }
      })
    } else {
      if (plate == 1) {
        var step = that.data.step;
        wx.navigateTo({
          url: '../../other/erweima/index?ad_id=' + ad_id + '&&plate=' + plate + '&&ra=' + ra + '&&x_times=' + x_times + '&&step=' + step,
        })
      } else if (plate == 3) {
        wx.navigateTo({
          url: '../../other/erweima/index?ad_id=' + ad_id + '&&plate=' + plate + '&&rand_rlb=' + rand_rlb,
        })
      } else {
        wx.navigateTo({
          url: '../../other/erweima/index?ad_id=' + ad_id + '&&plate=' + plate,
        })
      }
      that.setData({
        sign: true,
        stepdh: true,
        luck: true,
        dhcg: false,
      })
    }

  },
  goSignForm: util.throttle(function(e) {
    const that = this;
    var form_id = e.detail.formId;
    that.setData({
      yiqd: true,
    }, () => {
      wx.request({
        url: app.globalData.base_url + '/sign_ad',
        data: {
          form_id: form_id,
          openid: wx.getStorageSync('openid')
        },
        success: function(res) {
          console.log('签到', res)
          that.music();
          that.setData({
            sign: false,
            today_rlb: res.data.today_rlb,
            tomorrow_rlb: res.data.receive_rlb,
            dayed: res.data.count_day,
            ad_data: res.data.ad.ad_data
          })
          that.onShow();
        }
      })
    })
  }, 1500),

  rule: util.throttle(function(e) {
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
          url: '../../other/rule/index',
        })
      }
    })
  }, 1500),
  authorizeNows: function(e) {
    const that = this;
    if (that.data.openid) {
      app.yqLogin(function(res) {
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
      app.onLogin(function(res) {
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
  chengzhong: util.throttle(function(e) {
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
  }, 1500),
  zlactive: function() {
    wx.navigateTo({
      url: '../../main/zlGoods/index',
    })
  },
  newUserLingqus: function() {
    const that = this;
    if (that.data.openid) {
      app.xrLogin(function(res) {
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
      app.onLogin(function(res) {
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
  golqnew: util.throttle(function(e) {
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
  }, 1500),

  goHeat: util.throttle(function(e) {
    var that = this;
    if (wx.getStorageSync('openid') && wx.getStorageSync('open_id') != 0) {
      that.setData({
        share: true,
        trysuc: true,
        clickedsuc: false,
      })
      wx.navigateTo({
        url: '../../main/heatMoney/index',
      })
    } else {
      that.authorizeNow();
    }
  }, 2000),

  sfxr: util.throttle(function(e) {
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
        that.onShow();
      }
    })
  }, 1500),
  sfxrs: util.throttle(function(e) {
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
        that.onShow();
      }
    })
  }, 1500),
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
  gotoZhuanpan: util.throttle(function() {
    wx.navigateTo({
      url: '../../main/turntable/index',
    })
  }, 1500),
  zlDetail: util.throttle(function(e) {
    var form_id = e.detail.formId;
    var id = e.detail.target.dataset.id;
    wx.navigateTo({
      url: '../../main/oneDetail/index?id=' + id + '&&form_id=' + form_id + '&&parements=ss',
    })
  }, 1500),
  xrDetail: util.throttle(function(e) {
    var form_id = e.detail.formId;
    var id = e.detail.target.dataset.id;
    wx.navigateTo({
      url: '../../main/newDetail/index?id=' + id + '&&form_id=' + form_id + '&&parements=ss',
    })
  }, 1500),
  freeDetail: util.throttle(function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../main/detail/index?id=' + id + '&&parements=ss',
    })
  }, 1500),
  seeMore: function() {
    wx.navigateTo({
      url: '../../main/moreGoods/index',
    })
  },
  seezlMore: function() {
    wx.navigateTo({
      url: '../../main/zlGoods/index',
    })
  },
  seexrMore: function() {
    wx.navigateTo({
      url: '../../main/xrGoods/index',
    })
  },
  gotoRule: function() {
    wx.navigateTo({
      url: '../../main/rule/index',
    })
  },

  analysis: util.throttle(function() {
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
      that.authorizeNow();
    }

  }, 1500),
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
  }, 1500),
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
  shouquan: function() {
    const that = this;
    that.setData({
      shouquan: true,
      shouIndex: false,
    })
  },
  random: function() {
    const that = this;
    wx.request({
      url: app.globalData.base_url + '/home_lucky_ad',
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
          luck: false,
          rand_rlb: res.data.rand_rlb,
          ad_data: res.data.ad.ad_data
        })
      }
    })
  },
  openluck: util.throttle(function(e) {
    const that = this;
    videoAd.show().catch(err => {
      //失败重试
      videoAd.load().then(()=>{
        videoAd.show();
      })
    })
    videoAd.onClose((status) => {
      if (status && status.isEnded) {
        that.music();
        wx.request({
          url: app.globalData.base_url + '/incentive',
          data: {
            success: 1,
            openid: wx.getStorageSync('openid')
          },
          success: function(res) {
            console.log(321, res)
            that.onShow();
          }
        })
      } else {
        return
      }
    })
  }, 1500),

  opengz: function() {
    this.setData({
      gzjl: false,
    })
  },
  openadd: function() {
    let that = this;
    wx.request({
      url: app.globalData.base_url + '/is_add03',
      data: {
        openid: wx.getStorageSync('openid')
      },
      success: function(res) {
        that.setData({
          tjjl: false
        })
      }
    })
  },
  continueplay: function() {
    const that = this;
    if (that.data.seat == 12) {
      that.setData({
        sign: false,
        tryfail: true,
        clickedfail: false
      })
    } else if (that.data.seat == 11) {
      that.setData({
        stepdh: false,
        tryfail: true,
        clickedfail: false
      })
    } else if (that.data.seat == 13) {
      that.setData({
        luck: false,
        tryfail: true,
        clickedfail: false
      })
    }
  },
  addclick: function() {
    const that = this;
    that.setData({
      tjjl: true,
      addmy: false,
    })
  },
  gzclick: function() {
    const that = this;
    that.setData({
      gzjl: true,
      contact: false,
    })
  },
  hideHandle: function() {
    const that = this;
    that.setData({
      share: true,
      perMessage: true,
      sign: true,
      addmy: true,
      contact: true,
      tjjl: true,
      gzjl: true,
      luck: true,
      tryfail: true,
      clickedfail: false,
      stepdh: true,
      dhcg: false,
    })
    that.data.flow = false;
  },
  hidesuc: function() {
    const that = this;
    that.setData({
      trysuc: true,
      clickedsuc: false,
    })
    that.onShow();
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
      imageUrl: '../../../imgs/share.png',
      path: '/pages/tarbar/index/index?openid=' + openid + '&&jx=55'
    }
  },
})