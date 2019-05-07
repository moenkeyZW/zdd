// pages/turntable/index.js
const Page = require('../../../utils/ald-stat.js').Page;
const app = getApp();
const base_url = 'https://www.mnancheng.com/admin/Wechatluck';
Page({
  awardsConfig: {
    awards: [{
        "index": 0,
        "name": '1热力币',
        "img": '../../../imgs/zhuanbi.png'
      },
      {
        "index": 1,
        "name": '天猫精灵',
        "img": '../../../imgs/zhuantm.png'
      },
      {
        "index": 2,
        "name": '3热力币',
        "img": '../../../imgs/zhuanbi.png'
      },
      {
        "index": 3,
        "name": '小米手环',
        "img": '../../../imgs/zhuanxm.png'
      },
      {
        "index": 4,
        "name": '5热力币',
        "img": '../../../imgs/zhuanbi.png'
      },
      {
        "index": 5,
        "name": '10热力币',
        "img": '../../../imgs/zhuanbi.png'
      },
      {
        "index": 6,
        "name": '谢谢参与',
        "img": '../../../imgs/zhuanwu.png'
      },
      {
        "index": 7,
        "name": '50热力币',
        "img": '../../../imgs/zhuanbi.png'
      },
      {
        "index": 8,
        "name": '100热力币',
        "img": '../../../imgs/zhuanbi.png'
      },
      {
        "index": 9,
        "name": 'iPhone XS',
        "img": '../../../imgs/zhuanxs.png'
      },
    ]
  },
  /**
   * 页面的初始数据
   */
  data: {
    trysuc:true,
    tryfail:true,
    winner: '',
    losedialog: true,
    windialog: true,
    record: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    awardsList: [],
    animationData: {},
    awardIndex: '',
    chance_count: '',
    disabled: false,
    button_state: 0,
    catchtouchmove: false,
    nochance: true,
    ad_auth: '',
    type: 1,
    ad_id: '',
    plate: 4,
    ad_data: {},
    number:'',
    seat:'',
    clickedfail:true,
    erweima:'',
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function(options) {
    if(options.erweima){
      that.data.erweima=options.erweima
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    const that = this;
    if (that.data.erweima == 1 ){
      that.setData({
        trysuc: false,
      })
      that.data.erweima = 0
    } else if (that.data.erweima == 2){
      that.setData({
        clickedfail: true,
        tryfail: false,
      })
      that.data.erweima = 0
    }
    if (app.globalData.scene === 1038 && that.data.ad_data.ad_id !="") {
      wx.request({
        url: base_url + '/back_adv',
        data: {
          openid: wx.getStorageSync('openid'),
          type: 2,
          ad_id: that.data.ad_data.ad_id,
          plate: that.data.plate,
        },
        method: 'GET',
        header: {
          'Cache-Control': 'max-age=60,public', //60秒
        },
        success: function(res) {
          console.log(res.data.msg, res)
          app.globalData.scene = 1001;
          that.data.erweima=0;
          if(res.data.status==1){
            that.setData({
              number:res.data.number,
              trysuc:false,
            })
          }else{
            that.setData({
              tryfail: false,
              clickedfail:true
            })
          }
        }
      })
    }
    wx.request({
      url: base_url + '/get_luck_state',
      data: {
        openid: wx.getStorageSync('openid')
      },
      method: 'GET',
      header: {
        'Cache-Control': 'max-age=60,public', //60秒
      },
      success: function(res) {
        console.log(res)
        that.setData({
          ad_auth: res.data.ad_auth,
          record: res.data.turntable_jl,
          chance_count: res.data.msg,
          button_state: res.data.state,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function(e) {
    this.drawAwardRoundel();
  },
  //画抽奖转盘
  drawAwardRoundel: function() {
    const that = this;
    var awards = this.awardsConfig.awards;
    var awardsList = [];
    var turnNum = 1 / awards.length;
    for (var i = 0; i < awards.length; i++) {
      awardsList.push({
        turn: i * turnNum + 'turn',
        lineTurn: i * turnNum + turnNum / 2 + 'turn',
        award: awards[i].name,
        awards: awards[i].img
      });
    }
    this.setData({
      awardsList: awardsList
    })
  },
  //发起抽奖
  playReward: function(e) {
    const plate = e.target.dataset.plate;
    const that = this;
    that.setData({
      disabled: true,
      catchtouchmove: true
    }, () => {
      wx.request({
        url: base_url + '/lucky_draw',
        data: {
          plate: plate,
          openid: wx.getStorageSync('openid')
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          console.log(1, res)
          if (res.data.advdetail.ad_data){
            that.setData({
              ad_data: res.data.advdetail.ad_data
            })
          }else{
            that.data.ad_data.ad_id = "";
          }
          var awardIndex = res.data.lindex;
          console.log(awardIndex)
          var runNum = 7; //转的圈数
          //旋转角度
          that.runDeg = that.runDeg || 0;
          that.runDeg = that.runDeg + (360 - that.runDeg % 360) + (360 * runNum - awardIndex * (360 / 10))
          //创建动画
          var animationRun = wx.createAnimation({
            duration: 4000,
            timingFunction: 'ease'
          })
          animationRun.rotate(that.runDeg).step();
          that.setData({
            animationData: animationRun.export(),
          })
          //中奖提示
          var awardsConfig = that.awardsConfig;
          setTimeout(function() {
            if (awardIndex == 6) {
              that.setData({
                losedialog: false,
              })
            } else {
              that.setData({
                windialog: false,
                winner: awardsConfig.awards[awardIndex].name
              })
            }
          }.bind(this), 4000)
        }
      })
    })
  },
  onHide:function(){
    this.setData({
      catchtouchmove:false,
      disabled:false,
    })
    app.globalData.scene=1001;
  },
  stopTouchMove: function() {
    return false;
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
  gotorecord: function() {
    wx.navigateTo({
      url: '/pages/main/winRecord/index',
    })
  },
  getchance: function() {
    const that = this;
    wx.request({
      url: base_url + '/get_ad',
      data: {
        openid: wx.getStorageSync('openid'),
        plate: 5,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res)
        that.setData({
          nochance: false,
          ad_data: res.data.advdetail.ad_data
        })
      }
    })
  },
  navigateTo: function(e) {
    const that = this;
    that.data.seat = e.target.dataset.seat;
    const plate = e.target.dataset.plate;
    that.data.plate=plate;
    const ad_data = that.data.ad_data;
    const ad_id = ad_data.ad_id;
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
            },
            method: 'GET',
            header: {
              'content-type': 'application/json'
            },
            success: function(res) {
              console.log('跳转成功', res)
              that.setData({
                nochance: true,
                losedialog: true,
                windialog: true,
                disabled:false,
              })
            }
          })
        }
      })
    } else {
      wx.navigateTo({
        url: '../../other/erweima/index?ad_id=' + ad_id + '&&plate=' + plate,
      })
      that.setData({ 
        nochance: true,
        windialog: true,
      })
    }
  },
  continueplay:function(){
    const that=this;
    if (that.data.seat == 8) { 
      that.setData({
        windialog:false,
        tryfail:true,
        clickedfail: false
      })
    }else{
      that.setData({
        nochance:false,
        tryfail:true,
        clickedfail:false
      })
    }
  }, 
  hideHandle: function() {
    const that = this;
    that.setData({
      losedialog: true,
      windialog: true,
      disabled: false,
      catchtouchmove: false,
      nochance: true,
    })
    that.onShow();
  },
  hideHandles:function(){
    const that = this;
    that.setData({
      trysuc: true,
      tryfail: true,
      clickedfail: false,
    })
  },  
})