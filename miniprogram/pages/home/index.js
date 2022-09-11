// pages/home/index.js
import {
  formatMemoContent,
  parseHtmlToRawText
} from '../../js/marked'
var app = getApp()

Page({
  data: {
    halfDialog: 'closeHalfDialog',
    edit: false,
    editMemoId: 0,
    memos: [],
    showMemos: [],
    memo: '',
    onlineColor: '#eeeeee',
    showArchived: false,
    sendLoading: false
  },

  onLoad(options) {
    // console.log(app.api)
    var that = this
    this.setData({
      top_btn: app.globalData.top_btn
    })
    wx.getStorage({
      key: "openId",
      // encrypt: true,
      success(res) {
        // console.log(res.data)
        app.globalData.openId = res.data
        that.setData({
          url: app.globalData.url,
          openId: res.data,
          onlineColor: '#FCA417'
        })
        var openId = res.data
        wx.getStorage({
          key: "memos",
          success(res) {
            that.setData({
              memos: res.data,
              showMemos: res.data.slice(0, 10)
            })
            that.getMemos(openId)
          },
          fail(err) {
            console.log(err)
            that.getMemos(openId)
          }
        })
      },
      fail(err) {
        console.log(err)
        wx.redirectTo({
          url: '../welcom/index',
        })
      }
    })
  },

  onReachBottom() {
    var memos = this.data.memos
    var showMemos = this.data.showMemos
    if (showMemos.length == memos.length) {
      wx.vibrateShort()
      wx.showToast({
        icon: 'none',
        title: '已全部加载',
      })
    } else {
      this.setData({
        showMemos: memos.slice(0, showMemos.length + 5)
      })
    }

  },

  inputTag() {
    this.setData({
      memo: this.data.memo + '#tag '
    })
  },

  inputTodo() {
    wx.vibrateShort()
    wx.showToast({
      icon:'none',
      title: ' - [x] 表示done',
    })
    this.setData({
      memo: this.data.memo + ' - [ ] '
    })
  },

  inputCode() {
    console.log(this.data.memo + '\n```\n```')
    this.setData({
      memo: this.data.memo + '\n```\n```'
    })
  },

  changeMemoPinned(e) {
    console.log(e.detail.memoid)
    console.log(e.detail.pinned)
    var data = {
      pinned: !e.detail.pinned
    }
    var that = this
    app.api.changeMemoPinned(this.data.url, this.data.openId, e.detail.memoid, data).then(res => {
      console.log(res)
      if (res.data) {
        wx.vibrateShort()
        if (!e.detail.pinned) {
          wx.showToast({
            icon: 'none',
            title: '已置顶',
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '已取消置顶',
          })
        }
        var memos = that.data.memos
        for (let i = 0; i < memos.length; i++) {
          if (memos[i].id == e.detail.memoid) {
            memos[i].pinned = !e.detail.pinned
          }
        }
        var arrMemos = app.memosArrenge(memos)
        console.log(arrMemos)
        that.setData({
          memos: arrMemos,
          showMemos: arrMemos.slice(0, that.data.showMemos.length),
        })
        app.globalData.memos = arrMemos
        wx.setStorage({
          key: 'memos',
          data: arrMemos
        })
      }
    })
  },

  changeshowArchived() {
    wx.vibrateShort()
    this.setData({
      showArchived: !this.data.showArchived
    })
  },

  memoInput(e) {
    // console.log(e.detail.value)
    this.setData({
      memo: e.detail.value
    })
  },

  dialogEdit(e) {
    // console.log(e)
    this.setData({
      halfDialog: 'showHalfDialog',
      edit: true,
      editMemoId: e.detail.memoid,
      memo: e.detail.content
    })
  },

  getMemos(openId) {
    var that = this
    app.api.getMemos(app.globalData.url, openId).then(result => {
      console.log(result.data)
      if (!result.data) {
        wx.redirectTo({
          url: '../welcom/index',
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
        }
        var arrMemos = app.memosArrenge(memos)
        that.setData({
          memos: arrMemos,
          showMemos: arrMemos.slice(0, 10),
          onlineColor: '#07C160'
        })
        app.globalData.memos = arrMemos
        wx.setStorage({
          key: "memos",
          data: arrMemos
        })
      }
    })
  },

  dialog() {
    var that = this
    var content = this.data.memo
    if (content !== '') {
      this.setData({
        sendLoading: true
      })
      if (!this.data.edit) {
        this.sendMemo()
      } else {
        var url = this.data.url
        var openId = this.data.openId
        var id = this.data.editMemoId
        var data = {
          content: content
        }
        that.editMemoContent(url, openId, id, data)
      }
    } else {
      wx.vibrateLong()
      wx.showToast({
        icon: 'none',
        title: '内容不能为空',
      })
    }
  },

  editMemoContent(url, openId, id, data) {
    var that = this
    app.api.editMemo(url, openId, id, data).then(res => {
      console.log(res)
      if (res.data) {
        var memos = that.data.memos
        for (let i = 0; i < memos.length; i++) {
          if (memos[i].id == that.data.editMemoId) {
            memos[i].content = that.data.memo
            memos[i].formatContent = formatMemoContent(that.data.memo)
          }
        }
        that.setData({
          memos: memos,
          showMemos: memos.slice(0, that.data.showMemos.length),
          halfDialog: 'closeHalfDialog',
          sendLoading: false,
          memo: '',
          editMemoId: 0,
          edit: false
        })
        wx.vibrateShort()
        wx.showToast({
          icon: 'none',
          title: '已更改',
        })
        app.globalData.memos = memos
        wx.setStorage({
          key: 'memos',
          data: memos
        })
      }
    })
  },

  editMemoRowStatus(url, openId, id, data) {
    var that = this
    app.api.editMemo(url, openId, id, data).then(res => {
      console.log(res)
      if (res.data) {
        var memos = that.data.memos
        for (let i = 0; i < memos.length; i++) {
          if (memos[i].id == id) {
            memos[i].rowStatus = data.rowStatus
          }
        }
        that.setData({
          memos: memos,
          showMemos: memos.slice(0, that.data.showMemos.length)
        })
        wx.vibrateShort()
        wx.showToast({
          icon: 'none',
          title: '归档状态已更改',
        })
        app.globalData.memos = memos
        wx.setStorage({
          key: 'memos',
          data: memos
        })
      }
    })
  },

  sendMemo() {
    var content = this.data.memo
    var url = app.globalData.url + '/api/memo'
    var openId = this.data.openId
    var memos = this.data.memos
    var that = this
    app.api.sendMemo(url, openId, content).then(res => {
      console.log(res.data)
      if (res.data) {
        wx.vibrateShort()
        var newmemo = res.data
        newmemo.time = app.calTime(newmemo.createdTs)
        let md = formatMemoContent(newmemo.content)
        newmemo.formatContent = md
        memos.unshift(newmemo)
        var arrMemos = app.memosArrenge(memos)
        that.setData({
          memos: arrMemos,
          showMemos: arrMemos.slice(0, this.data.showMemos.length + 1),
          sendLoading: false,
          memo: ''
        })
        app.globalData.memos = arrMemos
        wx.setStorage({
          key: 'memos',
          data: arrMemos
        })
      } else {
        wx.vibrateLong()
        wx.showToast({
          icon: 'none',
          title: 'something wrong',
        })
      }
    })
  },

  deleteMemoFaker(e) {
    console.log(e.detail.rowstatus)
    var data = {
      rowStatus: e.detail.rowstatus == "NORMAL" ? 'ARCHIVED' : "NORMAL"
    }
    var url = this.data.url
    var openId = this.data.openId
    var id = e.detail.memoid
    this.editMemoRowStatus(url, openId, id, data)
  },

  deleteMemo(e) {
    var that = this
    var memos = this.data.memos
    var id = e.detail.memoid
    console.log(e.detail.memoid)
    wx.vibrateLong()
    app.api.deleteMemo(this.data.url, this.data.openId, id).then(res => {
      if (res) {
        for (let i = 0; i < memos.length; i++) {
          if (memos[i].id == id) {
            memos.splice(i, 1)
          }
          var arrMemos = app.memosArrenge(memos)
          that.setData({
            memos: arrMemos,
            showMemos: arrMemos.slice(0, that.data.showMemos.length)
          })
          app.globalData.memos = arrMemos
          wx.setStorage({
            key: "memos",
            data: arrMemos
          })
        }
        wx.showToast({
          icon: 'none',
          title: '已删除！',
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: 'something wrong',
        })
      }
    })
  },

  goWelcom() {
    wx.vibrateShort()
    wx.navigateTo({
      url: '../welcom/index',
    })
  },

  goSearch() {
    wx.vibrateShort()
    wx.navigateTo({
      url: '../search/index',
    })
  },

  changeCloseMemo() {
    wx.vibrateShort()
    if (this.data.halfDialog == 'showHalfDialog' && this.data.edit) {
      this.setData({
        halfDialog: 'closeHalfDialog',
        memo: '',
        editMemoId: 0,
        edit: false
      })
    } else if (this.data.halfDialog == 'closeHalfDialog') {
      this.setData({
        halfDialog: 'showHalfDialog'
      })
    } else {
      this.setData({
        halfDialog: 'closeHalfDialog'
      })
    }

  },

  copy(e) {
    console.log(e)
    wx.vibrateShort()
    wx.setClipboardData({
      data: e.target.dataset.content
    })
  }
})