// pages/archived/index.ts
import {
  formatMemoContent,
  parseHtmlToRawText
} from '../../js/marked'
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    limit: 10,
    memos: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    var that = this
    this.setData({
      top_btn: app.globalData.top_btn
    })

    if (wx.getStorageSync('openId')) {
      that.setData({
        url: app.globalData.url
      })
      that.getMemos('ARCHIVED')
    } else {
      wx.redirectTo({
        url: '../welcom/index',
      })
    }
  },

  copy(e) {
    console.log(e)
    wx.vibrateShort({
      type: 'light'
    })
    wx.setClipboardData({
      data: e.target.dataset.url
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
  goMemo(e) {
    // console.log(e.currentTarget.dataset.memoid)
    wx.navigateTo({
      url: `/pages/memo/index?id=${e.currentTarget.dataset.memoid}`,
    })
  },

  getMemos(rowStatus) {
    var that = this
    let offset = this.data.memos.length
    app.api.getMemos(app.globalData.url, this.data.limit, offset, rowStatus)
      .then(result => {
        if (!result.data) {
          wx.vibrateLong()
          wx.showToast({
            icon: 'error',
            title: that.data.language.common.wrong,
            state: that.data.language.home.state.offline,
            onlineColor: '#eeeeee',
          })
        } else if (result.data.length == 0) {
          if (that.data.memos.length == 0) {
            that.setData({
              memos: []
            })
          }
          wx.showToast({
            icon: 'none',
            title: that.data.language.home.thatIsAll
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
          that.setData({
            memos: that.data.memos.concat(memos)
          })
        }
      })
      .catch((err) => {
        console.log(err)
        wx.vibrateLong()
        wx.showToast({
          icon: 'error',
          title: that.data.language.common.wrong,
        })
      })
  },

  changeMemoPinned(e) {
    wx.vibrateShort({
      type: 'light'
    })
    let memoid = e.currentTarget.dataset.memoid
    let pinned = e.currentTarget.dataset.pinned
    var data = {
      pinned: !pinned
    }
    var that = this
    app.api.changeMemoPinned(this.data.url, memoid, data)
      .then(res => {
        if (res.data) {
          wx.vibrateShort({
            type: 'light'
          })
          if (!pinned) {
            wx.showToast({
              icon: 'none',
              title: that.data.language.home.pinned,
            })
          } else {
            wx.showToast({
              icon: 'none',
              title: that.data.language.home.unpinned,
            })
          }
          var memos = that.data.memos
          for (let i = 0; i < memos.length; i++) {
            if (memos[i].id == memoid) {
              memos[i].pinned = !pinned
            }
          }
          that.setData({
            memos: memos,
          })
        }
      })
      .catch((err) => console.log(err))
  },

  deleteMemoFaker(e) {
    let memoid = e.currentTarget.dataset.memoid
    let rowstatus = e.currentTarget.dataset.rowstatus
    var data = {
      rowStatus: rowstatus == "NORMAL" ? 'ARCHIVED' : "NORMAL"
    }
    var url = this.data.url
    var id = memoid
    this.editMemoRowStatus(url, id, data)
  },

  changeMemoVisibility(e) {
    let visibility = e.currentTarget.dataset.visibility
    let memoid = e.currentTarget.dataset.memoid
    let id = memoid
    let that = this
    let memos = app.deepCopy(this.data.memos)
    app.api.editMemo(this.data.url, id, {
        visibility: (visibility == 'PRIVATE' ? 'PUBLIC' : 'PRIVATE')
      })
      .then(res => {
        if (res.data) {
          for (let i = 0; i < memos.length; i++) {
            if (memos[i].id == id) {
              memos[i].visibility = (memos[i].visibility == 'PRIVATE' ? 'PUBLIC' : 'PRIVATE')
            }
          }
          that.setData({
            memos
          })
          wx.vibrateShort({
            type: 'light'
          })
          wx.showToast({
            icon: 'none',
            title: that.data.language.home.visibilityChange,
          })
        }
      })
      .catch((err) => console.log(err))
  },

  editMemoRowStatus(url, id, data) {
    var that = this
    app.api.editMemo(url, id, data)
      .then(res => {
        // console.log(res)
        if (res.data) {
          var memos = that.data.memos
          for (let i = 0; i < memos.length; i++) {
            if (memos[i].id == id) {
              memos[i].rowStatus = data.rowStatus
            }
          }
          that.setData({
            memos: memos
          })
          wx.vibrateShort({
            type: 'light'
          })
          wx.showToast({
            icon: 'none',
            title: that.data.language.home.rowStatusChange,
          })
        }
      })
      .catch((err) => console.log(err))
  },

  deleteMemo(e) {
    var that = this
    var memos = this.data.memos
    let memoid = e.currentTarget.dataset.memoid
    wx.showModal({
      confirmText: that.data.language.home.DeleteMemoModal.confirmText,
      cancelText: that.data.language.home.DeleteMemoModal.cancelText,
      confirmColor: '#B85156',
      title: that.data.language.home.DeleteMemoModal.title,
      content: that.data.language.home.DeleteMemoModal.content,
      success(res) {
        if (res.confirm) {
          wx.vibrateShort({
            type: 'light',
          })
          app.api.deleteMemo(that.data.url, memoid)
            .then(res => {
              if (res) {
                for (let i = 0; i < memos.length; i++) {
                  if (memos[i].id == memoid) {
                    memos.splice(i, 1)
                  }
                  that.setData({
                    memos: memos
                  })
                }
                wx.showToast({
                  icon: 'none',
                  title: that.data.language.home.deleted,
                })
              } else {
                wx.showToast({
                  icon: 'error',
                  title: that.data.language.common.wrong,
                })
              }
            })
            .catch((err) => console.log(err))
        }
      }
    })
  },

  onReachBottom() {
    wx.vibrateShort({
      type: 'light'
    })
    this.getMemos('ARCHIVED')
  },

  onShow() {
    this.setData({
      language: app.language[wx.getStorageSync('language') ? wx.getStorageSync('language') : 'chinese']
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})