// pages/welcom/index.js
var app = getApp()

Page({

  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      url: app.globalData.url,
      email: '',
      password: '',
      btnDisable: false
    })
  },

  copy() {
    wx.setClipboardData({
      data: app.globalData.url,
    })
  },

  creatUser() {
    var that = this
    this.setData({
      btnDisable: true
    })
    var reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (!reg.test(this.data.email)) {
      wx.vibrateLong()
      wx.showToast({
        icon: 'none',
        title: '邮箱格式错误',
      })
      this.setData({
        btnDisable: false
      })
    } else if (this.data.password.length < 6) {
      wx.vibrateLong()
      wx.showToast({
        icon: 'none',
        title: '密码长度需大于六位',
      })
      this.setData({
        btnDisable: false
      })
    } else {
      wx.cloud.callFunction({
        name: 'creatuser',
        data: {
          method: 'POST',
          needHost: true,
          body: {
            "email": this.data.email,
            "password": this.data.password,
            "role": "USER"
          },
          url: app.globalData.url + '/api/user',
        },
        success: function (res) {
          //500 邮箱已占用，401 用户权限不足，undefined 创建成功
          console.log(res.result.statusCode)
          var code = res.result.statusCode
          console.log(res)
          if (!code) {
            //创建成功
            wx.vibrateShort()
            wx.showToast({
              title: '创建成功',
            })
            var openId = res.result.data.openId
            wx.setStorage({
              key: "openId",
              data: openId,
              // encrypt: true,
              success(res) {
                console.log(res)
                wx.redirectTo({
                  url: '../home/index',
                })
              },
              fail(err) {
                wx.showToast({
                  title: 'something wrong',
                })
              }
            })
          } else if (code == 500) {
            app.api.signIn(that.data.url, {
              "email": that.data.email,
              "password": that.data.password,
            }).then(res => {
              if (res.data) {
                console.log(res.data.openId)
                wx.vibrateShort()
                wx.showToast({
                  title: '登录成功',
                })
                wx.setStorage({
                  key: "openId",
                  data: res.data.openId,
                  // encrypt: true,
                  success(res) {
                    console.log(res)
                    wx.redirectTo({
                      url: '../home/index',
                    })
                  },
                  fail(err) {
                    wx.showToast({
                      title: 'something wrong',
                    })
                  }
                })
              } else {
                console.log(res)
                wx.vibrateLong()
                wx.showToast({
                  icon: 'none',
                  title: '密码错误',
                })
                that.setData({
                  btnDisable: false
                })
              }
            })
          } else {
            wx.vibrateLong()
            wx.showToast({
              icon: 'none',
              title: 'something wrong',
            })
            that.setData({
              btnDisable: false
            })
          }
        },
        fail: function (error) {
          console.log(error)
          wx.vibrateLong()
          wx.showToast({
            icon: 'none',
            title: 'something wrong',
          })
          that.setData({
            btnDisable: false
          })
        }
      })
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})