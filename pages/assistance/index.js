// pages/assistance/index.js
const Page = require('../../utils/ald-stat.js').Page;
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
    const that = this;
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
        that.setData({
          goods: res.data.goods,
          goods_help: res.data.goods_help,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
  gotoDh:function(e){
    var id = e.currentTarget.dataset.id;
    const dh=100;
    wx.navigateTo({
      url: '/pages/oneDetail/index?id=' + id+'&&dh='+dh,
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    const that = this;
    const openid = wx.getStorageSync('openid')
    const nickname = wx.getStorageSync('nickname');
    const goods_id = res.target.dataset.id;
    return {
      title: `${nickname}邀请你用步数免费换礼物，数量有限，先到先得！`,
      imageUrl: '../../imgs/share.png',
      path: '/pages/share/index?openid=' + openid + '&&goods_id=' + goods_id
    }
  },
})