// pages/detail/index.js
const Page = require('../../utils/ald-stat.js').Page;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    foot: true,
    noEnough:true,
    goods_id: '',
    button_state: 0,
    addinfo_state: '',
    goods: '',
    addinfo: '',
    isHaveopenid: '',
    disabled: false,
    record: '',
    address: '',
    content: '',
    my_currency:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that=this;
    that.setData({
      goods_id: options.id
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    const that = this;
    var goods_id = that.data.goods_id;
    if (wx.getStorageSync('openid')) {
      that.setData({
        isHaveopenid: true,
      })
      var openid = wx.getStorageSync('openid')
    } else {
      var openid = 0;
      that.setData({
        isHaveopenid: false
      })
    }
    wx.request({
      url: app.globalData.base_url + '/free_goods_detail',
      data: {
        goods_id: goods_id,
        openid: openid
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res)
        that.setData({
          addinfo_state: res.data.addinfo_state,
          record: res.data.record,
          goods: res.data.goods,
          content: res.data.content,
          button_state: res.data.button_state,
          my_currency: res.data.my_currency,
        })
        if (res.data.addinfo_state == 1) {
          that.setData({
            addinfo: res.data.addinfo,
          })
        }
      }
    })
  },

  authorizeNow: function(e) {
    var that = this;
    app.onLogin(function(res) {
      if (res) {
        that.onShow()
      }
    });
    if (e.detail.errMsg == "getUserInfo:ok") {
      that.setData({
        isHaveopenid: true,
      })
    }
  },
  freExchange: function(e) {
    var that = this;
    if (wx.getStorageSync('openid')) {
      if (that.data.goods.num <= 0) {
        wx.showModal({
          title: '提示',
          content: '商品已兑换完',
          showCancel: false
        })
        return
      } else {
        that.setData({
          foot: false,
        })
      }
    } else {
      app.onLogin(function(res) {
        if (res) {
          that.onShow()
        }
      });
    }
  },
  goAddress: function() {
    var that = this;
    var addinfo_state = that.data.addinfo_state;
    if (addinfo_state == 1) {
      wx.navigateTo({
        url: '/pages/editAdd/index',
      })
    } else {
      var address = that.data.address;
      var name = address.userName;
      var phone = address.telNumber;
      var detail_address = address.detailInfo;
      var ssq = address.provinceName + ',' + address.cityName + ',' + address.countyName;
      wx.request({
        url: app.globalData.base_url + '/editor',
        data: {
          name: name,
          detail_address: detail_address,
          address: ssq,
          phone: phone,
          openid: wx.getStorageSync('openid')
        },
        success: function(res) {
          wx.navigateTo({
            url: '/pages/editAdd/index',
          })
        }
      })
    }

  },
  editAddress: function(e) {
    var that = this;
    wx.chooseAddress({
      success: function(res) {
        that.setData({
          address: res
        })
      },
      fail: function(rs) {
        wx.getSetting({
          success(res) {
            if (!res.authSetting['scope.address']) {
              wx.showModal({
                title: '提示',
                content: '获取地址失败，请重新授权！',
                success: function(re) {
                  if (re.confirm) {
                    wx.openSetting({
                      success: (res) => {
                        if (res.authSetting['scope.address']) {
                          wx.chooseAddress({
                            success: function(res) {
                              that.setData({
                                address: res
                              })
                            }
                          })
                        }
                      }
                    })
                  }
                }
              })
            } else {
              return
            }
          }
        })
      },
    })
    // wx.navigateTo({
    //   url: '/pages/editAdd/index',
    // })
  },

  goChange: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    if (wx.getStorageSync('openid') && wx.getStorageSync('open_id') != 0) {
      wx.request({
        url: app.globalData.base_url + '/goods_tk',
        data: {
          goods_id: id,
          openid: wx.getStorageSync('openid')
        },
        success: function (res) {
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
      app.onLogin(function (res) {
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
  affirm: function(e) {
    var that = this;
    var form_id = e.detail.formId;
    var goods_id = that.data.goods_id;
    var addinfo_state = that.data.addinfo_state;
    if (addinfo_state == 1) {
      var addinfo = that.data.addinfo;
      var name = addinfo.userName;
      var phone = addinfo.telNumber;
      var ssq = addinfo.address;
      var detail_address = addinfo.detailInfo;
    } else {
      var address = that.data.address;
      var name = address.userName;
      var phone = address.telNumber;
      var detail_address = address.detailInfo;
      var ssq = address.provinceName + ',' + address.cityName + ',' + address.countyName;
    }
    if (address || addinfo_state == 1) {
      wx.showModal({
        title: '确认兑换',
        content: '若收货信息填写有误，导致礼品退回，将不再补寄！确认兑换？',
        success: function(res) {
          if (res.confirm) {
            that.setData({
              disabled: true,
            })
            wx.request({
              url: app.globalData.base_url + '/duihuan_goods',
              data: {
                name: name,
                phone: phone,
                detail_address: detail_address,
                address: ssq,
                form_id: form_id,
                goods_id: goods_id,
                openid: wx.getStorageSync('openid')
              },
              method: 'GET',
              header: {
                'content-type': 'application/json'
              },
              success: function(res) {
                const orderId = res.data.order_id;
                wx.redirectTo({
                  url: '/pages/success/index?orderId=' + orderId,
                })
                that.setData({
                  foot: true,
                })
              }
            })
          }
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '收货地址未填写',
        showCancel: false,
        success: function(res) {}
      })
    }
  },

  hideHandle:function(){
    this.setData({
      foot: true,
      noEnough: true,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    var openid = wx.getStorageSync('openid')
    var nickname = wx.getStorageSync('nickname')

    return {
      title: `${nickname}邀请你用步数免费换礼物，数量有限，先到先得！`,
      imageUrl: '../../imgs/share.png',
      path: '/pages/index/index?openid=' + openid
    }
  },
})