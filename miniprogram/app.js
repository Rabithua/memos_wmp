// app.js
App({
  // 引入`towxml3.0`解析方法
  // towxml: require('/towxml/index'),
  api: require('/js/api'),

  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        traceUser: true,
      });
    }

    this.globalData = {
      url: 'https://memos.wowow.club',
      top_btn: null,
    }

    this.globalData.top_btn = wx.getMenuButtonBoundingClientRect()

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
      var D = date.getDate() + ' '
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