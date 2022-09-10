var app = getApp()

// pages/search/index.ts
Page({
  data: {
    url: '',
    openId: '',
    top_btn: null,
    tags: [],
    showMemos: [],
    memos: []
  },

  onLoad() {
    var that = this
    this.setData({
      top_btn: app.globalData.top_btn,
      url: app.globalData.url,
      openId: app.globalData.openId
    })
    // console.log(this)
    app.api.getTags(this.data.url, this.data.openId).then(res => {
      that.setData({
        tags: res.data
      })
    })
  },

  onReady() {

  },

  searchTag(e) {
    console.log(e.currentTarget.dataset.keyword)
    var key = {
      detail: {
        value: '#' + e.currentTarget.dataset.keyword + ' '
      }
    }

    this.search(key)
  },

  search(e) {
    var keyword = e.detail.value
    console.log(keyword)
    var that = this
    var memos = app.globalData.memos
    console.log(memos)
    var showMemos = []
    if (keyword == '') {
      wx.vibrateShort()
      wx.showToast({
        icon: 'none',
        title: '请输入内容',
      })
    } else {
      if (app.globalData.memos === undefined) {
        wx.getStorage({
          key: 'memos',
          success(res) {
            that.setData({
              memos: res.data
            })
            app.globalData.memos = res.data
            memos = res.data
            console.log(memos)
            for (let i = 0; i < memos.length; i++) {
              const content = memos[i].content;
              var regs = content.search(keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
              if (regs != -1) {
                showMemos.push(memos[i])
              }
            }
          }
        })
      } else {
        for (let i = 0; i < memos.length; i++) {
          const content = memos[i].content;
          var regs = content.search(keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
          if (regs != -1) {
            showMemos.push(memos[i])
          }
        }
      }
      that.setData({
        showMemos: showMemos
      })
    }
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