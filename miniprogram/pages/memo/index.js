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
        id
      })
      this.getMemo(this.data.url, id)
    }
  },

  getMemo(url, id) {
    let that = this
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
          this.setData({
            memo
          })
        }

      })
      .catch(err => {
        console.log(err)
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

  share() {
    wx.showShareMenu({
      withShareTicket: true
    })
  },

  onReady() {

  },

  onShow() {

  },

  onShareAppMessage() {
    return {
      title: this.data.memo.creatorName,
      path: `/pages/memo/index?id=${this.data.id}`,
      imageUrl:'https://img.rabithua.club/%E9%BA%A6%E9%BB%98/memoShare.png'
    }
  }
})