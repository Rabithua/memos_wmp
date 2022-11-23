// app.js
App({
  apicloud: require('/js/api'),
  apidirect: require('/js/apidirect'),

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
      source:
        'https://img.rabithua.club/%E9%BA%A6%E9%BB%98/SmileySans-Oblique.ttf',
      scopes: ['webview', 'native'],
    });

    // 声明新的 cloud 实例
    const cloud_rp = new wx.cloud.Cloud({
      // 资源方 AppID
      resourceAppid: 'wx3138964dbb7e0bda',
      // 资源方环境 ID
      resourceEnv: 'rpshare-8gugy8ft27e4fe36',
    })

    this.globalData = {
      url: 'https://memos.wowow.club',
      url_back: 'https://memos.wowow.club',
      top_btn: null,
      cloud_rp: cloud_rp
    }

    var that = this
    wx.getStorage({
      key: 'url',
      success(res) {
        if (res.data == that.globalData.url_back) {
          getApp().api = require('/js/apidirect')
        } else {
          getApp().api = require('/js/api')
        }
      },
      fail(res) {
        getApp().api = require('/js/api')
      }
    })

    this.globalData.top_btn = wx.getMenuButtonBoundingClientRect()

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
      return (d + '天前')
    } else if (result / (1000 * 60) > 60) {
      var h = parseInt(result / (1000 * 60 * 60))
      return (h + '小时前')
    } else if (result / (1000 * 60) > 1) {
      var m = parseInt(result / (1000 * 60))
      return (m + '分钟前')
    } else {
      return ('刚刚发布')
    }
  }

});