// pages/editAdd/index.js
const Page = require('../../utils/ald-stat.js').Page;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: '请输入地址',
    color: '#B3B3B3',
    // isHaveAddress:true,
    name: '',
    phone: '',
    detailAddress: '',
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
    var that = this;
    wx.request({
      url: app.globalData.base_url + '/address',
      data: {
        openid: wx.getStorageSync('openid')
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res)
        if (res.data.state == 0) {

        } else {
          that.setData({
            name: res.data.res.name,
            phone: res.data.res.phone,
            region: res.data.res.address,
            detailAddress: res.data.res.detail_address,
          })
        }
      }
    })
  },

  personHandle: function(e) {
    var that = this;
    var region = null;
    if (e.detail.value.region!="") {
      region = e.detail.value.region.join(',');
    } else if (that.data.region) {
      region = that.data.region;
    } else {
      region = ""
    }
    var detailAddress = null;
    if (e.detail.value.detailAddress) {
      detailAddress = e.detail.value.detailAddress;
    } else if (that.data.address) {
      detailAddress = that.data.detailAddress;
    } else {
      detailAddress = ""
    }
    var phone = null;
    if (e.detail.value.phone ) {
      phone = e.detail.value.phone ;
    } else if (that.data.phone ) {
      phone = that.data.phone;
    } else {
      phone = ""
    }
    if (phone.length !== 11) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的电话号码',
        showCancel: false,
      })
      return;
    }
    var myreg = /^0{0,1}(13[0-9]|15[0-9]|18[0-9]|14[0-9]|17[0-9]|19[8-9]|16[6])[0-9]{8}$/;
    if (!myreg.test(phone)) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的电话号码',
        showCancel: false,
      })
      return;
    }
    var name = null;
    if (e.detail.value.name) {
      name = e.detail.value.name;
    } else if (that.data.address) {
      name = that.data.name;
    } else {
      name = ""
    }
    let mes = "";
    if (name === "") {
      mes = "收货人"
      wx.showModal({
        title: '信息不完整',
        content: `${mes}未填写，请补充`,
        showCancel: false,
        confirmText: '知道了',
        success: function(res) {}
      })
      return
    }
    // if (phone === "") {
    //   mes = "手机号"
    //   wx.showModal({
    //     title: '信息不完整',
    //     content: `${mes}未填写，请补充`,
    //     showCancel: false,
    //     confirmText: '知道了',
    //     success: function(res) {}
    //   })
    //   return
    // }
    if (region === "") {
      mes = "地址"
      wx.showModal({
        title: '信息不完整',
        content: `${mes}未填写，请补充`,
        showCancel: false,
        confirmText: '知道了',
        success: function(res) {}
      })
      return
    }
    if (detailAddress === "") {
      mes = "详细地址"
      wx.showModal({
        title: '信息不完整',
        content: `${mes}未填写，请补充`,
        showCancel: false,
        confirmText: '知道了',
        success: function(res) {}
      })
      return
    }
    wx.request({
      url: app.globalData.base_url + '/editor',
      data: {
        name: name,
        detail_address: detailAddress,
        address: region,
        phone: phone,
        openid: wx.getStorageSync('openid')
      },
      success: function(res) {
        if (res.statusCode === 200) {
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 3000,
            mask: true,
            success: function() {
              wx.navigateBack({

              })
            }
          })
        }
      }
    })
  },
  bindRegionChange: function(e) {
    this.setData({
      region: e.detail.value,
      color: '#333',
    })
  },
  inputPhone: function(e) {
    var phone = e.detail.value.length;
    var mobile=e.detail.value;
  },

})