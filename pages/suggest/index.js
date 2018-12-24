// pages/suggest/index.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img_arr:[],
    disabled: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },


  onShow: function () {
    this.setData({
      disabled: false
    })
  },

  leaveWord: function (e) {
    var that = this;
    var message = e.detail.value.message;
    var photo=that.data.img_arr;
    if (message == "") {
      wx.showModal({
        title: '提示',
        content: '留言不能为空',
        showCancel: false,
      })
      return
    }
    that.setData({
      disabled: true
    })
    var id = that.data.id;
    wx.request({
      // url: app.globalData.base_url + '/idea',
      url:'https://www.mnancheng.com/Admin/weixin/idea',
      data: {
        openid: wx.getStorageSync('openid'),
        content: message,
        photo: photo
      },
      success: function (res) {
        wx.showModal({
          title: '反馈成功',
          content: '感谢你对走多多的意见，我们会尽快改良',
          showCancel:false,
          success:function(res){
            if (res.confirm) {
              wx.navigateBack({

              })
            }
          }
        })
     
      }
    })
  },
  choose:function(){
    let that=this;
    var img_arr=that.data.img_arr;
    wx.chooseImage({
      count:4,
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        for (var i = 0; i < tempFilePaths.length; i++) {
          wx.uploadFile({
            // url: app.globalData.base_url + '/imgs1',
            url:'https://www.mnancheng.com/Admin/weixin/imgs1',
            filePath: tempFilePaths[i],
            name: 'file',
            success: function (res) {
              img_arr.push('https://www.mnancheng.com/Public/UploadWechat/'+res.data)
              img_arr.concat(img_arr)
              console.log(img_arr)
              that.setData({
                img_arr: img_arr,
              })
            }
          })
        }
      }
    })
  },

})