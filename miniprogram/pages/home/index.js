// pages/home/index.js
import {
  formatMemoContent,
  parseHtmlToRawText
} from '../../js/marked'
var app = getApp()

Page({
  data: {
    halfDialog: 'closeHalfDialog',
    showSidebar: false,
    state: app.language.english.common.loading,
    memos: [],
    onlineColor: '#eeeeee',
    sendLoading: false,
    imgDraw: null,
    showShareImg: false,
    shareImgUrl: '',
    showTips: false,
    limit: 20
  },

  onLoad(options) {
    // console.log(app.api)
    var that = this
    this.setData({
      top_btn: app.globalData.top_btn,
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
      },
      fail(err) {
        console.log(err)
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
          openId: res.data,
          onlineColor: '#FCA417'
        })
        var openId = res.data
        wx.getStorage({
          key: "memos",
          success(res) {
            that.setData({
              storageMemos: res.data
            })
            that.getMemos(openId, 'NORMAL')
            that.getMe(openId)
            app.api.getTags(app.globalData.url, that.data.openId)
              .then(res => {
                that.setData({
                  tags: res.data
                })
                wx.setStorageSync('tags', res.data)
              })
              .catch((err) => console.log(err))
          },
          fail(err) {
            console.log(err)
            that.getMemos(openId, that.data.rowStatus)
            that.getMe(openId)
            app.api.getTags(that.data.url, that.data.openId)
              .then(res => {
                that.setData({
                  tags: res.data
                })
              })
              .catch((err) => console.log(err))
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

    that.checkTips()
  },

  onShow() {

  },

  onReachBottom() {
    wx.vibrateShort()
    this.getMemos(this.data.openId, 'NORMAL')
  },

  checkTips() {
    let that = this
    let showTips = wx.getStorageSync('showTips')
    console.log(showTips)
    if (showTips == 'false') {} else {
      wx.setStorageSync('showTips', 'true')
      setTimeout(() => {
        that.setData({
          showTips: true
        })
      }, 3000);
    }
  },

  setSidebar(e) {
    // console.log(e.touches[0])
    this.setData({
      sidebarStart: e.touches[0]
    })
  },

  showSidebar(e) {
    // console.log(e)
    let that = this
    if (!this.data.me) {
      this.getMe(this.data.openId)
    }
    if (!this.data.showSidebar) {
      if (this.data.sidebarStart.clientX) {
        if (e.touches[0].clientX - this.data.sidebarStart.clientX > 50 && Math.abs(e.touches[0].clientY - this.data.sidebarStart.clientY) < 20) {
          wx.vibrateShort()
          this.setData({
            showSidebar: true
          })
        } else if (e.touches[0].clientX - this.data.sidebarStart.clientX < -50 && Math.abs(e.touches[0].clientY - this.data.sidebarStart.clientY) < 20) {
          wx.vibrateShort()
          that.setData({
            sidebarStart: {}
          })
          wx.navigateTo({
            url: '../edit/index',
            events: {
              // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
              acceptDataFromOpenedPage: function (type, newMemo) {
                let memos = that.data.memos
                switch (type) {
                  case 'refresh':
                    console.log('refresh')
                    memos.map((memo, index) => {
                      if (memo.id == newMemo.id) {
                        memo.content = newMemo.content
                        memo.formatContent = formatMemoContent(newMemo.content)
                        memo.time = app.calTime(memo.createdTs)
                      }
                    })
                    that.setData({
                      memos: memos
                    })
                    app.globalData.memos = memos
                    wx.setStorageSync('memos', memos)
                    break;
                  case 'add':
                    console.log('add')
                    memos.unshift({
                      ...newMemo,
                      formatContent: formatMemoContent(newMemo.content),
                      time: app.calTime(newMemo.createdTs)
                    })
                    that.setData({
                      memos: memos
                    })
                    app.globalData.memos = memos
                    wx.setStorageSync('memos', memos)
                    break;
                  default:
                    break;
                }
              }
            }
          })
        }
      }
    }

  },

  setHeatMap() {
    let stats = this.data.stats
    let heatMap = []
    let column = []
    let today = new Date().getTime()
    // console.log(new Date(today).getDay())
    for (let i = 0; i < 12; i++) {
      if (i == 0) {
        for (let j = 0; j < (new Date().getDay()); j++) {
          column.unshift({
            memoID: null,
            time: app.fomaDay(today),
            num: 0
          })
          today = today - 86400000
        }
      } else {
        for (let j = 0; j < 7; j++) {
          column.unshift({
            memoID: null,
            time: app.fomaDay(today),
            num: 0
          })
          today = today - 86400000
        }
      }
      // console.log(column)
      heatMap.push(column)
      column = []
    }
    for (let k = 0; k < stats.length; k++) {
      let day = app.fomaDay(stats[k] * 1000)
      for (let l = 0; l < heatMap.length; l++) {
        for (let m = 0; m < heatMap[l].length; m++) {
          if (heatMap[l][m].time == day) {
            heatMap[l][m].num++
          }
        }
      }
    }
    this.setData({
      heatMap: heatMap
    })
  },

  hideSidebar() {
    wx.vibrateShort()
    this.setData({
      showSidebar: false
    })
  },

  onPainterOK(e) {
    console.log('生成成功', e)
    this.setData({
      imgDraw: null,
      showShareImg: true,
      shareImgUrl: e.detail.path
    })
    // wx.previewImage({
    //   current: e.detail.path, // 当前显示图片的 http 链接
    //   urls: [e.detail.path] // 需要预览的图片 http 链接列表
    // })
  },

  onPainterErr(e) {
    console.log('生成失败', e)
  },

  changeMemoPinned(e) {
    wx.vibrateShort()
    var data = {
      pinned: !e.detail.pinned
    }
    var that = this
    app.api.changeMemoPinned(this.data.url, this.data.openId, e.detail.memoid, data)
      .then(res => {
        console.log(res)
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
          var arrMemos = app.memosArrenge(memos)
          console.log(arrMemos)
          that.setData({
            memos: arrMemos
          })
          app.globalData.memos = arrMemos
          wx.setStorage({
            key: 'memos',
            data: arrMemos
          })
        }
      })
      .catch((err) => console.log(err))
  },

  changeMemoVisibility(e) {
    console.log(e.detail.memoid)
    let id = e.detail.memoid
    var that = this
    app.api.editMemo(this.data.url, this.data.openId, id, {
        visibility: (e.detail.visibility == 'PRIVATE' ? 'PUBLIC' : 'PRIVATE')
      })
      .then(res => {
        if (res.data) {
          var memos = that.data.memos
          for (let i = 0; i < memos.length; i++) {
            if (memos[i].id == id) {
              memos[i].visibility = (memos[i].visibility == 'PRIVATE' ? 'PUBLIC' : 'PRIVATE')
            }
          }
          that.setData({
            memos: memos
          })
          wx.vibrateShort()
          wx.showToast({
            icon: 'none',
            title: that.data.language.home.visibilityChange,
          })
          app.globalData.memos = memos
          wx.setStorage({
            key: 'memos',
            data: memos
          })
        }
      })
      .catch((err) => console.log(err))
  },

  dialogEdit(e) {
    // console.log(e)
    let that = this
    wx.vibrateShort()
    wx.navigateTo({
      url: '../edit/index?edit=true',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function (msg, data) {
          wx.vibrateShort()
          console.log(msg, data)
          let memos = that.data.memos
          switch (msg) {
            case 'refresh':
              memos.map((memo, index) => {
                if (memo.id == data.id) {
                  memo.content = data.content
                  memo.formatContent = formatMemoContent(data.content)
                }
              })
              that.setData({
                memos: memos
              })
              wx.setStorageSync('memos', memos)
              app.globalData.memos = memos
              break
            default:
              break;
          }
        }
      },
      success: function (res) {
        // 通过 eventChannel 向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          editMemoId: e.detail.memoid,
          memo: e.detail.content
        })
      }
    })
  },

  getMemos(openId, rowStatus, type) {
    var that = this
    let offset = this.data.memos.length
    if (type == 'refresh') {
      offset = 0
    }
    app.api.getMemos(app.globalData.url, openId, this.data.limit, offset, rowStatus)
      .then(result => {
        console.log(result)
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
              memos: [],
              storageMemos: [],
              state: that.data.language.home.state.online,
              onlineColor: '#07C160'
            })
            app.globalData.memos = arrMemos
            wx.setStorage({
              key: "memos",
              data: []
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
          var arrMemos = app.memosArrenge(memos)
          that.setData({
            memos: type == 'refresh' ? arrMemos : that.data.memos.concat(arrMemos),
            state: that.data.language.home.state.online,
            onlineColor: '#07C160'
          })
          app.globalData.memos = arrMemos
          wx.setStorage({
            key: "memos",
            data: that.data.memos
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
        that.setData({
          state: that.data.language.home.state.offline,
          onlineColor: '#eeeeee',
        })
        wx.stopPullDownRefresh()
      })
  },

  changeUserSetting(e) {
    console.log(e.currentTarget.dataset.item)
    let item = e.currentTarget.dataset.item
    let me = this.data.me
    let that = this
    wx.vibrateShort()
    if (item.key == 'locale') {
      if (item.value == "\"en\"") {
        item.value = "\"zh\""
        for (let i = 0; i < me.userSettingList.length; i++) {
          if (me.userSettingList[i].key == 'locale') {
            me.userSettingList[i].value = "\"zh\""
          }
        }
      } else {
        item.value = "\"en\""
        for (let i = 0; i < me.userSettingList.length; i++) {
          if (me.userSettingList[i].key == 'locale') {
            me.userSettingList[i].value = "\"en\""
          }
        }
      }
    } else if (item.key == "memoVisibility") {
      if (item.value == "\"PRIVATE\"") {
        item.value = "\"PUBLIC\""
        for (let i = 0; i < me.userSettingList.length; i++) {
          if (me.userSettingList[i].key == 'memoVisibility') {
            me.userSettingList[i].value = "\"PUBLIC\""
          }
        }
      } else {
        item.value = "\"PRIVATE\""
        for (let i = 0; i < me.userSettingList.length; i++) {
          if (me.userSettingList[i].key == 'memoVisibility') {
            me.userSettingList[i].value = "\"PRIVATE\""
          }
        }
      }
    } else {
      wx.showToast({
        icon: 'error',
        title: that.data.language.common.notSupport,
      })
      return
    }
    app.api.changeUserSetting(this.data.url, this.data.openId, item)
      .then(res => {
        console.log(res.data)
        if (res.data) {
          this.setData({
            me: me
          })
          if (item.value == "\"zh\"") {
            wx.setStorageSync('language', 'chinese')
            this.setData({
              language: app.language.chinese,
              state: app.language.chinese.home.state.online
            })
          } else if (item.value == "\"en\"") {
            wx.setStorageSync('language', 'english')
            this.setData({
              language: app.language.english,
              state: app.language.english.home.state.online
            })
          }
        } else {
          wx.vibrateLong()
          wx.showToast({
            icon: 'error',
            title: that.data.language.common.wrong,
          })
        }
      })
      .catch((err) => console.log(err))
  },

  getMe(openId) {
    var that = this
    app.api.getMe(app.globalData.url, openId)
      .then(result => {
        let me = result.data
        that.getStats(me.id)
        let defaultUserSettingList = [{
            UserID: result.data.id,
            key: 'locale',
            value: "\"en\""
          },
          {
            UserID: result.data.id,
            key: 'memoVisibility',
            value: "\"PRIVATE\""
          }
        ]
        me.day = parseInt((new Date().getTime() - me.createdTs * 1000) / 86400000)
        for (let j = 0; j < defaultUserSettingList.length; j++) {
          for (let i = 0; i < me.userSettingList.length; i++) {
            if (me.userSettingList[i].key == defaultUserSettingList[j].key) {
              defaultUserSettingList[j] = me.userSettingList[i]
              if (me.userSettingList[i].value == '\"zh\"') {
                wx.setStorageSync('language', 'chinese')
                that.setData({
                  language: app.language.chinese,
                  state: app.language.chinese.home.state.online
                })
              } else if (me.userSettingList[i].value == '\"en\"') {
                wx.setStorageSync('language', 'english')
                that.setData({
                  language: app.language.english,
                  state: app.language.english.home.state.online
                })
              }
            }
          }
        }
        me.userSettingList = defaultUserSettingList
        that.setData({
          me: me
        })
      })
  },

  getStats(id) {
    let that = this
    app.api.getStats(app.globalData.url, this.data.openId, id)
      .then(result => {
        console.log(result)
        this.setData({
          stats: result.data
        })
        that.setHeatMap()
      })
  },

  editMemoRowStatus(url, openId, id, data) {
    var that = this
    app.api.editMemo(url, openId, id, data)
      .then(res => {
        console.log(res)
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
          app.globalData.memos = memos
          wx.setStorage({
            key: 'memos',
            data: memos
          })
        }
      })
      .catch((err) => console.log(err))
  },

  showHeatTip(e) {
    console.log(e)
    wx.vibrateShort()
    let num = e.currentTarget.dataset.num
    let time = e.currentTarget.dataset.time
    let that = this
    clearTimeout(this.data.heatTipTimer)
    this.setData({
      showHeatTip: true,
      heatTip: {
        time: time,
        num: num
      }
    })
    let heatTipTimer = setTimeout(() => {
      that.setData({
        showHeatTip: false,
        heatTip: {}
      })
    }, 2000);

    this.setData({
      heatTipTimer: heatTipTimer
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
                  var arrMemos = app.memosArrenge(memos)
                  that.setData({
                    memos: arrMemos
                  })
                  app.globalData.memos = arrMemos
                  wx.setStorage({
                    key: "memos",
                    data: arrMemos
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

  goWelcom() {
    wx.vibrateShort()
    wx.showModal({
      confirmColor: '#07C160',
      title: this.data.language.home.goWelcomModal.title,
      content: this.data.language.home.goWelcomModal.content,
      confirmText: this.data.language.home.goWelcomModal.confirmText,
      cancelText: this.data.language.home.goWelcomModal.cancelText,
      success(res) {
        if (res.confirm) {
          wx.redirectTo({
            url: '../welcom/index',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  goSearch(e) {
    wx.vibrateShort()
    if (e.currentTarget.dataset.time) {
      wx.navigateTo({
        url: '../search/index?time=' + e.currentTarget.dataset.time,
      })
    } else {
      wx.navigateTo({
        url: '../search/index',
      })
    }

  },

  canvas_start(e) {
    console.log(e.detail.content)
    wx.showToast({
      icon: 'loading',
      title: this.data.language.common.loading,
    })
    this.setData({
      imgDraw: {
        "width": "900px",
        "height": "1200px",
        "borderRadius": "30px",
        "background": "#f5f5f5",
        "views": [{
            "type": "image",
            "url": "https://img.rabithua.club/others/sharecard.png",
            "css": {
              "width": "900px",
              "height": "1200px",
              "top": "0px",
              "left": "0px",
              "borderColor": "#ffffff",
              "mode": "scaleToFill"
            }
          },
          {
            "type": "text",
            "text": e.detail.content,
            "css": {
              "fontSize": "70px",
              "color": "#07C160",
              "width": "620px",
              "height": "400px",
              "top": "274px",
              "left": "132px",
              "fontWeight": "bolder",
              "maxLines": "6",
              "lineHeight": "80px",
              "textAlign": "left",
            }
          }
        ]
      }
    })
  },

  hideShreImg() {
    this.setData({
      showShareImg: false,
      shareImgUrl: ''
    })
  },

  hideTips() {
    this.setData({
      showTips: false
    })
  },

  closeTips() {
    wx.setStorageSync('showTips', 'false')
    this.setData({
      showTips: false
    })
  },

  none(e) {
    // console.log(e)
  },

  onPullDownRefresh() {
    let that = this
    that.setData({
      state: this.data.language.common.refreshing,
      onlineColor: '#FCA417'
    })
    that.getMemos(that.data.openId, 'NORMAL', 'refresh')
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 300);
  }
})