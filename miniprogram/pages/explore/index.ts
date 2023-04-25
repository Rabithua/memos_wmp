
var app = getApp()
import {
  formatMemoContent,
  parseHtmlToRawText
} from '../../js/marked'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: getApp().globalData.url,
    memos: [],
    showMemos: [],
    offset: 0,
    limit: 20
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    let that = this
    this.setData({
      top_btn: app.globalData.top_btn
    })
    this.getExploreMemos()
  },

  getExploreMemos() {
    let that = this
    app.api.getExploreMemos(this.data.url, this.data.offset, this.data.limit)
      .then(result => {
        console.log(result)
        if (!result.data) {
          wx.vibrateLong()
          wx.showToast({
            icon: 'error',
            title: that.data.language.common.wrong,
          })
        } else {
          var memos = result.data
          for (let i = 0; i < memos.length; i++) {
            const ts = memos[i].createdTs
            var time = app.calTime(ts)
            memos[i].time = time
            //memos原版解析
            let md = formatMemoContent(memos[i].content)
            memos[i].formatContent = md
            memos[i] = app.memosRescourse(memos[i])
          }
          console.log(memos)
          that.setData({
            showMemos: that.data.showMemos.concat(memos),
            offset: that.data.showMemos.concat(memos).length + 1
          })
          wx.vibrateShort()
        }
      })
      .catch((err) => console.log(err))
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  onShow() {
    this.setData({
      language: app.language[wx.getStorageSync('language') ? wx.getStorageSync('language') : 'chinese']
    })
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
    console.log('chudi')
    this.getExploreMemos()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(options) {
    console.log(options.webViewUrl)
  }
})