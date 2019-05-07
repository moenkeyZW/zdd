// pages/order/index.js
const Page = require('../../../utils/ald-stat.js').Page;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    top:'',
    state:'',
    order:'',
    page:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.globalData.base_url + '/new_order_list',
      data: {
        page:1,
        openid: wx.getStorageSync('openid')
      },
      header: {
        'Cache-Control': 'max-age=60,public', //60秒
      },
      success: function (res) {
        console.log(res)
        that.data.haveMore=res.data.more;
        that.setData({
          state: res.data.state
        })
        if (res.data.state == 1) {
          that.setData({
            order: res.data.res,
            top: res.data.top
          })
        }
      }
    })
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

  },
  // 上拉触底事件，请求记录数据
  onReachBottom: function () {
    const that = this
    let page = that.data.page;
    if (that.data.haveMore) {
      // 请求下一页数据
      page++;
      that.data.page = page
      wx.request({
        url: app.globalData.base_url + '/new_order_list',
        data: {
          page: page,
          openid: wx.getStorageSync('openid')
        },
        header: {
          'Cache-Control': 'max-age=60,public', //60秒
        },
        success: function (res) {
          var num=52;
          var array=[52];
          that.data.order = that.data.order.concat(res.data.res);
          for(var i=0;i<that.data.order.length-2;i++){
             num = num+=480;
             array.push(num)
          }
          that.data.haveMore=res.data.more;
          that.setData({
            order: that.data.order,
            top:array
          })
        }
      })
    }
  },
  goOrderDetail:function(e){
    var orderId = e.currentTarget.dataset.id;
    var goods_type = e.currentTarget.dataset.type;
    if(goods_type==0||goods_type==1||goods_type==4){
      wx.navigateTo({
        url: '/pages/main/success/index?orderId=' + orderId,
      })
    }else{
      wx.navigateTo({
        url: '/pages/main/success/index?orderId=' + orderId + '&&num=10086',
      })
    }
  },
})