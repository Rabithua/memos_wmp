import {
  formatMemoContent
} from '../../js/marked'

var app = getApp()

Page({

  data: {
    memo: '',
    memoFocus: false,
    keyBoardHeight: '0',
    sendLoading: false,
    eventChannel: null,
    tags: [],
    resourceIdList: []
  },

  onLoad(o) {
    let that = this
    const eventChannel = this.getOpenerEventChannel()
    this.setData({
      eventChannel: eventChannel,
      // tags: wx.getStorageSync('tags')
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
          cursor: data.memo.length,
          resourceIdList: data.resourceIdList
        })
      })
    }

    if (wx.getStorageSync('openId')) {
      that.setData({
        url: wx.getStorageSync('url'),
        language: app.language[wx.getStorageSync('language') ? wx.getStorageSync('language') : 'chinese']
      })
    } else {
      wx.reLaunch({
        url: '../welcom/index',
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

  fileUpload() {
    let that = this
    wx.navigateTo({
      url: '../resource/index?selectMode=true',
      events: {
        addFiles: function (data) {
          that.setData({
            resourceIdList: data
          })
        }
      },
      success: function (res) {
        // 通过 eventChannel 向被打开页面传送数据
        res.eventChannel.emit('passResourceIdList', {
          resourceIdList: that.data.resourceIdList,
          memoId: that.data.editMemoId
        })
      }
    })
  },

  setTapPoint(e) {
    this.setData({
      bottomTapPoint: e.touches[0]
    })
  },

  none() {},

  inputUserTag(e) {
    let tag = e.currentTarget.dataset.tag
    this.setData({
      memoFocus: false
    })
    wx.vibrateShort({
      type: 'light'
    })
    setTimeout(() => {
      let memo = this.data.memo
      let cursor = this.data.cursor
      let newmemo = `${memo.slice(0, cursor)} #${tag} ${memo.substring(cursor, memo.length)}`
      let formatMemo = formatMemoContent(newmemo)
      this.setData({
        memo: newmemo,
        formatContent: formatMemo,
        memoFocus: true,
        cursor: cursor + 2,
      })
    }, 100);
  },

  slideFocus(e) {
    if (this.data.keyBoardHeight == 0) {
      if (e.touches[0].clientY - this.data.bottomTapPoint.clientY < -50 && Math.abs(e.touches[0].clientX - this.data.bottomTapPoint.clientX) < 20) {
        wx.vibrateShort({
          type: 'light'
        })
        this.setData({
          memoFocus: true
        })
      }
    }
  },

  setKeyBoard(e) {
    wx.vibrateShort({
      type: 'light'
    })
    this.setData({
      keyBoardHeight: (e.detail.height - 30).toString()
    })
  },

  memoFocus() {
    wx.vibrateShort({
      type: 'light'
    })
    this.setData({
      memoFocus: true
    })
  },

  memoBlur(e) {
    wx.vibrateShort({
      type: 'light'
    })
    this.setData({
      keyBoardHeight: '0',
      cursor: this.data.memo.length,
      memoFocus: false
    })
  },

  memoInput(e) {
    let formatMemo = formatMemoContent(e.detail.value)
    this.setData({
      memo: e.detail.value,
      formatContent: formatMemo,
      cursor: e.detail.cursor
    })
    wx.setStorageSync('memoDraft', e.detail.value)
  },

  inputTag(e) {
    wx.vibrateShort({
      type: 'light'
    })
    setTimeout(() => {
      let memo = this.data.memo
      let cursor = this.data.cursor
      let newmemo = `${memo.slice(0, cursor)} #todo ${memo.substring(cursor, memo.length)}`
      let formatMemo = formatMemoContent(newmemo)
      this.setData({
        memo: newmemo,
        formatContent: formatMemo,
        memoFocus: true,
        cursor: newmemo.length,
      })
    }, 100);
  },

  inputTodo() {
    wx.vibrateShort({
      type: 'light'
    })
    this.setData({
      memoFocus: false
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
    wx.vibrateShort({
      type: 'light'
    })
    this.setData({
      memoFocus: false
    })
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
    wx.vibrateShort({
      type: 'light'
    })
    var that = this
    var content = this.data.memo
    if (content !== '' || this.data.resourceIdList.length > 0) {
      this.setData({
        sendLoading: true
      })
      if (!this.data.editMemoId) {
        this.sendMemo()
      } else {
        var url = this.data.url
        var id = this.data.editMemoId
        var data = {
          id: this.data.editMemoId,
          content: content,
          resourceIdList: this.data.resourceIdList
        }
        that.editMemoContent(url, id, data)
      }
    } else {
      wx.vibrateLong()
      wx.showToast({
        icon: 'error',
        title: that.data.language.home.editErr,
      })
    }
  },

  editMemoContent(url, id, data) {
    app.api.editMemo(url, id, data)
      .then(res => {
        if (res) {
          wx.setStorageSync('memoDraft', '')
          wx.navigateBack()
        }
      })
      .catch((err) => console.log(err))
  },


  sendMemo() {
    var resourceIdList = this.data.resourceIdList
    var content = this.data.memo
    var url = this.data.url
    var that = this
    app.api.sendMemo(url, content, resourceIdList)
      .then(res => {
        if (res) {
          wx.setStorageSync('memoDraft', '')
          if (getCurrentPages().length > 1) {
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

  onShow() {
    this.setData({
      language: app.language[wx.getStorageSync('language') ? wx.getStorageSync('language') : 'chinese']
    })
  }

})