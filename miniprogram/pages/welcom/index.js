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
      url: app.globalData.url
    })
  },

  copy() {
    wx.setClipboardData({
      data: app.globalData.url,
    })
  },

  submit() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var openId = this.data.openId
    var url = app.globalData.url
    app.api.getMemos(url, openId).then(result => {
      console.log(result.data)
      if (!result.data) {
        wx.vibrateLong()
        wx.showToast({
          icon: 'none',
          title: 'openId错误',
        })
      } else {
        wx.vibrateShort()
        wx.showToast({
          title: '获取成功~',
        })
        wx.setStorage({
          key: "openId",
          data: openId,
          encrypt: true,
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
      }
    })

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