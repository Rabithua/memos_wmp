// pages/openapi/index.ts
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onLoad() {
    var that = this
    this.setData({
      top_btn: app.globalData.top_btn
    })

    if (wx.getStorageSync('openId')) {
      that.setData({
        url: wx.getStorageSync('url')
      })
      // 获取用户信息
      this.getMe()
    } else {
      wx.reLaunch({
        url: '../welcom/index',
      })
    }
  },

  onShow() {
    this.setData({
      language: app.language[wx.getStorageSync('language') ? wx.getStorageSync('language') : 'chinese']
    })
    wx.setNavigationBarTitle({
      title: this.data.language.openApi.pageTitle,
    })
  },

  getMe() {
    var that = this
    app.api.getMe(wx.getStorageSync('url'))
      .then(result => {
        let me = result
        that.setData({
          me: me
        })
      })
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