var app = getApp();

Page({
  data: {
    url: getApp().globalData.url,
    limit: 20,
    resources: [],
    selectFileId: []
  },

  onLoad(o) {
    let that = this
    this.setData({
      top_btn: app.globalData.top_btn,
      selectMode: o.selectMode ? true : false
    });
    this.setData({
      language: app.language[
        wx.getStorageSync("language") ?
        wx.getStorageSync("language") :
        "chinese"
      ],
    });
    if (wx.getStorageSync('openId')) {
      this.getResource()
    } else {
      wx.redirectTo({
        url: '../welcom/index',
      })
    }
    const eventChannel = this.getOpenerEventChannel()
    if (eventChannel.listener) {
      eventChannel.once('passResourceIdList', function (data) {
        console.log(data)
        that.setData({
          selectFileId: data.resourceIdList,
          memoId: data.memoId
        })
      })
    }
  },

  selectSet() {
    let resources = this.data.resources
    let selectFileId = this.data.selectFileId
    console.log(resources, selectFileId)
    const newArray = resources.map(item => {
      if (selectFileId.includes(item.id)) {
        return {
          ...item,
          select: true
        };
      }
      return item;
    });
    this.setData({
      resources: newArray
    })
  },

  deleteMemoFile(resourceId) {
    app.api.deleteMemoResource(this.data.url, this.data.memoId, resourceId)
      .then((res) => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  },

  pickImg() {
    let that = this
    let resources = this.data.resources
    wx.vibrateShort()
    wx.chooseMedia({
      count: 1,
      mediaType: ['image', 'video'],
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      success(res) {
        console.log(res.tempFiles)
        wx.showLoading({
          title: '上传中...',
        })
        wx.uploadFile({
          url: `${that.data.url}/api/resource/blob?openId=${wx.getStorageSync('openId')}`,
          filePath: res.tempFiles[0].tempFilePath,
          name: 'file',
          formData: {},
          success(res) {
            console.log(res)
            let newFile = JSON.parse(res.data).data
            newFile.time = app.fomaDay(newFile.createdTs * 1000)
            newFile.sizeFomate = app.formatFileSize(newFile.size)
            resources.unshift(newFile)
            wx.hideLoading()
            that.setData({
              resources
            })
            //do something
          }
        })
      }
    })
  },

  getResource() {
    wx.showLoading({
      title: this.data.language.common.loading,
    })
    app.api.getResource(this.data.url, this.data.limit, this.data.resources.length).then(res => {
      let newResources = res.data
      newResources.forEach(function (item) {
        item.time = app.fomaDay(item.createdTs * 1000);
        item.sizeFomate = app.formatFileSize(item.size)
      });
      if (newResources.length == 0) {
        wx.showToast({
          icon: 'none',
          title: this.data.language.common.thatIsAll,
        })
      }
      wx.hideLoading()
      wx.vibrateShort()
      this.setData({
        resources: this.data.resources.concat(newResources)
      })
      this.selectSet()
    })
  },

  selectFile(e) {
    let idx = e.currentTarget.dataset.index
    let resources = app.deepCopy(this.data.resources)
    resources[idx].select = !resources[idx].select
    if (this.data.selectMode) {
      this.calcSelectNum(resources)
      if (!resources[idx].select) {
        this.deleteMemoFile(resources[idx].id)
      }
      wx.vibrateShort()
      this.setData({
        resources
      })
    }
  },

  calcSelectNum(resources) {
    const selectedIds = resources
      .filter(item => item.select)
      .map(item => item.id);
    this.setData({
      selectFileId: selectedIds
    })
  },

  backEdit() {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('addFiles', this.data.selectFileId)
    wx.vibrateShort()
    wx.navigateBack()
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
        title: this.data.language.resource.deleteModal.title,
        content: `${this.data.language.resource.deleteModal.content_1}${linkedmemoamount}${this.data.language.resource.deleteModal.content_2}`,
        confirmText: this.data.language.resource.deleteModal.confirm,
        confirmColor: '#FF5A5A',
        cancelText: this.data.language.resource.deleteModal.cancel,
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
                    title: this.data.language.resource.deleted,
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
              title: this.data.language.resource.deleted,
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
    wx.vibrateShort()
    wx.previewImage({
      urls: [url],
    })
  },

  onReachBottom() {
    this.getResource()
  }

});