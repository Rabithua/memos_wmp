// pages/home/index.js
import {
  formatMemoContent,
  parseHtmlToRawText
} from '../../js/marked'
var app = getApp()

Page({
  data: {
    halfDialog: 'closeHalfDialog',
    memos: [],
    memo: '',
    onlineColor: '#eeeeee'
  },

  onLoad(options) {
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
              memos: res.data
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

  getMemos(openId) {
    var that = this
    app.getMemos(app.globalData.url + '/api/memo', openId).then(result => {
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
          memos[i].content = md
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
          onlineColor: '#07C160'
        })
        wx.setStorage({
          key: "memos",
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
    console.log(content)
    console.log(url)
    console.log(openId)
    if (content !== '') {
      app.sendMemo(url, openId, content).then(res => {
        console.log(res.data)
        if (res.data) {
          wx.vibrateShort()
          var newmemo = res.data
          newmemo.time = app.calTime(newmemo.createdTs)
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
    } else {
      wx.vibrateLong()
      wx.showToast({
        icon: 'none',
        title: '内容不能为空',
      })
    }

  },

  goWelcom() {
    wx.navigateTo({
      url: '../welcom/index',
    })
  },

  closeMemo() {
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