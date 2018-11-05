  function shouquanxx() {
    var that = this;
    wx.request({
      url: 'https://www.mnancheng.com/admin/wechat/code_img',
      data: {
        openid: wx.getStorageSync('openid')
      },
      success: function(res) {
        wx.showLoading({
          title: '生成中',
        })
        wx.downloadFile({
          url: res.data.price,
          success: function(res) {
            var src = res.tempFilePath
            wx.getImageInfo({
              src: src,
              success: function(res) {
                const ctx = wx.createCanvasContext('shareCanvas')
                // 底图
                ctx.drawImage('../../imgs/sharephone.png', 0, 0, 375, 667)
                const qrImgSize = 123
                ctx.drawImage(src, 126, 488, qrImgSize, qrImgSize)
                // 播放按钮
                ctx.stroke()
                ctx.draw()
                setTimeout(function() {
                  wx.canvasToTempFilePath({
                    canvasId: 'shareCanvas',
                    success: function(res) {
                      wx.uploadFile({
                        url: 'https://www.mnancheng.com/admin/wechat/upload_img',
                        filePath: res.tempFilePath,
                        name: 'file',
                        header: {
                          "Content-Type": "multipart/form-data",
                          'accept': 'application/json',
                        },
                        success: function(res) {
                          var imgUrl = res.data;
                          wx.getImageInfo({
                            src: imgUrl,
                            success: function(ret) {
                              var path = ret.path;
                              wx.hideLoading();
                              wx.saveImageToPhotosAlbum({
                                filePath: path,
                                success(result) {
                                  wx.showToast({
                                    title: '保存成功',
                                    icon: 'success',
                                    duration: 1500,
                                  })
                                  that.setData({
                                    shareFriend: true,
                                  })
                                }
                              })
                            }
                          })
                          that.setData({
                            compose: true,
                          })
                        }
                      })
                    }
                  })
                }, 500)

              }
            })
          }
        })
      }
    })
  }
   function shareGroup() {
    let compose=true;
    let shareFriend=true;
    var that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              that.shouquanxx();
            },
            fail() {
              wx.showModal({
                title: '提示',
                content: '授权失败，不能保存到手机相册',
                success: function(re) {
                  if (re.confirm) {
                    wx.openSetting({
                      success: (res) => {
                        if (res.authSetting['scope.writePhotosAlbum']) {
                          that.shouquanxx();
                        }
                      }
                    })
                  }
                }
              })
            }
          })
        } else {
          that.shouquanxx();
        }
        typeof cb == "function" && cb(compose,shareFriend);
      },
    
    })
 }
  module.exports = {
    shareGroup: shareGroup,
    shouquanxx: shouquanxx
  };