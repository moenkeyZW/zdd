// pages/changeRecord/index.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    record:'',
    goods_num:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    const goods_id = options.goods_id;
    wx.request({
      url: app.globalData.base_url + '/goods_dh_list',
      data: {
        goods_id: goods_id,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          goods_num:res.data.goods_num,
          record: res.data.record,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
})