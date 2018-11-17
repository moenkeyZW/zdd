// pages/assistance/index.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:'',
    percent:0,
    goods_help:'',
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
    const that=this;
    wx.request({
      url: app.globalData.base_url + '/my_zhuli',
      data: {
        openid: wx.getStorageSync('openid')
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        that.setData({
          goods:res.data.goods,
          goods_help:res.data.goods_help,
        })
      }
    })
  },
  goMoreGooods:function(){
    wx.redirectTo({
      url: '/pages/moreGoods/index',
    })
  },
  goOnedetail:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/oneDetail/index?id=' + id,
    })
  },
  onDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/detail/index?id=' + id,
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})