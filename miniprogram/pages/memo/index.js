import {
  formatMemoContent,
  parseHtmlToRawText
} from '../../js/marked'
var app = getApp()

Page({
  data: {
    memo: null,
    id: null,
    url: app.globalData.url
  },

  onLoad(o) {
    console.log(o)
    let id = o.id
    if (id) {
      this.setData({
        id,
        language: app.language[wx.getStorageSync('language') ? wx.getStorageSync('language') : 'chinese']
      })
      if (wx.getStorageSync('openId')) {
        this.getMemo(this.data.url, id)
      } else {
        app.getUnionId().then((r) => {
          wx.setStorageSync('openId', r)
          this.getMemo(this.data.url, id)
        }).catch((err) => {
          console.log(err)
          this.getMemo(this.data.url, id)
        })
      }

    }
  },

  getMemo(url, id) {
    wx.showLoading({
      title: this.data.language.memo.getting,
    })
    app.api.getMemo(url, id)
      .then(res => {
        console.log(res)
        if (res.data) {
          let memo = res.data
          memo.formatContent = formatMemoContent(memo.content)
          memo.time = app.calTime(memo.createdTs)
          memo = app.memosRescourse(memo)
          wx.setNavigationBarTitle({
            title: memo.creatorName,
          })
          wx.hideLoading()
          wx.vibrateShort()
          this.setData({
            memo
          })
        } else {
          wx.hideLoading()
        }
      })
      .catch(err => {
        console.log(err)
        wx.hideLoading()
      })
  },

  preview(e) {
    console.log(e)
    const url = []
    for (let i = 0; i < e.target.dataset.url.length; i++) {
      const src = e.target.dataset.url[i].url;
      url.push(src)
    }
    wx.previewImage({
      current: e.target.dataset.src, // 当前显示图片的 http 链接
      urls: url // 需要预览的图片 http 链接列表
    })
  },

  vibShort() {
    wx.vibrateShort()
  },

  onReady() {

  },

  onShow() {
    this.setData({
      language: app.language[wx.getStorageSync('language') ? wx.getStorageSync('language') : 'chinese']
    })
  },

  onShareAppMessage() {
    return {
      title: `${this.data.memo.creatorName}的笔记`,
      path: `/pages/memo/index?id=${this.data.id}`,
    }
  }
})