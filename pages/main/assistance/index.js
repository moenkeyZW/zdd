// pages/assistance/index.js
const Page = require('../../../utils/ald-stat.js').Page;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dhgood: '',
    goods: '',
    percent: 0,
    timers: '',
    clock: [],
    numArr: '',
    telephone: true,
    foot: true,
    addinfo: '',
    address: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    const that = this;
    wx.request({
      url: app.globalData.base_url + '/my_zhuli03',
      data: {
        openid: wx.getStorageSync('openid')
      },
      method: 'GET',
      header: {
        'content-type': 'application/json; charset=utf-8', // 默认值
        'Cache-Control': 'max-age=60,public', //60秒
      },
      success: function(res) {
        console.log(res)
        that.setData({
          goods: res.data.goods_help,
        })
        var yqfriend = false;
        var numArr = [];
        if (res.data.goods_help.length > 0) {
          for (var i = 0; i < res.data.goods_help.length; i++) {
            if (res.data.goods_help[i].button_state == 0) {
              var timenow = Number(res.data.goods_help[i].timeline) + 24 * 60 * 60; //获取数据中的时间戳 
              let second = timenow - (Date.parse(new Date()) / 1000);
              numArr.push(second);
              yqfriend = true;
            } else {
              numArr.push('0');
            }
          }
          that.setData({
            numArr: numArr
          })
        }
        if (yqfriend) {
          that.nowTime();
        }
      }
    })

  },

  nowTime: function() {
    let that = this;
    var numArr = that.data.numArr;
    const tim = setInterval(function() {
      var clockArr = [];
      numArr.map((second, index) => {
        if (second != 0) {
          second--;
          numArr[index] = second;
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
          clockArr.push(timeline);
        } else {
          clockArr.push('0')
        }
      })
      that.setData({
        clock: clockArr
      })
    }, 1000)
    that.setData({
      timers: tim
    })
  },

  onHide: function() {
    clearInterval(this.data.timers);
  },
  onUnload: function() {
    clearInterval(this.data.timers);
  },
  goMoreGooods: function() {
    wx.navigateTo({
      url: '/pages/main/zlGoods/index',
    })
  },
  gotoDh: function(e) {
    const that = this;
    var id = e.currentTarget.dataset.id;
    var num = e.currentTarget.dataset.num;
    const dh = 100;
    if (num <= 0) {
      wx.showModal({
        title: '提示',
        content: '商品已兑换完',
        showCancel: false
      })
      return
    } else {
      wx.request({
        url: app.globalData.base_url + '/my_zhuli_tc',
        data: {
          openid: wx.getStorageSync('openid'),
          goods_id: id,
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          console.log(res)
          that.setData({
            addinfo: res.data.addinfo,
            dhgood: res.data.goods,
          })
          if (res.data.goods.type == 0 || res.data.goods.type == 1 || res.data.goods.type == 4) {
            that.setData({
              foot: false,
            })
          } else {
            that.setData({
              telephone: false,
            })
          }
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
  },
  goAddress: function() {
    var that = this;
    if (that.data.addinfo) {
      wx.navigateTo({
        url: '/pages/main/editAdd/index',
      })
      that.setData({
        foot: true,
        telephone: true,
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
        success: function (res) {
          wx.navigateTo({
            url: '/pages/main/editAdd/index',
          })
          that.setData({
            foot: true,
            telephone: true,
          })
        }
      })
    }
  },
  affirmPhone: function(e) {
    const that = this;
    that.setData({
      disableds: true,
    })
    var form_id = e.detail.formId;
    var goods_id = that.data.dhgood.id;
    var phone = e.detail.value.phone;
    if (phone.length !== 11) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的电话号码',
        showCancel: false,
        success: function(res) {
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
        success: function(res) {
          if (res.confirm) {
            that.setData({
              disableds: false,
            })
          }
        }
      })
      return;
    }
    if (phone && (that.data.dhgood.type == 6 || that.data.dhgood.type == 7)) {
      wx.showModal({
        title: '确认充值',
        content: '若充值号码填写有误，导致充值失败，将不再重新充值！确认充值？',
        success: function(res) {
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
              success: function(res) {
                const orderId = res.data.order_id;
                wx.redirectTo({
                  url: '/pages/main/dhcg/index?orderId=' + orderId + '&&num=10086',
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
        success: function(res) {
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
              success: function(res) {
                const orderId = res.data.order_id;
                wx.redirectTo({
                  url: '/pages/main/dhcg/index?orderId=' + orderId + '&&num=10086',
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
        success: function(res) {}
      })
    }
  },
  affirm: function(e) {
    const that = this;
    that.setData({
      disabled: true,
    })
    var form_id = e.detail.formId;
    var goods_id = that.data.dhgood.id;
    if (that.data.addinfo) {
      var addinfo = that.data.addinfo;
      var name = addinfo.userName;
      var phone = addinfo.telNumber;
      var ssq = addinfo.address;
      var detail_address = addinfo.detailInfo;
      var province = ssq.split(',')[0];
    } else {
      var address = that.data.address;
      var name = address.userName;
      var phone = address.telNumber;
      var detail_address = address.detailInfo;
      var ssq = address.provinceName + ',' + address.cityName + ',' + address.countyName;
      var province = address.provinceName;
    }
    if (province == "内蒙古自治区" || province == "辽宁省" | province == "吉林省" || province == "黑龙江省" || province == "西藏自治区" || province == "甘肃省" || province == "宁夏回族自治区" || province == "新疆维吾尔自治区" || province == "台湾省" || province == "香港特别行政区" || province == "澳门特别行政区" || province == "青海省") {
      wx.showModal({
        title: '提示',
        content: `${province}暂不支持邮寄`,
        showCancel: false,
        success: function(res) {
          that.setData({
            disabled: false,
          })
        }
      })
      return
    } else {
      if (address || addinfo) {
        wx.showModal({
          title: '确认兑换',
          content: '若收货信息填写有误，导致礼品退回，将不再补寄！确认兑换？',
          success: function(res) {
            if (res.confirm) {
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
                    url: '/pages/main/dhcg/index?orderId=' + orderId,
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
          success: function(res) {
            that.setData({
              disabled: false,
            })
          }
        })
      }
    }

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
    const photo = res.target.dataset.photo;
    const openid = wx.getStorageSync('openid')
    const goods_id = res.target.dataset.id;
    return {
      title: '我正在用步数免费换礼品，就差你的一臂之力了！',
      imageUrl: photo,
      path: '/pages/tarbar/index/index?openid=' + openid + '&&goods_id=' + goods_id + '&&zl=66'
    }
  },
})