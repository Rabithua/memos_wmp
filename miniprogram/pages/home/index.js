import {
  formatMemoContent
} from '../../js/marked'
var app = getApp()

Page({
  changePinFolder() {
    wx.vibrateShort({
      type: 'light',
    })
    this.setData({
      pinFolder: !this.data.pinFolder
    })
  },

  test() {

  },

  data: {
    pinFolder: false,
    previewImage: false,
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
    // x: 0,
    language: {}
  },

  onLoad() {
    var that = this
    this.setData({
      top_btn: app.globalData.top_btn
    })
    this.ifHideExplore()
    if (!wx.getStorageSync('url')) {
      wx.setStorageSync('url', app.globalData.url)
    }
    if (wx.getStorageSync('cookie')) {
      this.getAll()
    } else {
      wx.reLaunch({
        url: '../welcom/index',
      })
    }

  },

  goUser() {
    wx.vibrateShort({
      type: 'light',
    })
    wx.navigateTo({
      url: `../user/index?id=${this.data.me.id}`,
    })
  },

  getAll() {
    let that = this
    that.setData({
      url: wx.getStorageSync('url'),
      onlineColor: '#FCA417'
    })
    that.getMe()
    app.api.getTags(wx.getStorageSync('url'))
      .then(res => {
        that.setData({
          tags: res
        })
        wx.setStorageSync('tags', res)
      })
      .catch((err) => console.log(err))
    that.checkTips()
  },

  // scorllRef(id) {
  //   clearTimeout(this.data.scorllTimer)
  //   let scorllTimer = setTimeout(() => {
  //     let that = this
  //     wx.createSelectorQuery().select(id).boundingClientRect(function (res) {
  //       let x = res.top + that.data.x - that.data.top_btn.top - that.data.top_btn.height - 20
  //       console.log(res, x)
  //       wx.pageScrollTo({
  //         scrollTop: x,
  //         duration: 300
  //       })
  //       that.setData({
  //         x
  //       })
  //     }).exec()
  //   }, 500);
  //   this.setData({
  //     scorllTimer
  //   })
  // },

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

  // onPageScroll(e) {
  //   this.setData({
  //     x: e.scrollTop
  //   })
  // },

  onShow() {
    let language = app.language[wx.getStorageSync('language') ? wx.getStorageSync('language') : 'chinese']
    this.setData({
      language,
      settings: wx.getStorageSync('settings') ? wx.getStorageSync('settings') : language.setting.settings,
    })
    if (this.data.previewImage) {
      this.data.previewImage = false
    } else {
      wx.startPullDownRefresh()
    }
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

  preview(e) {
    const url = []
    for (let i = 0; i < e.target.dataset.url.length; i++) {
      const src = e.target.dataset.url[i].url;
      url.push(src)
    }
    this.setData({
      previewImage: true
    })
    wx.previewImage({
      current: e.target.dataset.src, // 当前显示图片的 http 链接
      urls: url // 需要预览的图片 http 链接列表
    })
    // wx.navigateTo({
    //   url: '/pages/imagesView/index',
    //   success(res) {
    //     res.eventChannel.emit('acceptImagesUrlFromOpenerPage', {
    //       imagesUrl: url
    //     })
    //   }
    // })
  },

  goUserInfo() {
    wx.vibrateShort({
      type: 'light',
    })
    wx.navigateTo({
      url: `../userInfo/index`,
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
            url: '../edit/index'
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
        if (res) {
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
        if (res) {
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

  getMemos(rowStatus, type) {
    var that = this
    let offset = this.data.memos.length
    if (type == 'refresh') {
      offset = 0
    }
    app.api.getMemos(wx.getStorageSync('url'), this.data.limit, offset, rowStatus)
      .then(result => {
        console.log(result)
        if (result.length == 0) {
          if (offset == 0) {
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
          var memos = result
          for (let i = 0; i < memos.length; i++) {
            const ts = memos[i].displayTs
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
        console.log(res)
        if (res) {
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
    app.api.getMe(wx.getStorageSync('url'))
      .then(result => {
        let me = result
        wx.setStorageSync('me', me)
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
    app.api.getStats(wx.getStorageSync('url'), id)
      .then(result => {
        this.setData({
          stats: result
        })
        that.setHeatMap()
      })
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

  goWelcom() {
    wx.vibrateShort({
      type: 'light'
    })
    if (app.globalData.ifWechatLogin) {
      wx.showModal({
        confirmColor: '#07C160',
        title: this.data.language.home.goWelcomModal.title,
        content: this.data.language.home.goWelcomModal.content,
        confirmText: this.data.language.home.goWelcomModal.confirmText,
        cancelText: this.data.language.home.goWelcomModal.cancelText,
        success(res) {
          if (res.confirm) {
            wx.reLaunch({
              url: '../welcom/index',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      wx.reLaunch({
        url: '../welcom/index',
      })
    }

  },

  goSetting() {
    wx.vibrateShort({
      type: 'light',
    })
    wx.navigateTo({
      url: '../setting/index',
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
    wx.vibrateShort({
      type: 'light',
    })
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
    that.getMemos('NORMAL', 'refresh')
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000);
  }
})