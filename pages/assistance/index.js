// pages/assistance/index.js
const Page = require('../../utils/ald-stat.js').Page;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: '',
    percent: 0,
    goods_help: '',
    timers: '',
    clock: [],
    i: '',
    numArr: '',
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
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res)
        that.setData({
          goods: res.data.goods,
          goods_help: res.data.goods_help,
        })
        var yqfriend = false;
        var numArr=[];
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
            // if (res.data.goods_help[i].button_state == 0) {
            //   yqfriend = true;
            //   break;
            // }
          }
          that.setData({
            numArr:numArr
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
    var numArr =that.data.numArr;
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
      console.log(1, clockArr)
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
      url: '/pages/zlGoods/index',
    })
  },
  goOnedetail: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/oneDetail/index?id=' + id,
    })
  },
  gotoDh: function(e) {
    var id = e.currentTarget.dataset.id;
    const dh = 100;
    wx.navigateTo({
      url: '/pages/oneDetail/index?id=' + id + '&&dh=' + dh,
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
      path: '/pages/index/index?openid=' + openid + '&&goods_id=' + goods_id + '&&zl=66'
    }
  },
})