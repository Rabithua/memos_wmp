// pages/edit/index.ts
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
    memo: '',
    memoFocus: false,
    keyBoardHeight: '0',
    sendLoading: false,
    eventChannel: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(o) {
    let that = this
    const eventChannel = this.getOpenerEventChannel()
    this.setData({
      eventChannel: eventChannel
    })

    try {
      let memoDraft = wx.getStorageSync('memoDraft')
      if (memoDraft) {
        let formatMemo = formatMemoContent(memoDraft)
        that.setData({
          memo: memoDraft,
          formatContent: formatMemo,
          cursor: memoDraft.length
        })
      }
    } catch (error) {}

    //页面监听器
    if (eventChannel.listener) {
      eventChannel.once('acceptDataFromOpenerPage', function (data) {
        let formatMemo = formatMemoContent(data.memo)
        that.setData({
          ...data,
          formatContent: formatMemo,
          cursor: data.memo.length
        })
      })
    }

    //获取url以及openid判断登录态
    wx.getStorage({
      key: "openId",
      // encrypt: true,
      success(res) {
        // console.log(res.data)
        app.globalData.openId = res.data
        that.setData({
          url: app.globalData.url,
          openId: res.data,
        })
      },
      fail(err) {
        console.log(err)
        wx.redirectTo({
          url: '../welcom/index',
        })
      }
    })

    this.setData({
      language: app.language.english
    })
    wx.getStorage({
      key: "language",
      success(res) {
        if (res.data == 'chinese') {
          that.setData({
            language: app.language.chinese
          })
        }
        if (o.edit) {
          wx.setNavigationBarTitle({
            title: that.data.language.edit.pageTitle_edit
          })
          that.setData({
            memoFocus: true
          })
        } else {
          wx.setNavigationBarTitle({
            title: that.data.language.edit.pageTitle_add
          })
          that.setData({
            memoFocus: true
          })
        }
      },
      fail(err) {
        console.log(err)
      }
    })
  },

  setTapPoint(e) {
    this.setData({
      bottomTapPoint: e.touches[0]
    })
  },

  slideFocus(e) {
    if (this.data.keyBoardHeight == 0) {
      if (e.touches[0].clientY - this.data.bottomTapPoint.clientY < -50 && Math.abs(e.touches[0].clientX - this.data.bottomTapPoint.clientX) < 20) {
        wx.vibrateShort()
        this.setData({
          memoFocus: true
        })
      }
    }

  },

  memoFocus(e) {
    wx.vibrateShort()
    this.setData({
      keyBoardHeight: (e.detail.height - 30).toString()
    })
  },

  memoBlur(e) {
    wx.vibrateShort()
    // console.log(e)
    this.setData({
      keyBoardHeight: '0',
      cursor: this.data.memo.length
    })
  },

  memoInput(e) {
    // console.log(e.detail.cursor)
    // console.log(e.detail.value)
    let formatMemo = formatMemoContent(e.detail.value)
    this.setData({
      memo: e.detail.value,
      formatContent: formatMemo,
      cursor: e.detail.cursor
    })
    wx.setStorageSync('memoDraft', e.detail.value)
  },

  inputTag(e) {
    wx.vibrateShort()
    setTimeout(() => {
      let memo = this.data.memo
      let cursor = this.data.cursor
      let newmemo = memo.slice(0, cursor) + ' #todo ' + memo.substring(cursor, memo.length)
      let formatMemo = formatMemoContent(newmemo)
      this.setData({
        memo: newmemo,
        formatContent: formatMemo,
        memoFocus: true,
        cursor: cursor + 2,
      })
    }, 100);
  },

  inputTodo() {
    wx.vibrateShort()
    wx.showToast({
      icon: 'none',
      title: ' - [x] DONE',
    })
    setTimeout(() => {
      let memo = this.data.memo
      let cursor = this.data.cursor
      let newmemo = memo.slice(0, cursor) + '\n- [ ] ' + memo.substring(cursor, memo.length)
      let formatMemo = formatMemoContent(newmemo)
      this.setData({
        memo: newmemo,
        formatContent: formatMemo,
        memoFocus: true,
        cursor: cursor + 7,
      })
    }, 100);
  },

  inputCode() {
    wx.vibrateShort()
    // console.log(this.data.memo + '\n```\n```')
    setTimeout(() => {
      let memo = this.data.memo
      let cursor = this.data.cursor
      let newmemo = memo.slice(0, cursor) + '\n```\n\n```' + memo.substring(cursor, memo.length)
      let formatMemo = formatMemoContent(newmemo)
      this.setData({
        memo: newmemo,
        formatContent: formatMemo,
        memoFocus: true,
        cursor: cursor + 5,
      })
    }, 100);
  },

  send() {
    wx.vibrateShort()
    var that = this
    var content = this.data.memo
    if (content !== '') {
      this.setData({
        sendLoading: true
      })
      if (!this.data.editMemoId) {
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
        icon: 'error',
        title: that.data.language.home.editErr,
      })
    }
  },

  editMemoContent(url, openId, id, data) {
    let that = this
    app.api.editMemo(url, openId, id, data)
      .then(res => {
        // console.log(res)
        if (res.data) {
          wx.setStorageSync('memoDraft', '')
          if (getCurrentPages().length > 1) {
            let eventChannel = that.data.eventChannel
            eventChannel.emit('acceptDataFromOpenedPage', 'refresh', data.content)
            wx.navigateBack()
          }
        }
      })
      .catch((err) => console.log(err))
  },


  sendMemo() {
    var content = this.data.memo
    var url = this.data.url
    var openId = this.data.openId
    var that = this
    app.api.sendMemo(url, openId, content)
      .then(res => {
        // console.log(res.data)
        if (res.data) {
          wx.setStorageSync('memoDraft', '')
          if (getCurrentPages().length > 1) {
            let eventChannel = that.data.eventChannel
            eventChannel.emit('acceptDataFromOpenedPage', 'refresh')
            wx.navigateBack()
          }
        } else {
          wx.vibrateLong()
          wx.showToast({
            icon: 'error',
            title: that.data.language.common.wrong,
          })
          that.setData({
            sendLoading: false
          })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})