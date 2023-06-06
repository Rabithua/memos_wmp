import {
  formatMemoContent
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
    limit: 20,
    showExplore: false,
    x: 0
  },

  onLoad() {
    var that = this
    this.setData({
      top_btn: app.globalData.top_btn
    })
    this.ifHideExplore()
    if (wx.getStorageSync('openId')) {
      this.getAll()
    } else {
      app.getUnionId().then((r) => {
        wx.setStorageSync('openId', r)
        that.getAll()
      }).catch((err) => {
        console.log(err)
        that.getAll()
      })
    }

  },

  getAll() {
    let that = this
    that.setData({
      url: app.globalData.url,
      onlineColor: '#FCA417'
    })
    that.getMemos('NORMAL')
    that.getMe()
    app.api.getTags(app.globalData.url)
      .then(res => {
        that.setData({
          tags: res.data
        })
        wx.setStorageSync('tags', res.data)
      })
      .catch((err) => console.log(err))
    wx.getStorage({
      key: "memos",
      success(res) {
        that.setData({
          storageMemos: res.data
        })
      }
    })
    that.checkTips()
  },

  scorllRef(id) {
    clearTimeout(this.data.scorllTimer)
    let scorllTimer = setTimeout(() => {
      let that = this
      wx.createSelectorQuery().select(id).boundingClientRect(function (res) {
        let x = res.top + that.data.x - that.data.top_btn.top - that.data.top_btn.height - 20
        console.log(res, x)
        wx.pageScrollTo({
          scrollTop: x,
          duration: 300
        })
        that.setData({
          x
        })
      }).exec()
    }, 500);
    this.setData({
      scorllTimer
    })
  },

  ifHideExplore() {
    const env = __wxConfig.envVersion;
    if (env == "release") {
      this.setData({
        showExplore: true,
      });
    }
  },

  onHide() {
    this.hideSidebar()
  },

  onPageScroll(e) {
    this.setData({
      x: e.scrollTop
    })
  },

  onShow() {
    this.setData({
      language: app.language[wx.getStorageSync('language') ? wx.getStorageSync('language') : 'chinese']
    })
  },

  onReachBottom() {
    wx.vibrateShort({
      type: 'light'
    })
    this.loadMore()
  },

  loadMore() {
    wx.vibrateShort({
      type: 'light'
    })
    this.getMemos('NORMAL')
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

  checkTips() {
    let that = this
    let showTips = wx.getStorageSync('showTips')
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

  showSideBar() {
    wx.vibrateShort({
      type: 'light'
    })
    this.setData({
      showSidebar: true
    })
  },

  touchMove(e) {
    // console.log(e)
    let that = this
    if (!this.data.me) {
      this.getMe()
    }
    if (!this.data.showSidebar) {
      if (this.data.sidebarStart.clientX) {
        if (e.touches[0].clientX - this.data.sidebarStart.clientX > 50 && Math.abs(e.touches[0].clientY - this.data.sidebarStart.clientY) < 20) {
          wx.vibrateShort({
            type: 'light'
          })
          this.setData({
            showSidebar: true
          })
        } else if (e.touches[0].clientX - this.data.sidebarStart.clientX < -50 && Math.abs(e.touches[0].clientY - this.data.sidebarStart.clientY) < 20) {
          wx.vibrateShort({
            type: 'light'
          })
          that.setData({
            sidebarStart: {}
          })
          wx.navigateTo({
            url: '../edit/index',
            events: {
              // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
              acceptDataFromOpenedPage: function (type, newMemo) {
                newMemo = app.memosRescourse(newMemo)
                let memos = that.data.memos
                switch (type) {
                  case 'add':
                    memos.unshift({
                      ...newMemo,
                      formatContent: formatMemoContent(newMemo.content),
                      time: app.calTime(newMemo.createdTs),
                    })
                    that.setData({
                      memos: memos
                    })
                    that.scorllRef(`#memo${newMemo.id}`)
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
    wx.vibrateShort({
      type: 'light'
    })
    this.setData({
      showSidebar: false
    })
  },

  changeMemoPinned(e) {
    wx.vibrateShort({
      type: 'light'
    })
    let pinned = e.currentTarget.dataset.pinned
    let memoid = e.currentTarget.dataset.memoid
    var data = {
      pinned: !pinned
    }
    var that = this
    app.api.changeMemoPinned(this.data.url, memoid, data)
      .then(res => {
        console.log(res)
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
            memos
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

  changeMemoVisibility(e) {
    let visibility = e.currentTarget.dataset.visibility
    let memoid = e.currentTarget.dataset.memoid
    let id = memoid
    var that = this
    app.api.editMemo(this.data.url, id, {
        visibility: (visibility == 'PRIVATE' ? 'PUBLIC' : 'PRIVATE')
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
          wx.vibrateShort({
            type: 'light'
          })
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
    let memoid = e.currentTarget.dataset.memoid
    let content = e.currentTarget.dataset.content
    let that = this
    let memos = this.data.memos
    let resourceIdList = memos.filter(item => item.id == memoid)[0].resourceList.map(item => item.id)
    wx.vibrateShort({
      type: 'light'
    })
    wx.navigateTo({
      url: '../edit/index?edit=true',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function (msg, newMemo) {
          wx.vibrateShort({
            type: 'light'
          })
          console.log(msg, newMemo)
          let memos = that.data.memos
          newMemo = app.memosRescourse(newMemo)
          switch (msg) {
            case 'refresh':
              console.log(newMemo)
              memos.map((memo, index) => {
                if (memo.id == newMemo.id) {
                  memos[index] = {
                    ...newMemo,
                    formatContent: formatMemoContent(newMemo.content),
                    time: app.calTime(newMemo.createdTs)
                  }
                }
              })
              that.setData({
                memos: memos
              })
              that.scorllRef(`#memo${newMemo.id}`)
              app.globalData.memos = memos
              wx.setStorageSync('memos', memos)
              break;
            default:
              break;
          }
        }
      },
      success: function (res) {
        // 通过 eventChannel 向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          editMemoId: memoid,
          memo: content,
          resourceIdList
        })
      }
    })
  },

  getMemos(rowStatus, type) {
    var that = this
    let offset = this.data.memos.length
    if (type == 'refresh') {
      offset = 0
    }
    app.api.getMemos(app.globalData.url, this.data.limit, offset, rowStatus)
      .then(result => {
        if (!result.data) {} else if (result.data.length == 0) {
          if (that.data.memos.length == 0) {
            that.setData({
              memos: [],
              storageMemos: [],
              state: that.data.language.home.state.online,
              onlineColor: '#07C160'
            })
            app.globalData.memos = memos
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
          that.setData({
            memos: type == 'refresh' ? memos : that.data.memos.concat(memos),
            state: that.data.language.home.state.online,
            onlineColor: '#07C160'
          })
          app.globalData.memos = memos
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
          icon: 'none',
          title: that.data.language.common.wrong,
        })
        that.setData({
          state: that.data.language.home.state.offline,
          onlineColor: '#eeeeee',
          memos: wx.getStorageSync('memos')
        })
        wx.stopPullDownRefresh()
      })
  },

  changeUserSetting(e) {
    console.log(e.currentTarget.dataset.item)
    let item = e.currentTarget.dataset.item
    delete item.UserID
    let me = this.data.me
    let that = this
    wx.vibrateShort({
      type: 'light'
    })
    if (item.key == 'locale') {
      if (item.value == "\"en\"") {
        item.value = "\"zh-Hans\""
        for (let i = 0; i < me.userSettingList.length; i++) {
          if (me.userSettingList[i].key == 'locale') {
            me.userSettingList[i].value = "\"zh-Hans\""
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
    } else if (item.key == "memo-visibility") {
      if (item.value == "\"PRIVATE\"") {
        item.value = "\"PUBLIC\""
        for (let i = 0; i < me.userSettingList.length; i++) {
          if (me.userSettingList[i].key == 'memo-visibility') {
            me.userSettingList[i].value = "\"PUBLIC\""
          }
        }
      } else {
        item.value = "\"PRIVATE\""
        for (let i = 0; i < me.userSettingList.length; i++) {
          if (me.userSettingList[i].key == 'memo-visibility') {
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
    app.api.changeUserSetting(this.data.url, item)
      .then(res => {
        console.log(res.data)
        if (res.data) {
          this.setData({
            me: me
          })
          if (item.value == "\"zh-Hans\"") {
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

  getMe() {
    var that = this
    app.api.getMe(app.globalData.url)
      .then(result => {
        let me = result.data
        that.getStats(me.id)
        let defaultUserSettingList = [{
            key: 'locale',
            value: "\"en\""
          },
          {
            key: 'memo-visibility',
            value: "\"PRIVATE\""
          }
        ]
        me.day = parseInt((new Date().getTime() - me.createdTs * 1000) / 86400000)
        for (let j = 0; j < defaultUserSettingList.length; j++) {
          for (let i = 0; i < me.userSettingList.length; i++) {
            if (me.userSettingList[i].key == defaultUserSettingList[j].key) {
              defaultUserSettingList[j] = me.userSettingList[i]
              if (me.userSettingList[i].value == '\"zh-Hans\"') {
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
    app.api.getStats(app.globalData.url, id)
      .then(result => {
        this.setData({
          stats: result.data
        })
        that.setHeatMap()
      })
  },

  editMemoRowStatus(url, id, data) {
    var that = this
    app.api.editMemo(url, id, data)
      .then(res => {
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
    wx.vibrateShort({
      type: 'light'
    })
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
    let rowstatus = e.currentTarget.dataset.rowstatus
    var data = {
      rowStatus: rowstatus == "NORMAL" ? 'ARCHIVED' : "NORMAL"
    }
    var url = this.data.url
    var id = e.currentTarget.dataset.memoid
    this.editMemoRowStatus(url, id, data)
  },

  deleteMemo(e) {
    var that = this
    var memos = this.data.memos
    var id = e.currentTarget.dataset.memoid
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
          app.api.deleteMemo(that.data.url, id)
            .then(res => {
              if (res) {
                for (let i = 0; i < memos.length; i++) {
                  if (memos[i].id == id) {
                    memos.splice(i, 1)
                  }
                  that.setData({
                    memos
                  })
                  app.globalData.memos = memos
                  wx.setStorage({
                    key: "memos",
                    data: memos
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
    wx.vibrateShort({
      type: 'light'
    })
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
    wx.vibrateShort({
      type: 'light'
    })
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

  goEdit() {
    wx.vibrateShort({
      type: 'light',
    })
    wx.navigateTo({
      url: '../edit/index',
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

  refreshMemo() {
    let that = this
    that.setData({
      state: this.data.language.common.refreshing,
      onlineColor: '#FCA417'
    })
    that.getMemos('NORMAL', 'refresh')
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 300);
  },
  onPullDownRefresh() {
    let that = this
    that.setData({
      state: this.data.language.common.refreshing,
      onlineColor: '#FCA417'
    })
    that.getMemos('NORMAL', 'refresh')
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 300);
  }
})