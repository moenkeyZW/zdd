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
    fourRound: [0, 1, 2, 3],
    week: '',
    friendArr: '',
    goods: '',
    isChange: 1,
    noEnough: true,
    register: true,
    measure: true,
    zanwu: true,
    share: true,
    shouquan: true,
    shouIndex: true,
    shareFriend: true,
    // look: false,
    perMessage: true,
    isHaveopenid: '',
    openid: '',
    result: '',
    is_new: true,
    is_rule: true,
    is_sign: true,
    page: 1,
    haveMore: true,
    count_day: '',
    goods_detail: '',
    userInfo: '',
    genderArray: ['男', '女'],
    ageArr: ageArr,
    heightArr: heightArr,
    weightArr: weightArr,
    scene_value: '',
    noMore: true,
    clicked: true,
    clim: true,
    isOpenWXRun: true,
    disab: false,
    first: true,
    second: true,
    third: true,
    is_tishi: '',
    relibi: '',
    dhcg: false,
    is_dh: '',
    compose: false,
    uid: '',
    windowHeight: '',
    windowWidth: '',
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
    var that = this;
    if (options.openid) {
      that.setData({
        openid: options.openid
      })
    }
    if (options.scene) {
      that.setData({
        uid: options.scene
      })
    }

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
      } else if (that.data.uid) {
        var uid = that.data.uid;
        wx.request({
          url: app.globalData.base_url + '/code_friends',
          data: {
            uid: uid,
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
          goods: res.data.goods,
          friendArr: res.data.hy_img,
          result: res.data.result,
          money: res.data.currency,
          scene_value: res.data.scene_value,
          haveMore: true,
          noMore: true,
          page: 1,
          is_sign: res.data.is_sign,
          is_tishi: res.data.is_tishi,
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
        } else {
          if (that.data.is_tishi == 0) {
            that.setData({
              second: false,
            })
          }
        }
        if (!res.data.is_sign) {
          that.setData({
            relibi: res.data.relibi
          })
        }
        if (res.data.is_new == 1) {
          that.setData({
            is_new: true,
          })
        } else {
          that.setData({
            is_new: false,
          })
        }
        if (res.data.is_rule == 1) {
          that.setData({
            is_rule: true,
          })
        } else {
          that.setData({
            is_rule: false,
          })
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
      complete: function(res) {
        that.onShow()
        if (that.data.scene_value == 1) {
          if (that.data.is_tishi == 0) {
            console.log(123)
            that.setData({
              third: false,
            })
          }
        } else {
          if (that.data.is_tishi == 0) {
            that.setData({
              second: false,
            })
          }
        }
      }
    })
  },
  tishiOne: function(e) {
    var that = this;
    that.setData({
      third: true,
      first: false,
    })
  },
  tishiTwo: function(e) {
    var that = this;
    that.setData({
      second: true,
      first: false,
    })
  },
  tishiThree: function(e) {
    var that = this;
    var form_id = e.detail.formId;
    wx.request({
      url: app.globalData.base_url + '/tishi',
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
          first: true,
        })
      }
    })

  },

  // 上拉触底事件，请求记录数据
  onReachBottom: function() {
    const that = this
    let page = that.data.page;
    var isHaveopenid = that.data.isHaveopenid;
    if (isHaveopenid) {
      var openid = wx.getStorageSync('openid')
    } else {
      var openid = 0
    }
    if (that.data.haveMore) {
      // 请求下一页数据
      page++;
      that.data.page = page
      // wx.showLoading({
      //   title: '加载中',
      // })
      wx.request({
        url: app.globalData.base_url + '/down_goods_list',
        data: {
          page: page,
          openid: openid
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          that.data.goods = that.data.goods.concat(res.data.goods);
          that.setData({
            goods: that.data.goods,
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
      //   title: '数据加载完毕',
      //   icon: 'success',
      //   duration: 1500,
      // })
    }
  },
  music: function() {
    innerAudioContext.src = 'https://www.mnancheng.com/Public/home/bj_music.mp3'
    innerAudioContext.play()
  },
  analysis: function(e) {
    var that = this;
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
              perMessage: false,
              userInfo: res.data.res,
            })
          }
        }
      })
    } else {
      app.onLogin(function(res) {
        wx.showLoading({
          title: '授权中',
        })
        if (res) {
          wx.hideLoading();
          that.sportSQ();
        }
      });
      return;
    }
  },
  authorizeNow: function(e) {
    var that = this;
    app.onLogin(function(res) {
      wx.showLoading({
        title: '授权中',
      })
      if (res) {
        wx.hideLoading();
        that.setData({
          shouquan: true,
          shouIndex: false,
        })
        that.sportSQ();
      }
    });
  },
  goSignForm: function(e) {
    var that = this;
    var form_id = e.detail.formId;
    that.setData({
      is_sign: true,
    })
    wx.request({
      url: app.globalData.base_url + '/sign',
      data: {
        form_id: form_id,
        openid: wx.getStorageSync('openid')
      },
      success: function(res) {
        console.log(res)
        that.setData({
          week: res.data.res,
          count_day: res.data.count_day,
        })
        if (res.data.count_day > 0) {
          that.setData({
            register: false,
          })
          that.music();
          that.onShow();
        }
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
      app.onLogin(function(res) {
        wx.showLoading({
          title: '授权中',
        })
        if (res) {
          wx.hideLoading();
          that.sportSQ();
        }
      });
    }
  },
  onDetail: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/detail/index?id=' + id,
    })
  },

  lookFriend: function() {
    wx.navigateTo({
      url: '/pages/friendList/index',
    })
  },
  goAdd: function() {
    wx.navigateTo({
      url: '/pages/address/index',
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
  rule: function(e) {
    var that = this
    wx.request({
      url: app.globalData.base_url + '/rule_explain',
      data: {
        openid: wx.getStorageSync('openid')
      },
      success: function(res) {
        wx.navigateTo({
          url: '/pages/rule/index',
        })
      }
    })
  },
  lingqu: function(e) {
    const that = this;
    if (wx.getStorageSync('openid') && wx.getStorageSync('open_id') != 0) {
      that.music();
      wx.request({
        url: app.globalData.base_url + '/is_new',
        data: {
          openid: wx.getStorageSync('openid')
        },
        success: function(res) {
          that.setData({
            disab: true,
            is_new: true,
          })
          wx.showModal({
            title: '领币成功',
            content: '恭喜您成功领取5热力币，多走步数可兑换更多热力币！',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                that.onShow();
              }
            }
          })
        }
      })
    } else {
      app.onLogin(function(res) {
        wx.showLoading({
          title: '授权中',
        })
        if (res) {
          wx.hideLoading();
          that.sportSQ();
        }
      })
    }
  },
  goChange: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    if (wx.getStorageSync('openid') && wx.getStorageSync('open_id') != 0) {
      wx.request({
        url: app.globalData.base_url + '/goods_tk',
        data: {
          goods_id: id,
          openid: wx.getStorageSync('openid')
        },
        success: function(res) {
          if (res.data.state == 1) {
            that.setData({
              noEnough: false,
              goods_detail: res.data.goods,
            })
          } else {
            wx.navigateTo({
              url: '/pages/detail/index?id=' + id,
            })
          }
        }
      })

    } else {
      app.onLogin(function(res) {
        wx.showLoading({
          title: '授权中',
        })
        if (res) {
          wx.hideLoading();
          that.sportSQ();
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
  wsResult: function(e) {
    let that = this;
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
        wx.navigateTo({
          url: '/pages/analysis/index',
        })
        that.setData({
          perMessage: true,
        })
      }
    })
  },
  heiping:function(){
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
  openShare: function() {
    const that = this
    that.setData({
      shareFriend: false,
    })
  },
  // shouquanxx: function() {
  //   var that = this;

  //   wx.request({
  //     url: app.globalData.base_url + '/code_img',
  //     data: {
  //       openid: wx.getStorageSync('openid')
  //     },
  //     success: function(res) {
  //       wx.showLoading({
  //         title: '生成中',
  //       })
  //       wx.downloadFile({
  //         url: res.data.price,
  //         success: function(res) {
  //           var src = res.tempFilePath
  //           wx.getImageInfo({
  //             src: src,
  //             success: function(res) {
  //               wx.getSystemInfo({
  //                 success: function (res) {
  //                   that.setData({
  //                     windowHeight: res.screenHeight * 2,
  //                     windowWidth: res.screenWidth * 2
  //                   })
  //                   const windowWidth = res.screenWidth
  //                   const windowHeight = res.screenHeight
  //                   const ctx = wx.createCanvasContext('shareCanvas')
  //                   // 底图
  //                   ctx.drawImage('../../imgs/sss.png', 0, 0, windowWidth, windowHeight)
  //                   const qrImgSize = 123
  //                   ctx.drawImage(src, (windowWidth - 123) / 2, windowHeight - 179, qrImgSize, qrImgSize)
  //                   // 播放按钮
  //                   ctx.stroke()
  //                   ctx.draw()
  //                   setTimeout(function () {
  //                     wx.canvasToTempFilePath({
  //                       canvasId: 'shareCanvas',
  //                       success: function (res) {
  //                         wx.uploadFile({
  //                           url: app.globalData.base_url + '/upload_img',
  //                           filePath: res.tempFilePath,
  //                           name: 'file',
  //                           header: {
  //                             "Content-Type": "multipart/form-data",
  //                             'accept': 'application/json',
  //                           },
  //                           success: function (res) {
  //                             console.log(res)
  //                             var imgUrl = res.data;
  //                             wx.getImageInfo({
  //                               src: imgUrl,
  //                               success: function (ret) {
  //                                 var path = ret.path;
  //                                 wx.hideLoading();
  //                                 wx.saveImageToPhotosAlbum({
  //                                   filePath: path,
  //                                   success(result) {
  //                                     wx.showModal({
  //                                       title: '提示',
  //                                       content: '已保存邀请图片至相册，可以分享了',
  //                                       showCancel: false,
  //                                     })
  //                                     that.setData({
  //                                       shareFriend: true,
  //                                     })
  //                                   }
  //                                 })
  //                               }
  //                             })
  //                             that.setData({
  //                               compose: true,
  //                             })
  //                           }
  //                         })
  //                       }
  //                     })
  //                   }, 500)

  //                 }
  //               })
         
  //             }
  //           })
  //         }
  //       })
  //     }
  //   })
  // },
  // shareGroup: function() {
  //   var that = this;
  //   wx.getSetting({
  //     success(res) {
  //       if (!res.authSetting['scope.writePhotosAlbum']) {
  //         wx.authorize({
  //           scope: 'scope.writePhotosAlbum',
  //           success() {
  //             that.shouquanxx();
  //           },
  //           fail() {
  //             wx.showModal({
  //               title: '提示',
  //               content: '授权失败，不能保存到手机相册',
  //               success: function(re) {
  //                 if (re.confirm) {
  //                   wx.openSetting({
  //                     success: (res) => {
  //                       if (res.authSetting['scope.writePhotosAlbum']) {
  //                         that.shouquanxx();
  //                       }
  //                     }
  //                   })
  //                 }
  //               }
  //             })
  //           }
  //         })
  //       } else {
  //         that.shouquanxx();
  //       }
  //     },

  //   })
  // },
  shouquan: function() {
    var that = this;
    that.setData({
      shouquan: true,
      shouIndex: false,
    })
  },
  hideHandle: function() {
    var that = this;
    that.setData({
      noEnough: true,
      register: true,
      perMessage: true,
      share: true,
      shareFriend: true,
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    var that = this;
    that.setData({
      share: true,
    })
    var openid = wx.getStorageSync('openid')
    var nickname = wx.getStorageSync('nickname')
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: `${nickname}邀请你用步数免费换礼物，数量有限，先到先得！`,
      imageUrl: '../../imgs/share.png',
      path: '/pages/index/index?openid=' + openid
    }
  },
})