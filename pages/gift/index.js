//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    currentTab:0,
    zl_goods: '',
    jx_goods: '',
    xr_goods: '',
    xrpage: 1,
    zlpage: 1,
    jxpage: 1,
    xrhaveMore: '',
    xrnoMore: '',
    zlhaveMore: '',
    zlnoMore: '',
    jxhaveMore: '',
    jxnoMore: '',
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
          that.setData({
            xrpage: 1
          })
        } else if (cur === 1) {
          that.setData({
            zlpage: 1
          })
          wx.request({
            url: app.globalData.base_url + '/zl_goods_list06',
            data: {
              page: 1,
            },
            header: {
              'content-type': 'application/json; charset=utf-8', // 默认值
              'Cache-Control': 'max-age=60', //60秒
            },
            success: function (res) {
              wx.hideLoading();
              that.setData({
                zl_goods: res.data.goods,
                zlnoMore: res.data.more,
                zlhaveMore: res.data.more
              })
            }
          })
        } else {
          that.setData({
            jxpage: 1
          })
          wx.request({
            url: app.globalData.base_url + '/jx_goods_list06',
            data: {
              page: 1,
            },
            header: {
              'content-type': 'application/json; charset=utf-8', // 默认值
              'Cache-Control': 'max-age=60', //60秒
            },
            success: function (res) {
              wx.hideLoading();
              that.setData({
                jx_goods: res.data.goods,
                jxnoMore: res.data.more,
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
            'content-type': 'application/json; charset=utf-8', // 默认值
            'Cache-Control': 'max-age=60', //60秒
          },
          success: function(res) {
            that.data.xr_goods = that.data.xr_goods.concat(res.data.goods);
            that.setData({
              xr_goods: that.data.xr_goods,
              xrhaveMore: res.data.more,
              xrnoMore: res.data.more
            })
          }
        })
      }
    } else if (currentTab === 1) {
      let zlpage = that.data.zlpage;
      if (that.data.zlhaveMore) {
        // 请求下一页数据
        zlpage++;
        that.data.zlpage = zlpage
        wx.request({
          url: app.globalData.base_url + '/zl_goods_list06',
          data: {
            page: zlpage,
          },
          header: {
            'content-type': 'application/json; charset=utf-8', // 默认值
            'Cache-Control': 'max-age=60', //60秒
          },
          success: function(res) {
            that.data.zl_goods = that.data.zl_goods.concat(res.data.goods);
            that.setData({
              zl_goods: that.data.zl_goods,
              zlhaveMore: res.data.more,
              zlnoMore: res.data.more
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
            'content-type': 'application/json; charset=utf-8', // 默认值
            'Cache-Control': 'max-age=60', //60秒
          },
          success: function(res) {
            that.data.jx_goods = that.data.jx_goods.concat(res.data.goods);
            that.setData({
              jx_goods: that.data.jx_goods,
              jxhaveMore: res.data.more,
              jxnoMore: res.data.more
            })
          }
        })
      }
    }
  },
  zlDetail: function (e) {
    var form_id = e.detail.formId;
    var id = e.detail.target.dataset.id;
    wx.navigateTo({
      url: '/pages/oneDetail/index?id=' + id + '&&form_id=' + form_id + '&&parements=gg',
    })
  },
  xrDetail: function (e) {
    var form_id = e.detail.formId;
    var id = e.detail.target.dataset.id;
    wx.navigateTo({
      url: '/pages/newDetail/index?id=' + id + '&&form_id=' + form_id + '&&parements=gg',
    })
  },

  jxDetail: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/detail/index?id=' + id + '&&parements=gg',
    })
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
        'content-type': 'application/json; charset=utf-8', // 默认值
        'Cache-Control': 'max-age=60', //60秒
      },
      success: function(res) {
        wx.hideLoading();
        console.log(res)
        that.setData({
          xr_goods: res.data.goods,
          xrnoMore: res.data.more,
          xrhaveMore: res.data.more
        })
      }
    })
  },

})