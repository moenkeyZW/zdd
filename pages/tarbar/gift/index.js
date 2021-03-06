//index.js
//获取应用实例
const Page = require('../../../utils/ald-stat.js').Page;
const app = getApp()

Page({
  data: {
    currentTab: 0,
    jx_goods: '',
    xr_goods: '',
    xrpage: 1,
    jxpage: 1,
    xrhaveMore: '',
    jxhaveMore: '',
    item: {
      zl_goods: '',
      page: 1,
      haveMore: '',
    }
  },
  onLoad: function() {
    wx.showLoading({
      title: '加载中',
    })
    const that = this;
    wx.request({
      url: app.globalData.base_url + '/xr_goods_list06',
      data: {
        page: 1,
      },
      header: {
        'Cache-Control': 'max-age=60,public', //60秒
      },
      success: function(res) {
        wx.hideLoading();
        console.log(res)
        that.setData({
          xr_goods: res.data.goods,
          xrhaveMore: res.data.more
        })
      }
    })
  },

  swichNav: function(e) {
    const that = this
    wx.showLoading({
      title: '加载中',
    })
    var cur = e.target.dataset.current;
    if (that.data.currentTab === cur) {
      wx.hideLoading();
      return
    } else {
      that.setData({
        currentTab: cur,
      }, () => {
        if (cur === 0) {
          wx.hideLoading();
          that.data.xrpage = 1
        } else if (cur === 1) {
          that.data.item.page = 1
          wx.request({
            url: app.globalData.base_url + '/zl_goods_list06',
            data: {
              page: 1,
            },
            header: {
              'Cache-Control': 'max-age=60,public', //60秒
            },
            success: function(res) {
              wx.hideLoading();
              that.setData({
                'item.zl_goods': res.data.goods,
                'item.haveMore': res.data.more
              })
            }
          })
        } else {
          that.data.jxpage = 1
          wx.request({
            url: app.globalData.base_url + '/jx_goods_list06',
            data: {
              page: 1,
            },
            header: {
              'Cache-Control': 'max-age=60,public', //60秒
            },
            success: function(res) {
              wx.hideLoading();
              that.setData({
                jx_goods: res.data.goods,
                jxhaveMore: res.data.more
              })
            }
          })
        }
      })
    }
  },

  // 上拉触底事件，请求记录数据
  onReachBottom: function() {
    const that = this;
    var currentTab = that.data.currentTab;
    if (currentTab === 0) {
      let xrpage = that.data.xrpage;
      if (that.data.xrhaveMore) {
        // 请求下一页数据
        xrpage++;
        that.data.xrpage = xrpage
        wx.request({
          url: app.globalData.base_url + '/xr_goods_list06',
          data: {
            page: xrpage,
          },
          header: {
            'Cache-Control': 'max-age=60,public', //60秒
          },
          success: function(res) {
            that.data.xr_goods = that.data.xr_goods.concat(res.data.goods);
            that.setData({
              xr_goods: that.data.xr_goods,
              xrhaveMore: res.data.more,
            })
          }
        })
      }
    } else if (currentTab === 1) {
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
          header: {
            'Cache-Control': 'max-age=60,public', //60秒
          },
          success: function(res) {
            that.data.item.zl_goods = that.data.item.zl_goods.concat(res.data.goods);
            that.setData({
              'item.zl_goods': that.data.item.zl_goods,
              'item.haveMore': res.data.more,
            })
          }
        })
      }
    } else {
      let jxpage = that.data.jxpage;
      if (that.data.jxhaveMore) {
        // 请求下一页数据
        jxpage++;
        that.data.jxpage = jxpage
        wx.request({
          url: app.globalData.base_url + '/jx_goods_list06',
          data: {
            page: jxpage,
          },
          header: {
            'Cache-Control': 'max-age=60,public', //60秒
          },
          success: function(res) {
            that.data.jx_goods = that.data.jx_goods.concat(res.data.goods);
            that.setData({
              jx_goods: that.data.jx_goods,
              jxhaveMore: res.data.more,
            })
          }
        })
      }
    }
  },
  onDetail: function(e) {
    var form_id = e.detail.formId;
    var id = e.detail.target.dataset.id;
    wx.navigateTo({
      url: '../../main/oneDetail/index?id=' + id + '&&form_id=' + form_id + '&&parements=gg',
    })
  },
  xrDetail: function(e) {
    var form_id = e.detail.formId;
    var id = e.detail.target.dataset.id;
    wx.navigateTo({
      url: '../../main/newDetail/index?id=' + id + '&&form_id=' + form_id + '&&parements=gg',
    })
  },

  jxDetail: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../main/detail/index?id=' + id + '&&parements=gg',
    })
  },

})