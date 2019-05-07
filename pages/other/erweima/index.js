// pages/other//erweima/index.js
const app = getApp();
const base_url = 'https://www.mnancheng.com/admin/Wechatluck';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    webviewUrl: '',
    plate: '',
    ad_id: '',
    haveHide: '',
    ra: '',
    ratio: '',
    step:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this;
    var webviewUrl = 'https://www.mnancheng.com/Home/Ads/index?ad_id=' + options.ad_id
    that.setData({
      webviewUrl: webviewUrl,
      plate: options.plate,
      ad_id: options.ad_id
    })
    if (options.plate == 1) {
      that.data.ra = options.ra
      that.data.ratio= options.x_times,
      that.data.step=options.step
    }
    if(options.plate==3){
      that.data.ra = options.rand_rlb
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    const that = this;
    if (that.data.haveHide == 5) {
      const ad_id = that.data.ad_id;
      const plate = that.data.plate;
      var x_times = that.data.ratio;
      var ra = that.data.ra;
      var step=that.data.step;
      wx.request({
        url: base_url + '/back_adv',
        data: {
          openid: wx.getStorageSync('openid'),
          type: 2,
          ad_id: ad_id,
          plate: plate,
          ra: ra,
          ratio: x_times,
          step:step
        },
        method: 'GET',
        header: {
          'Cache-Control': 'max-age=60,public', //60秒
        },
        success: function(res) {
          console.log(res.data.msg, res)
          let pages = getCurrentPages(); //当前页面
          let prevPage = pages[pages.length - 2]; //上一页面（prevPage 就是获取的上一个页面的JS里面所有pages的信息
          if (prevPage.route == "pages/main/turntable/index") {
            if (res.data.status == 1) {
              prevPage.setData({
                erweima: 1,
                number: res.data.number,
              })
            } else {
              prevPage.setData({
                erweima: 2
              })
            }
            wx.navigateBack({
              delta: 1,
            })
          } else {
            if (res.data.status == 1) {
              prevPage.setData({
                erweima: 3,
                number: res.data.number,
              })
            } else {
              prevPage.setData({
                erweima: 4
              })
            }
            wx.navigateBack({
              delta: 1,
            })
          }
        }
      })
    }
  },

  onHide: function() {
    const that = this;
    that.data.haveHide = 5;
    const ad_id = that.data.ad_id;
    const plate = that.data.plate;
    var x_times = that.data.ratio;
    var ra = that.data.ra;
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
        'Cache-Control': 'max-age=60,public', //60秒
      },
      success: function(res) {
        console.log(res.data.msg, res)
      }
    })
  },
})