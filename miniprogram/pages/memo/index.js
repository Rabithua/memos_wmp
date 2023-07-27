import {
  formatMemoContent,
  parseHtmlToRawText
} from '../../js/marked'
var app = getApp()

Page({
  data: {
    memo: null,
    id: null,
    mpCodeMode: false,
    mpCodeUrl: '',
    ifShowShareMenu: false,
    url: wx.getStorageSync('url') ? wx.getStorageSync('url') : app.globalData.url,
    me: wx.getStorageSync('me')
  },

  onLoad(o) {
    console.log(o)
    let id = o.id
    if (id) {
      this.setData({
        id,
        mpCodeUrl: app.globalData.backendUrl + '/getmpcode?path=' + encodeURIComponent(`pages/memo/index?id=${id}`),
        language: app.language[wx.getStorageSync('language') ? wx.getStorageSync('language') : 'chinese']
      })
      if (wx.getStorageSync('openId')) {
        this.getMemo(this.data.url, id)
      } else {
        app.getUnionId().then((r) => {
          wx.setStorageSync('openId', r.openapi)
          this.getMemo(this.data.url, id)
        }).catch((err) => {
          console.log(err)
          this.getMemo(this.data.url, id)
        })
      }
    }
  },

  showShareMenu(e){
    wx.vibrateShort({
      type: 'light',
    })
    this.setData({
      ifShowShareMenu: !this.data.ifShowShareMenu
    })
  },

  changeMpcodeMode(){
    wx.vibrateShort({
      type: 'light',
    })
    this.setData({
      mpCodeMode: !this.data.mpCodeMode,
      ifShowShareMenu: false
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

  editMemoRowStatus(url, id, data) {
    var that = this
    app.api.editMemo(url, id, data)
      .then(res => {
        if (res.data) {
          console.log(res.data)
          that.setData({
            ['memo.rowStatus']: res.data.rowStatus
          })
          wx.vibrateShort({
            type: 'light'
          })
        }
      })
      .catch((err) => console.log(err))
  },

  deleteMemo(e) {
    var that = this
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
                wx.showToast({
                  icon: 'none',
                  title: that.data.language.home.deleted,
                })
                wx.navigateBack()
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

  dialogEdit(e) {
    let memoid = e.currentTarget.dataset.memoid
    let content = e.currentTarget.dataset.content
    let resourceIdList = this.data.memo.resourceList.map(item => item.id)
    wx.vibrateShort({
      type: 'light'
    })
    wx.navigateTo({
      url: '../edit/index?edit=true',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
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

  tagTap(e){
    console.log(e.target.dataset.tag)
    wx.vibrateShort({
      type: 'light',
    })
  },

  getMemo(url, id) {
    // wx.showLoading({
    //   title: this.data.language.memo.getting,
    // })
    app.api.getMemo(url, id)
      .then(res => {
        console.log(res)
        if (res.data) {
          let memo = res.data
          memo.formatContent = formatMemoContent(memo.content)
          memo.time = app.calTime(memo.createdTs)
          memo = app.memosRescourse(memo)
          try {
            memo.aiTags = JSON.parse(memo.aiTags)
          } catch (error) {
            memo.aiTags = []
          }
          // wx.setNavigationBarTitle({
          //   title: memo.creatorName,
          // })
          wx.hideLoading()
          wx.vibrateShort({
            type: 'light'
          })
          this.setData({
            memo
          })
          this.getUserInfo()
        } else {
          wx.hideLoading()
        }
      })
      .catch(err => {
        console.log(err)
        wx.hideLoading()
      })
  },

  share() {
    wx.vibrateShort({
      type: 'light',
    })
    wx.setClipboardData({
      data: `${this.data.url}/m/${this.data.id}`
    })
this.setData({
  ifShowShareMenu: false
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

  changeMemoVisibility() {
    let visibility = this.data.memo.visibility
    let memoid = this.data.memo.id
    var that = this
    wx.vibrateShort({
      type: 'light'
    })
    app.api.editMemo(this.data.url, memoid, {
        visibility: (visibility == 'PRIVATE' ? 'PUBLIC' : 'PRIVATE')
      })
      .then(res => {
        if (res.data) {
          that.setData({
            ['memo.visibility']: visibility == 'PRIVATE' ? 'PUBLIC' : 'PRIVATE'
          })
        }
      })
      .catch((err) => console.log(err))
  },

  vibShort() {
    wx.vibrateShort({
      type: 'light'
    })
  },

  goUser(){
    wx.vibrateShort({
      type: 'light',
    })
    wx.navigateTo({
      url: `../user/index?id=${this.data.author.id}`,
    })
  },

  getUserInfo(){
    app.api.getUserInfo(this.data.url, this.data.memo.creatorId)
    .then(res => {
      if (res.data) {
        console.log(res.data)
        this.setData({
          author: res.data
        })
      }
    })
    .catch((err) => console.log(err))
  },

  onReady() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  

  onShow() {
    this.setData({
      language: app.language[wx.getStorageSync('language') ? wx.getStorageSync('language') : 'chinese']
    })
    let id = this.data.id
    if (id) {
      this.getMemo(this.data.url, id)
    }
  },

  onShareAppMessage() {
    let imageUrl = this.data.memo.imgList_preview.length > 0 ? this.data.memo.imgList_preview[0].url : ''
    return {
      title: `${this.data.memo.creatorName}的笔记`,
      imageUrl,
      path: `/pages/memo/index?id=${this.data.id}`,
    }
  }
})