// pages/moreGoods/index.js
const Page = require('../../../utils/ald-stat.js').Page;
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: {
      zl_goods: '',
      page: 1,
      haveMore: '',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    const that=this;
    wx.request({
      url: app.globalData.base_url + '/zl_goods_list06',
      data: {
        page: 1,
      },
      header: {
        'Cache-Control': 'max-age=60,public', //60秒
      },
      success: function (res) {
        console.log(res)
        wx.hideLoading();
        that.setData({
          'item.zl_goods': res.data.goods,
          'item.haveMore': res.data.more
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  onDetail: function (e) {
    var form_id = e.detail.formId;
    var id = e.detail.target.dataset.id;
    wx.navigateTo({
      url: '/pages/main/oneDetail/index?id=' + id + '&&form_id=' + form_id + '&&parements=mm',
    })
  },
  // 上拉触底事件，请求记录数据
  onReachBottom: function () {
    const that = this
    let page = that.data.item.page;
    if (that.data.item.haveMore) {
      // 请求下一页数据
      page++;
      that.data.item.page = page
      wx.request({
        url: app.globalData.base_url + '/zl_goods_list06',
        data: {
          page: page,
        },
        method: 'GET',
        header: {
          'Cache-Control': 'max-age=60,public', //60秒
        },
        success: function (res) {
          that.data.item.zl_goods = that.data.item.zl_goods.concat(res.data.goods);
          that.setData({
            'item.zl_goods': that.data.item.zl_goods,
            'item.haveMore': res.data.more,
          })
        }
      })
    }
  },
 
})