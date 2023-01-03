// app.js
App({
  api: require('/js/api'),
  language: require('/js/language'),
  onLaunch: function (options) {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        traceUser: true,
      });
    }

    //小程序更新提醒
    if (options.scene == 1154) {

    } else {
      if (wx.canIUse('getUpdateManager')) {
        const updateManager = wx.getUpdateManager()
        updateManager.onCheckForUpdate(function (res) {
          if (res.hasUpdate) {
            updateManager.onUpdateReady(function () {
              updateManager.applyUpdate()
              wx.clearStorageSync()
            })
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
        })
      }
    }

    //加载字体
    wx.loadFontFace({
      global: true,
      family: 'Smiley Sans Oblique',
      source: 'https://img.rabithua.club/%E9%BA%A6%E9%BB%98/SmileySans-Oblique.ttf',
      scopes: ['webview', 'native'],
    });

    this.globalData = {
      url: 'https://memos.wowow.club',
      top_btn: null,
    }

    this.globalData.top_btn = wx.getMenuButtonBoundingClientRect()
    
    let that = this
    //请求csrf
    function reqCookie() {
      wx.showLoading({
        title: '',
      })
      that.api.status(that.globalData.url).then((res) => {
        console.log(res.header["Set-Cookie"])
        wx.setStorageSync('cookie', res.header["Set-Cookie"])
        wx.hideLoading()
      })
    }

    //检查csrf
    if (!wx.getStorageSync('cookie')) {
      reqCookie()
    } else {
      let expires = wx.getStorageSync('cookie').match(/Expires=(.+?)($)/g)[0].substring(8)
      let now = new Date().getTime()
      if (now > new Date(expires).getTime()) {
        reqCookie()
      }
    }
  },

  loadFont() {
    wx.loadFontFace({
      family: 'Noto Serif SC',
      source: 'url("https://img.rabithua.club/others/NotoSerifSC-SemiBold.otf")',
      success: console.log
    })
  },

  memosArrenge(memos) {
    var pinnedNormalMemo = []
    var nopinnerNormalMemo = []
    var pinnedArchivedMemo = []
    var nopinnedArchivedMemo = []
    for (let i = 0; i < memos.length; i++) {
      if (memos[i].rowStatus == "NORMAL" && memos[i].pinned) {
        pinnedNormalMemo.push(memos[i])
      } else if (memos[i].rowStatus == "NORMAL" && !memos[i].pinned) {
        nopinnerNormalMemo.push(memos[i])
      } else if (memos[i].rowStatus == "ARCHIVED" && memos[i].pinned) {
        pinnedArchivedMemo.push(memos[i])
      } else {
        nopinnedArchivedMemo.push(memos[i])
      }
    }
    return pinnedNormalMemo.concat(nopinnerNormalMemo.concat(pinnedArchivedMemo.concat(nopinnedArchivedMemo)))
  },

  calTime(timestamp) {
    var now = new Date().getTime()
    // console.log(now)
    var result = now - timestamp * 1000
    let language = this.language.english
    if (wx.getStorageSync('language') == 'chinese') {
      language = this.language.chinese
    }
    if (result / (1000 * 60) > 1440 * 7) {
      var date = new Date(timestamp * 1000)
      var Y = date.getFullYear() + '/'
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/'
      var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
      var h = date.getHours() + ':'
      var m = (date.getMinutes() > 10 ? date.getMinutes() : '0' + date.getMinutes()) + ':'
      var s = (date.getSeconds() > 10 ? date.getSeconds() : '0' + date.getSeconds())
      return (Y + M + D + h + m + s)
    } else if (result / (1000 * 60) > 1440) {
      var d = parseInt(result / (1000 * 60 * 1440))
      return (d + language.common.memoCard.d)
    } else if (result / (1000 * 60) > 60) {
      var h = parseInt(result / (1000 * 60 * 60))
      return (h + language.common.memoCard.h)
    } else if (result / (1000 * 60) > 1) {
      var m = parseInt(result / (1000 * 60))
      return (m + language.common.memoCard.m)
    } else {
      return (language.common.memoCard.now)
    }
  },

  fomaDay(timestamp) {
    var date = new Date(timestamp)
    var Y = date.getFullYear() + '/'
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/'
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())
    return (Y + M + D)
  }

});