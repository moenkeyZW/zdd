// pages/dhcg/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:'',
    num:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      orderId: options.orderId
    })
    if (options.num) {
      this.setData({
        num: options.num
      })
    }
  },
  lookDetail:function(){
    const that=this;
    var orderId=that.data.orderId;
    if(that.data.num==10086){
      wx.redirectTo({
        url: '/pages/success/index?orderId=' + orderId + '&&num=10086',
      })
    } else {
      wx.redirectTo({
        url: '/pages/success/index?orderId=' + orderId ,
      })
    }
  },
  goback:function(){
    wx.navigateBack({
      
    })
  }
})