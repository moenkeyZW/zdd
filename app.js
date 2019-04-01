//app.js
const App = require('./utils/ald-stat.js').App;
App({
  onLaunch: function (options) {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  onShow: function (options) {
    this.globalData.scene = options.scene;
  },
  onRun: function (cb) {
    var that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.werun']) {
          that.globalData.isOpenWXRun = false;
        } else {
          if (!wx.getStorageSync('session')) {
            that.globalData.isOpenWXRun = false;
          } else {
            wx.checkSession({
              success: function () {
                wx.getWeRunData({
                  success(res) {
                    wx.request({
                      url: that.globalData.base_url + '/wxrun',
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
                      success: function (res) {
                        console.log(21, res)
                        if (res.data.status == 1) {
                          that.globalData.isOpenWXRun = true;
                          that.globalData.wxRunData = res.data;
                          typeof cb == "function" && cb(res.data);
                        } else {
                          that.globalData.isOpenWXRun = false;
                          wx.login({
                            success: res => {
                              wx.getUserInfo({
                                withCredentials: true,
                                success: function (res_user) {
                                  wx.request({
                                    url: that.globalData.base_url + '/login03',
                                    data: {
                                      auth_type:0,
                                      scene_value: 0,
                                      code: res.code,
                                      encryptedData: encodeURIComponent(res_user.encryptedData),
                                      iv: encodeURIComponent(res_user.iv)
                                    },
                                    method: 'GET',
                                    header: {
                                      'content-type': 'application/json'
                                    },
                                    success: function (res) {
                                      that.globalData.userInfo = res.data.userinfo;
                                      wx.setStorageSync('session', res.data.hash);
                                      wx.setStorageSync('openid', res.data.openid);
                                      wx.setStorageSync('open_id', res.data.open_id);
                                      typeof cb == "function" && cb(that.globalData.userInfo);
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
              fail: function () {
                wx.login({
                  success: res => {
                    if (res.code) {
                      wx.getUserInfo({
                        withCredentials: true,
                        success: function (res_user) {
                          wx.request({
                            url: that.globalData.base_url + '/login03',
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
                            success: function (res) {
                              that.globalData.userInfo = res.data.userinfo;
                              wx.setStorageSync('session', res.data.hash);
                              wx.setStorageSync('openid', res.data.openid);
                              wx.setStorageSync('open_id', res.data.open_id);
                              typeof cb == "function" && cb(that.globalData.userInfo);
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
  onLogins: function (cb) {
    var that = this;
    wx.checkSession({
      success: function (res) {
        if (wx.getStorageSync('openid') && wx.getStorageSync('open_id') != 0) {
          that.onRefreshs(cb);
        } else {
          wx.login({
            success: res => {
              if (res.code) {
                wx.getUserInfo({
                  withCredentials: true,
                  success: function (res_user) {
                    wx.request({
                      url: that.globalData.base_url + '/login03',
                      data: {
                        auth_type: 0,
                        scene_value: 1,
                        code: res.code,
                        encryptedData: encodeURIComponent(res_user.encryptedData),
                        iv: encodeURIComponent(res_user.iv)
                      },
                      method: 'GET',
                      header: {
                        'content-type': 'application/json'
                      },
                      success: function (res) {
                        console.log(1, res)
                        that.globalData.userInfo = res.data.userinfo;
                        wx.setStorageSync('session', res.data.hash);
                        wx.setStorageSync('openid', res.data.openid);
                        wx.setStorageSync('open_id', res.data.open_id);
                        typeof cb == "function" && cb(that.globalData.userInfo);
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
      },
      fail: function () {
        wx.login({
          success: res => {
            if (res.code) {
              wx.getUserInfo({
                withCredentials: true,
                success: function (res_user) {
                  wx.request({
                    url: that.globalData.base_url + '/login03',
                    data: {
                      auth_type: 0,
                      scene_value: 1,
                      code: res.code,
                      encryptedData: encodeURIComponent(res_user.encryptedData),
                      iv: encodeURIComponent(res_user.iv)
                    },
                    method: 'GET',
                    header: {
                      'content-type': 'application/json'
                    },
                    success: function (res) {
                      console.log(2, res)
                      that.globalData.userInfo = res.data.userinfo;
                      wx.setStorageSync('session', res.data.hash);
                      wx.setStorageSync('openid', res.data.openid);
                      wx.setStorageSync('open_id', res.data.open_id);
                      typeof cb == "function" && cb(that.globalData.userInfo);
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
  },
  onLogin: function (cb) {
    var that = this;
    wx.checkSession({
      success: function (res) {
        if (wx.getStorageSync('openid') && wx.getStorageSync('open_id') != 0) {
          that.onRefresh(cb);
        } else {
          wx.login({
            success: res => {
              if (res.code) {
                wx.getUserInfo({
                  withCredentials: true,
                  success: function (res_user) {
                    wx.request({
                      url: that.globalData.base_url + '/login03',
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
                      success: function (res) {
                        console.log(3, res)
                        that.globalData.userInfo = res.data.userinfo;
                        wx.setStorageSync('session', res.data.hash);
                        wx.setStorageSync('openid', res.data.openid);
                        wx.setStorageSync('open_id', res.data.open_id);
                        typeof cb == "function" && cb(that.globalData.userInfo);
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
      },
      fail: function () {
        wx.login({
          success: res => {
            if (res.code) {
              wx.getUserInfo({
                withCredentials: true,
                success: function (res_user) {
                  wx.request({
                    url: that.globalData.base_url + '/login03',
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
                    success: function (res) {
                      console.log(4, res)
                      that.globalData.userInfo = res.data.userinfo;
                      wx.setStorageSync('session', res.data.hash);
                      wx.setStorageSync('openid', res.data.openid);
                      wx.setStorageSync('open_id', res.data.open_id);
                      typeof cb == "function" && cb(that.globalData.userInfo);
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
  },
  //新人登录领币
  xrLogin: function (cb) {
    var that = this;
    wx.checkSession({
      success: function (res) {
        if (wx.getStorageSync('openid') && wx.getStorageSync('open_id') != 0) {
          that.onRefresh(cb);
        } else {
          wx.login({
            success: res => {
              if (res.code) {
                wx.getUserInfo({
                  withCredentials: true,
                  success: function (res_user) {
                    wx.request({
                      url: that.globalData.base_url + '/login04',
                      data: {
                        auth_type: 1,
                        scene_value: 0,
                        code: res.code,
                        encryptedData: encodeURIComponent(res_user.encryptedData),
                        iv: encodeURIComponent(res_user.iv)
                      },
                      method: 'GET',
                      header: {
                        'content-type': 'application/json'
                      },
                      success: function (res) {
                        console.log(3, res)
                        that.globalData.userInfo = res.data.userinfo;
                        wx.setStorageSync('session', res.data.hash);
                        wx.setStorageSync('openid', res.data.openid);
                        wx.setStorageSync('open_id', res.data.open_id);
                        typeof cb == "function" && cb(that.globalData.userInfo);
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
      },
      fail: function () {
        wx.login({
          success: res => {
            if (res.code) {
              wx.getUserInfo({
                withCredentials: true,
                success: function (res_user) {
                  wx.request({
                    url: that.globalData.base_url + '/login04',
                    data: {
                      auth_type: 1,
                      scene_value: 0,
                      code: res.code,
                      encryptedData: encodeURIComponent(res_user.encryptedData),
                      iv: encodeURIComponent(res_user.iv)
                    },
                    method: 'GET',
                    header: {
                      'content-type': 'application/json'
                    },
                    success: function (res) {
                      console.log(4, res)
                      that.globalData.userInfo = res.data.userinfo;
                      wx.setStorageSync('session', res.data.hash);
                      wx.setStorageSync('openid', res.data.openid);
                      wx.setStorageSync('open_id', res.data.open_id);
                      typeof cb == "function" && cb(that.globalData.userInfo);
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
  },
  yqLogin: function (cb) {
    var that = this;
    wx.checkSession({
      success: function (res) {
        if (wx.getStorageSync('openid') && wx.getStorageSync('open_id') != 0) {
          that.onRefresh(cb);
        } else {
          wx.login({
            success: res => {
              if (res.code) {
                wx.getUserInfo({
                  withCredentials: true,
                  success: function (res_user) {
                    wx.request({
                      url: that.globalData.base_url + '/login03',
                      data: {
                        auth_type: 1,
                        scene_value: 0,
                        code: res.code,
                        encryptedData: encodeURIComponent(res_user.encryptedData),
                        iv: encodeURIComponent(res_user.iv)
                      },
                      method: 'GET',
                      header: {
                        'content-type': 'application/json'
                      },
                      success: function (res) {
                        console.log(3, res)
                        that.globalData.userInfo = res.data.userinfo;
                        wx.setStorageSync('session', res.data.hash);
                        wx.setStorageSync('openid', res.data.openid);
                        wx.setStorageSync('open_id', res.data.open_id);
                        typeof cb == "function" && cb(that.globalData.userInfo);
                        wx.reLaunch({
                          url: '/pages/index/index',
                        })
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
      },
      fail: function () {
        wx.login({
          success: res => {
            if (res.code) {
              wx.getUserInfo({
                withCredentials: true,
                success: function (res_user) {
                  wx.request({
                    url: that.globalData.base_url + '/login03',
                    data: {
                      auth_type: 1,
                      scene_value: 0,
                      code: res.code,
                      encryptedData: encodeURIComponent(res_user.encryptedData),
                      iv: encodeURIComponent(res_user.iv)
                    },
                    method: 'GET',
                    header: {
                      'content-type': 'application/json'
                    },
                    success: function (res) {
                      console.log(4, res)
                      that.globalData.userInfo = res.data.userinfo;
                      wx.setStorageSync('session', res.data.hash);
                      wx.setStorageSync('openid', res.data.openid);
                      wx.setStorageSync('open_id', res.data.open_id);
                      typeof cb == "function" && cb(that.globalData.userInfo);
                    
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
  },
 
  onRefresh: function (cb) {
    var that = this;
    wx.checkSession({
      success: function (res) {
        if (wx.getStorageSync('openid')) {
          wx.request({
            url: that.globalData.base_url + '/login_info',
            data: {
              scene_value: 0,
              openid: wx.getStorageSync('openid'),
            },
            method: 'GET',
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              that.globalData.userInfo = res.data.userinfo;
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        } else {
          that.onLogin(cb);
        }
      },
      fail: function (res) {
        that.onLogin(cb);
      },
    })
  },
  onRefreshs: function (cb) {
    var that = this;
    wx.checkSession({
      success: function (res) {
        if (wx.getStorageSync('openid')) {
          wx.request({
            url: that.globalData.base_url + '/login_info',
            data: {
              scene_value: 1,
              openid: wx.getStorageSync('openid'),
            },
            method: 'GET',
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              that.globalData.userInfo = res.data.userinfo;
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        } else {
          that.onLogins(cb);
        }
      },
      fail: function (res) {
        that.onLogins(cb);
      },
    })
  },
  globalData: {
    base_url: "https://www.mnancheng.com/admin/wechat",
    isOpenWXRun: null,
    wxRunData: null,
    userInfo: null,
    scene: null
  },
})