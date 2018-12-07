// pages/exchange/index.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    k_goods:'',
    page:1,
    haveMore: '',
    noMore: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    wx.request({
      url: app.globalData.base_url + '/k_goods_list',
      data: {
        page: 1,
        openid: wx.getStorageSync('openid')
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          k_goods: res.data.goods,
          noMore:res.data.more,
          haveMore:res.data.more
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
    var price = e.currentTarget.dataset.price;
    var id = e.currentTarget.dataset.id;
    if(price>1){
      wx.navigateTo({
        url: '/pages/detail/index?id=' + id,
      })
    }else{
      wx.navigateTo({
        url: '/pages/oneDetail/index?id=' + id,
      })
    }
    
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
        url: app.globalData.base_url + '/k_goods_list',
        data: {
          page: page,
          openid: wx.getStorageSync('openid')
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          that.data.k_goods = that.data.k_goods.concat(res.data.goods);
          that.setData({
            k_goods: that.data.k_goods,
            haveMore: res.data.more,
          })
          if (res.data.more) {
            that.setData({
              noMore: true,
            })
          } else {
            that.setData({
              noMore: false,
            })
          }
        }
      })
    }
  },
})