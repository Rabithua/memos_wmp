
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
            const fileList_preview: any = []
            const imgList_preview: any = []
            for (let l = 0; l < memos[i].resourceList.length; l++) {
              const rescource = memos[i].resourceList[l];
              const rescource_name: any = rescource.filename
              const rescource_url = that.data.url + '/o/r/' + rescource.id + '/' + rescource_name
              if (rescource.type.match(/image/)) {
                imgList_preview.push({
                  url: rescource_url,
                  name: rescource_name
                })
              } else {
                fileList_preview.push({
                  url: rescource_url,
                  name: rescource_name
                })
              }
            }
            memos[i].fileList_preview = fileList_preview
            memos[i].imgList_preview = imgList_preview
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