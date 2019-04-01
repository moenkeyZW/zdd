// pages/order/index.js
const Page = require('../../utils/ald-stat.js').Page;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    top:'',
    state:'',
    order:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  copyText: function (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this;
    wx.request({
      url: app.globalData.base_url + '/order_list',
      data: {
        openid: wx.getStorageSync('openid')
      },
      success: function (res) {
        console.log(res)
        that.setData({
          state:res.data.state
        })
        if(res.data.state==1){
          that.setData({
            order:res.data.res,
            top:res.data.top
          })
        }
      }
    })
  },
  goOrderDetail:function(e){
    var orderId = e.currentTarget.dataset.id;
    var goods_type = e.currentTarget.dataset.type;
    if(goods_type==0||goods_type==1||goods_type==4){
      wx.navigateTo({
        url: '/pages/success/index?orderId=' + orderId,
      })
    }else{
      wx.navigateTo({
        url: '/pages/success/index?orderId=' + orderId + '&&num=10086',
      })
    }
  },
})