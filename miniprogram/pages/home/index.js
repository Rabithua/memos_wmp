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
    onlineColor: '#eeeeee'
  },

  onLoad(options) {
    // console.log(app.api)
    var that = this
    this.setData({
      top_btn: app.globalData.top_btn
    })
    wx.getStorage({
      key: "openId",
      encrypt: true,
      success(res) {
        // console.log(res.data)
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

  dialogEdit(e) {
    console.log(e)
    this.setData({
      halfDialog: 'showHalfDialog',
      edit: true,
      editMemoId: e.target.dataset.memoid,
      memo: e.target.dataset.content
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
          //开启markdown解析请取消注释并在app.wxss中注释/* white-space: pre-wrap; */
          // let md = app.towxml(memos[i].content, 'markdown', {
          //   base: app.globalData.url, // 相对资源的base路径
          //   theme: 'light', // 主题，默认`light`
          //   events: { // 为元素绑定的事件方法
          //     tap: (e) => {
          //       console.log('tap', e);
          //     }
          //   }
          // })
          // memos[i].content = md
        }
        that.setData({
          memos: memos,
          showMemos: memos.slice(0, 10),
          onlineColor: '#07C160'
        })
        wx.setStorage({
          key: "memos",
          data: memos
        })
      }
    })
  },

  dialog() {
    var that = this
    var content = this.data.memo
    if (content !== '') {
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
          showMemos: memos.slice(0,that.data.showMemos.length),
          halfDialog: 'closeHalfDialog',
          memo: '',
          editMemoId: 0,
          edit: false
        })
        wx.vibrateShort()
        wx.showToast({
          icon: 'none',
          title: '已更改',
        })
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
        //开启markdown解析请取消注释并在app.wxss中注释/* white-space: pre-wrap; */
        // newmemo.content = app.towxml(res.data.content, 'markdown', {
        //   base: app.globalData.url,
        //   theme: 'light',
        //   events: {
        //     tap: (e) => {
        //       console.log('tap', e);
        //     }
        //   }
        // })
        memos.unshift(newmemo)
        that.setData({
          memos: memos,
          showMemos: memos.slice(0,this.data.showMemos.length + 1),
          memo: ''
        })
        wx.setStorage({
          key: 'memos',
          data: memos
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

  deleteMemoFaker() {
    wx.vibrateShort()
    wx.showToast({
      icon: 'none',
      title: '长按删除！',
    })

  },

  deleteMemo(e) {
    var that = this
    var memos = this.data.memos
    var id = e.target.dataset.memoid
    console.log(e.target.dataset.memoid)
    wx.vibrateLong()
    app.api.deleteMemo(this.data.url, this.data.openId, id).then(res => {
      if (res) {
        for (let i = 0; i < memos.length; i++) {
          if (memos[i].id == id) {
            memos.splice(i, 1)
          }
          that.setData({
            memos: memos,
            showMemos: memos.slice(0, that.data.showMemos.length)
          })
          wx.setStorage({
            key: "memos",
            data: memos
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
    wx.navigateTo({
      url: '../welcom/index',
    })
  },

  changeCloseMemo() {
    if (this.data.halfDialog == 'closeHalfDialog') {
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