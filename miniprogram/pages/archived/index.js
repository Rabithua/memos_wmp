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
    limit: 100,
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
    wx.getStorage({
      key: "language",
      success(res) {
        if (res.data == 'chinese') {
          that.setData({
            language: app.language.chinese
          })
        } else {
          that.setData({
            language: app.language.english
          })
        }
      },
      fail(err) {
        that.setData({
          language: app.language.chinese
        })
      }
    })
    wx.getStorage({
      key: "openId",
      // encrypt: true,
      success(res) {
        // console.log(res.data)
        app.globalData.openId = res.data
        that.setData({
          url: app.globalData.url,
          openId: res.data
        })
        that.getMemos(that.data.openId, 'ARCHIVED')
      },
      fail(err) {
        console.log(err)
        wx.redirectTo({
          url: '../welcom/index',
        })
      }
    })
  },

  getMemos(openId, rowStatus) {
    var that = this
    app.api.getMemos(app.globalData.url, openId, this.data.limit, this.data.memos.length, rowStatus)
      .then(result => {
        // console.log(result)
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
          wx.showToast({
            icon: 'none',
            title: that.data.language.home.thatIsAll,
          })
          var arrMemos = app.memosArrenge(memos)
          that.setData({
            memos: that.data.memos.concat(arrMemos)
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
    wx.vibrateShort()
    var data = {
      pinned: !e.detail.pinned
    }
    var that = this
    app.api.changeMemoPinned(this.data.url, this.data.openId, e.detail.memoid, data)
      .then(res => {
        if (res.data) {
          wx.vibrateShort()
          if (!e.detail.pinned) {
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
            if (memos[i].id == e.detail.memoid) {
              memos[i].pinned = !e.detail.pinned
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
    // console.log(e.detail.rowstatus)
    var data = {
      rowStatus: e.detail.rowstatus == "NORMAL" ? 'ARCHIVED' : "NORMAL"
    }
    var url = this.data.url
    var openId = this.data.openId
    var id = e.detail.memoid
    this.editMemoRowStatus(url, openId, id, data)
  },

  editMemoRowStatus(url, openId, id, data) {
    var that = this
    app.api.editMemo(url, openId, id, data)
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
          wx.vibrateShort()
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
    var id = e.detail.memoid
    // console.log(e.detail.memoid)
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
          app.api.deleteMemo(that.data.url, that.data.openId, id)
            .then(res => {
              if (res) {
                for (let i = 0; i < memos.length; i++) {
                  if (memos[i].id == id) {
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})