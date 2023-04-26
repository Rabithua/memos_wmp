var app = getApp();

Page({
  data: {
    url: getApp().globalData.url,
    limit: 20,
    resources: []
  },

  onLoad() {
    this.setData({
      top_btn: app.globalData.top_btn,
    });
    if (wx.getStorageSync('openId')) {
      this.getResource()
    } else {
      wx.redirectTo({
        url: '../welcom/index',
      })
    }
  },

  getResource() {
    app.api.getResource(this.data.url, this.data.limit, this.data.resources.length).then(res => {
      let newResources = res.data
      if (newResources.length == 0) {
        wx.showToast({
          icon: 'none',
          title: '就这么多了',
        })
      }
      wx.vibrateShort()
      this.setData({
        resources: this.data.resources.concat(newResources)
      })
    })
  },

  onReady() {},

  onShow() {
    this.setData({
      language: app.language[
        wx.getStorageSync("language") ?
        wx.getStorageSync("language") :
        "chinese"
      ],
    });
  },

  setTouchStart(e) {
    this.setData({
      touchStart: e.touches[0]
    })
  },

  showMethod(e) {
    let that = this
    let resources = this.data.resources
    let index = e.currentTarget.dataset.index
    let touchStart = this.data.touchStart
    if (touchStart.clientX) {
      if (e.touches[0].clientX - touchStart.clientX > 50 && Math.abs(e.touches[0].clientY - touchStart.clientY) < 20) {
        // wx.vibrateShort()
        resources[index].showMethod = false
        // hide
        that.setData({
          resources
        })
      } else if (e.touches[0].clientX - touchStart.clientX < -50 && Math.abs(e.touches[0].clientY - touchStart.clientY) < 20) {
        // wx.vibrateShort()
        resources[index].showMethod = true
        // hide
        that.setData({
          resources
        })

      }
    }
  },

  copyLink(e) {
    let res = this.data.resources
    let idx = e.target.dataset.index
    let url = ''
    if (res[idx].externalLink) {
      url = res[idx].externalLink
    } else {
      url = `${this.data.url}/o/r/${res[idx].id}/${res[idx].publicId}`
    }
    wx.vibrateShort()
    wx.setClipboardData({
      data: url,
    })
  },

  deleteResource(e) {
    let id = e.target.dataset.id
    let linkedmemoamount = e.target.dataset.linkedmemoamount
    console.log(id, linkedmemoamount)
    if (linkedmemoamount > 0) {
      wx.showModal({
        title: '警告',
        content: `当前资源已被${linkedmemoamount}个Memo引用，删除会导致Memo文件丢失`,
        confirmText: '删除',
        confirmColor: '#FF5A5A',
        complete: (res) => {
          if (res.cancel) {
            return
          }
          if (res.confirm) {
            app.api.deleteResource(this.data.url, id)
              .then((res) => {
                console.log(res)
                if (res == true) {
                  wx.vibrateShort()
                  wx.showToast({
                    title: '已删除',
                  })
                  this.setData({
                    resources: this.data.resources.filter(function (obj) {
                      return obj.id !== id;
                    })
                  })
                }
              })
              .catch((err) => {
                console.log(err)
              })
          }
        }
      })
    } else {
      app.api.deleteResource(this.data.url, id)
        .then((res) => {
          console.log(res)
          if (res == true) {
            wx.vibrateShort()
            wx.showToast({
              title: '已删除',
            })
            this.setData({
              resources: this.data.resources.filter(function (obj) {
                return obj.id !== id;
              })
            })
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  },

  previewImg(e) {
    let res = this.data.resources
    let idx = e.target.dataset.index
    let url = ''
    if (res[idx].externalLink) {
      url = res[idx].externalLink
    } else {
      url = `${this.data.url}/o/r/${res[idx].id}/${res[idx].publicId}`
    }
    wx.previewImage({
      urls: [url],
    })
  },

  onReachBottom() {
    this.getResource()
  }

});