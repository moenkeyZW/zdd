// pages/person/index.js
const Page = require('../../utils/ald-stat.js').Page;
const app = getApp();

const ageArr = [],
  heightArr = [],
  weightArr = []
for (let i = 1; i < 101; i++) {
  ageArr.push(i)
}
for (let i = 120; i < 220; i++) {
  heightArr.push(i)
}
for (let i = 30; i < 180; i++) {
  weightArr.push(i)
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: '',
    genderArray: ['男', '女'],
    ageArr: ageArr,
    heightArr: heightArr,
    weightArr: weightArr,
    stype: '',
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
      url: app.globalData.base_url + '/get_test_info',
      data: {
        openid: wx.getStorageSync('openid')
      },
      success: function(res) {
        console.log(res)
        that.setData({
          stype: res.data.type,
          userInfo: res.data.userinfo,
        })
      }
    })
  },
  personHandle: function(e) {
    var that = this;
    var userInfo = that.data.userInfo;
    if (userInfo.gender > 0) {
      var gender = userInfo.gender;
    } else {
      var gender = e.detail.value.gender + 1;
    }
    gender = gender == 1 ? "男" : "女";
    let age = e.detail.value.age;
    let height = e.detail.value.height+120;
    let weight = e.detail.value.weight+30;
    var id = userInfo.test_log_id;
    var stype = that.data.stype;
    wx.request({
      url: app.globalData.base_url + '/edit_info',
      data: {
        test_log_id: id,
        type_id: stype,
        gender: gender,
        age: age,
        height: height,
        weight: weight,
        openid: wx.getStorageSync('openid')
      },
      success: function(res) {
        wx.navigateBack({

        })
      }

    })
  },
  pickGender: function(e) {
    this.setData({
      [`userInfo.gender`]: Number.parseInt(e.detail.value) + 1
    })
  },
  pickHeight: function(e) {
    this.setData({
      [`userInfo.height`]: Number.parseInt(e.detail.value) + 120,
    })
  },
  pickWeight: function(e) {
    this.setData({
      [`userInfo.weight`]: Number.parseInt(e.detail.value) + 30,
    })
  },
  pickAge: function(e) {
    this.setData({
      [`userInfo.age`]: Number.parseInt(e.detail.value) + 1,
    })
  },

})