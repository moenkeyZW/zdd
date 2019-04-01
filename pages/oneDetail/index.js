// pages/detail/index.js
const Page = require('../../utils/ald-stat.js').Page;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curIndex: 0,
    openid: '',
    haveFriend: false,
    foot: true,
    telephone: true,
    goods_id: '',
    button_state: 3,
    addinfo_state: '',
    goods: '',
    addinfo: '',
    isHaveopenid: '',
    disabled: false,
    disableds: false,
    record: '',
    address: '',
    content: '',
    my_currency: '',
    needNum: '',
    readyNum: '',
    dh: '',
    goods_help: '',
    timeline: '00:00:00',
    timer: '', //定时器名字
    second:'',
    form_id:'',
    parements:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    const that = this;
    that.setData({
      parements: options.parements,
      goods_id: options.id,
    })
    if (options.dh) {
      that.setData({
        dh: options.dh,
      })
    }
    if(options.form_id){
      that.setData({
        form_id: options.form_id
      })
    }
  },

  imageLoad: function (e) {
    wx.hideLoading();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    const that = this;
    var goods_id = that.data.goods_id;
    var form_id = that.data.form_id;
    var parements = that.data.parements;
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
      url: app.globalData.base_url + '/zl_goods_detail03',
      data: {
        parements: parements,
        goods_id: goods_id,
        openid: openid,
        form_id: form_id
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res)
        that.setData({
          goods_help: res.data.goods_help,
          addinfo_state: res.data.addinfo_state,
          goods: res.data.goods,
          needNum: res.data.number2,
          readyNum: res.data.number1,
          haveFriend: res.data.friends,
          content: res.data.content,
          button_state: res.data.button_state,
          my_currency: res.data.my_currency,
        })
        if (that.data.dh && (res.data.goods.type == 3 || res.data.goods.type == 5 || res.data.goods.type == 6 || res.data.goods.type == 7||res.data.goods.type == 8) ) {
          that.setData({
            telephone: false,
          })
        } else if (that.data.dh &&(res.data.goods.type == 0 || res.data.goods.type == 1||res.data.goods.type==4)) {
          that.setData({
            foot: false,
          })
        }
        if (res.data.goods_help) {
          that.countDown();
        }
        if (res.data.addinfo_state == 1) {
          that.setData({
            addinfo: res.data.addinfo,
          })
        }
      }
    })
  },
 
  countDown: function() {
    const that = this;
    var timenow = Number(that.data.goods_help.timeline)+ 24 * 60 * 60;
    let second = timenow - (Date.parse(new Date()) / 1000) ; //获取倒计时初始值
    that.setData({
      timer: setInterval(function() {
        second--;
        // 小时位   
        var hr = Math.floor(second / 3600);
        var hrStr = hr.toString();
        if (hrStr.length == 1) hrStr = '0' + hrStr;
        // 分钟位  
        var min = Math.floor(second / 60 % 60);
        var minStr = min.toString();
        if (minStr.length == 1) minStr = '0' + minStr;
        // 秒位  
        var sec = Math.floor(second % 60);
        var secStr = sec.toString();
        if (secStr.length == 1) secStr = '0' + secStr;
        var timeline = hrStr + ":" + minStr + ":" + secStr;
        that.setData({
          timeline: timeline
        })
        if (second <= 0) {
          //因为timer是存在data里面的，所以在关掉时，也要在data里取出后再关闭
          clearInterval(that.data.timer);
        }
      }, 1000)
    })
  },
  onHide: function() {
    clearInterval(this.data.timer);
  },
  onUnload:function(){
    clearInterval(this.data.timer);
  },
  tabHandle: function (e) {
    const that = this
    var goods_id = that.data.goods_id;
    const index = e.target.dataset.index
    if (that.data.curIndex === index) return
    that.setData({
      curIndex: index,
    }, () => {
      if (index === 0) {

      } else {
        //请求第一页体重记录
        wx.request({
          url: app.globalData.base_url + '/goods_dh_list03',
          data: {
            goods_id: goods_id,
          },
          method: 'GET',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res)
            that.setData({
              record: res.data.record
            })
          }
        })
      }
    })
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
      } else if (that.data.goods.type == 3 || that.data.goods.type == 5 || that.data.goods.type == 6||that.data.goods.type == 7  || that.data.goods.type == 8){
        that.setData({
          telephone: false,
        })
      } else {
        that.setData({
          foot: false,
        })
      }
    } else {
      app.onLogin(function(res) {
        wx.showLoading({
          title: '授权中',
        })
        if (res) {
          wx.hideLoading();
          that.onShow();
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
  goIndex: function() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  goChangeRecord: function() {
    const that = this;
    const goods_id = that.data.goods.id;
    wx.navigateTo({
      url: '/pages/changeRecord/index?goods_id=' + goods_id,
    })
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
  },

  affirmPhone: function (e) {
    const that = this;
    that.setData({
      disableds: true,
    })
    var form_id = e.detail.formId;
    var goods_id = that.data.goods_id;
    var phone = e.detail.value.phone;
    if (phone.length !== 11) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的电话号码',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            that.setData({
              disableds: false,
            })
          }
        }
      })
      return;
    }
    var myreg = /^0{0,1}(13[0-9]|15[0-9]|18[0-9]|14[0-9]|17[0,1,2,4,5,6,8,9]|19[8-9]|16[6])[0-9]{8}$/;
    if (!myreg.test(phone)) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的电话号码',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            that.setData({
              disableds: false,
            })
          }
        }
      })
      return;
    }
    if (phone && (that.data.goods.type == 6 || that.data.goods.type == 7)) {
      wx.showModal({
        title: '确认充值',
        content: '若充值号码填写有误，导致充值失败，将不再重新充值！确认充值？',
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: app.globalData.base_url + '/chongzhi_products',
              data: {
                phone: phone,
                form_id: form_id,
                goods_id: goods_id,
                openid: wx.getStorageSync('openid')
              },
              method: 'GET',
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                const orderId = res.data.order_id;
                wx.redirectTo({
                  url: '/pages/dhcg/index?orderId=' + orderId + '&&num=10086',
                })
                that.setData({
                  telephone: true,
                })
              }
            })
          } else if (res.cancel) {
            that.setData({
              disableds: false,
            })
          }
        }
      })
    } else if (phone) {
      wx.showModal({
        title: '确认充值',
        content: '若电话号码填写有误，导致充值失败，将不再重新充值！确认充值？',
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: app.globalData.base_url + '/charge_money',
              data: {
                phone: phone,
                form_id: form_id,
                goods_id: goods_id,
                openid: wx.getStorageSync('openid')
              },
              method: 'GET',
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                const orderId = res.data.order_id;
                wx.redirectTo({
                  url: '/pages/dhcg/index?orderId=' + orderId + '&&num=10086',
                })
                that.setData({
                  telephone: true,
                })
              }
            })
          } else if (res.cancel) {
            that.setData({
              disableds: false,
            })
          }
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '电话号码未填写',
        showCancel: false,
        success: function (res) { }
      })
    }
  },
  affirm: function(e) {
    const that = this;
    that.setData({
      disabled: true,
    })
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
            wx.request({
              url: 'https://www.mnancheng.com/admin/wechat/duihuan_goods',
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
                  url: '/pages/dhcg/index?orderId=' + orderId,
                })
                that.setData({
                  foot: true,
                })
              }
            })
          } else if (res.cancel) {
            that.setData({
              disabled: false,
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
  makeMore:function(){
    wx.navigateTo({
      url: '/pages/step/index',
    })
  },
  hideHandle: function() {
    this.setData({
      foot: true,
      telephone: true,
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    const that = this;
    const openid = wx.getStorageSync('openid')
    const photo = that.data.goods.photo;
    const goods_id = that.data.goods.id;
    const title = that.data.goods.title;
    if (res.from === 'button') {
      wx.request({
        url: app.globalData.base_url + '/zl_ask03',
        data: {
          goods_id: goods_id,
          openid: openid
        },
        success: function(res) {}
      })
    }
    return {
      title: '我正在用步数免费换礼品，就差你的一臂之力了！',
      imageUrl: photo,
      path: '/pages/index/index?openid=' + openid + '&&goods_id=' + goods_id+'&&zl=66'
    }
  },
})