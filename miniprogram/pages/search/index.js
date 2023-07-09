var app = getApp()
import {
  formatMemoContent,
  parseHtmlToRawText
} from '../../js/marked'

// pages/search/index.ts
Page({
  data: {
    url: '',
    top_btn: null,
    tags: [],
    tagsSuggestionList: [],
    showMemos: [],
    memos: [],
    limit: 200,
    x:0
  },

  onLoad(o) {
    var that = this
    this.setData({
      top_btn: app.globalData.top_btn,
      url: wx.getStorageSync('url'),
    })
    // console.log(this)
    app.api.getTags(this.data.url)
      .then(res => {
        that.setData({
          tags: res
        })
        that.getSuggestionTags()
      })
      .catch((err) => console.log(err))

    if (o.time) {
      that.getMemos(o.time)
    }
  },

  getMemos(time, func) {
    let that = this
    wx.showLoading({
      title: '拉取数据...',
    })
    return new Promise((resolve, reject) => {
      app.api.getMemos(wx.getStorageSync('url'), '', '')
        .then(result => {
          // console.log(result)
          if (!result.data) {
            wx.vibrateLong()
            wx.showToast({
              icon: 'error',
              title: that.data.language.common.wrong,
            })
          } else {
            var memos = result.data
            for (let i = 0; i < memos.length; i++) {
              let ts = memos[i].createdTs
              let time = app.calTime(ts)
              memos[i].time = time
              //memos原版解析
              let md = formatMemoContent(memos[i].content)
              memos[i].formatContent = md
              memos[i] = app.memosRescourse(memos[i])
            }
            app.globalData.memos = memos
            wx.hideLoading()
            that.setData({
              memos
            })
            if (time) {
              let timeMemos = []
              memos.map((memo, index) => {
                if (app.fomaDay(memo.createdTs * 1000) == time) {
                  timeMemos.push(memos[index])
                }
              })
              that.setData({
                showMemos: timeMemos
              })
            }
            resolve()
          }
        })
        .catch((err) => {
          console.log(err)
          wx.vibrateLong()
          wx.showToast({
            icon: 'error',
            title: that.data.language.common.wrong,
          })
          reject()
        })
    })
  },

  getSuggestionTags() {
    let that = this
    app.api.getTagsSuggestionList(this.data.url)
      .then(res => {
        that.setData({
          tagsSuggestionList: res.data
        })
        that.tagsDeleteDouble(that.data.tags, that.data.tagsSuggestionList)
      })
      .catch((err) => console.log(err))
  },

  tagsDeleteDouble(tags_1, tags_2) {
    tags_1.forEach((item) => {
      tags_2.forEach((item_2, index_2) => {
        if (item == item_2) {
          tags_2.splice(index_2, 1)
        }
      })
    })
    this.setData({
      tagsSuggestionList: tags_2
    })
  },

  upsertTag(e) {
    wx.vibrateShort({
        type: 'light'
      })
    wx.showLoading({
      title: '创建中...',
    })
    let that = this
    let tagName = e.currentTarget.dataset.keyword
    let tagsSuggestionListTemp = that.data.tagsSuggestionList
    let tagsTemp = that.data.tags
    console.log(tagsSuggestionListTemp, tagsTemp, tagName)

    app.api.upsertTag(this.data.url, tagName)
      .then(res => {
        console.log(res)
        tagsSuggestionListTemp.map((item, index) => {
          if (item == tagName) {
            tagsSuggestionListTemp.splice(index, 1)
            tagsTemp.push(tagName)
          }
        })
        that.setData({
          tags: tagsTemp,
          tagsSuggestionList: tagsSuggestionListTemp
        })
        wx.hideLoading()
      })
      .catch((err) => console.log(err))
  },

  deleteTag(e) {
    let TagName = e.currentTarget.dataset.keyword
    let that = this
    wx.vibrateShort({
        type: 'light'
      })
    wx.showModal({
      title: this.data.language.search.tagDeleteModal.title,
      content: this.data.language.search.tagDeleteModal.content,
      confirmText: this.data.language.search.tagDeleteModal.confirmText,
      cancelText: this.data.language.search.tagDeleteModal.cancelText,
      complete: (res) => {
        if (res.confirm) {
          app.api.deleteTag(this.data.url, TagName)
            .then(res => {
              let tagsS = that.data.tagsSuggestionList
              let tags = that.data.tags
              tagsS.push(TagName)
              tags.forEach((item, index) => {
                if (item == TagName) {
                  tags.splice(index, 1)
                }
              })
              that.setData({
                tagsSuggestionList: tagsS,
                tags: tags
              })
            })
            .catch((err) => console.log(err))
        }
      }
    })

  },

  searchTag(e) {
    // console.log(e.currentTarget.dataset.keyword)
    wx.vibrateShort({
        type: 'light'
      })
    var key = {
      detail: {
        value: '#' + e.currentTarget.dataset.keyword
      }
    }
    if (this.data.memos.length > 0) {
      this.search(key)
    } else {
      this.getMemos(null)
        .then(() => {
          this.search(key)
        })
    }

  },


  changeMemoPinned(e) {
    wx.vibrateShort({
        type: 'light'
      })
    let memoid = e.currentTarget.dataset.memoid
    let pinned = e.currentTarget.dataset.pinned
    var data = {
      pinned: !pinned
    }
    var that = this
    app.api.changeMemoPinned(this.data.url, memoid, data)
      .then(res => {
        // console.log(res)
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
          let showMemos = that.data.showMemos
          let memos = that.data.memos
          memos.map((memo, index) => {
            if (memo.id == memoid) {
              memo.pinned = !pinned
            }
          })
          showMemos.map((memo, index) => {
            if (memo.id == memoid) {
              memo.pinned = !pinned
            }
          })
          that.setData({
            showMemos,
            memos
          })
          app.globalData.memos = memos
          wx.setStorage({
            key: "memos",
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
    let that = this
    let memos = app.deepCopy(this.data.memos)
    let showMemos = app.deepCopy(this.data.showMemos)
    app.api.editMemo(this.data.url, id, {
        visibility: (visibility == 'PRIVATE' ? 'PUBLIC' : 'PRIVATE')
      })
      .then(res => {
        if (res.data) {
          for (let i = 0; i < memos.length; i++) {
            if (memos[i].id == id) {
              memos[i].visibility = (memos[i].visibility == 'PRIVATE' ? 'PUBLIC' : 'PRIVATE')
            }
          }

          for (let i = 0; i < showMemos.length; i++) {
            if (showMemos[i].id == id) {
              showMemos[i].visibility = (showMemos[i].visibility == 'PRIVATE' ? 'PUBLIC' : 'PRIVATE')
            }
          }
          that.setData({
            memos,
            showMemos
          })
          wx.vibrateShort({
        type: 'light'
      })
          wx.showToast({
            icon: 'none',
            title: that.data.language.home.visibilityChange,
          })
        }
      })
      .catch((err) => console.log(err))
  },

  deleteMemoFaker(e) {
    let memoid = e.currentTarget.dataset.memoid
    let rowstatus = e.currentTarget.dataset.rowstatus
    var data = {
      rowStatus: rowstatus == "NORMAL" ? 'ARCHIVED' : "NORMAL"
    }
    var url = this.data.url
    this.editMemoRowStatus(url, memoid, data)
  },

  editMemoRowStatus(url, id, data) {
    var that = this
    app.api.editMemo(url, id, data)
      .then(res => {
        // console.log(res)
        if (res.data) {
          console.log(res.data)
          let showMemos = that.data.showMemos
          let memos = that.data.memos
          memos.map((memo, index) => {
            if (memo.id == id) {
              memo.rowStatus = data.rowStatus
            }
          })
          showMemos.map((memo, index) => {
            if (memo.id == id) {
              memo.rowStatus = data.rowStatus
            }
          })

          that.setData({
            showMemos,
            memos
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

  deleteMemo(e) {
    var that = this
    let id = e.currentTarget.dataset.memoid
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
                let showMemos = that.data.showMemos
                let memos = that.data.memos
                memos.map((memo, index) => {
                  if (memo.id == id) {
                    memos.splice(index, 1)
                  }
                })
                showMemos.map((memo, index) => {
                  if (memo.id == id) {
                    showMemos.splice(index, 1)
                  }
                })

                that.setData({
                  showMemos,
                  memos
                })
                app.globalData.memos = memos
                wx.setStorage({
                  key: "memos",
                  data: memos
                })
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

  onPageScroll(e) {
    this.setData({
      x: e.scrollTop
    })
  },

  dialogEdit(e) {
    // console.log(e)
    let that = this
    let memoId = e.currentTarget.dataset.memoid
    let content = e.currentTarget.dataset.content
    let resourceIdList = this.data.memos.find(obj => obj.id === memoId).resourceList.map(item => item.id)
    const query = wx.createSelectorQuery()
    this.setData({
      editId: memoId,
      query
    })
    wx.vibrateShort({
        type: 'light'
      })
    wx.navigateTo({
      url: '../edit/index?edit=true',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function (type, newMemo) {
          // console.log(newMemo)
          switch (type) {
            case 'refresh':
              let showMemos = app.deepCopy(that.data.showMemos)
              let memos = app.deepCopy(that.data.memos)
              memos.map((memo, index) => {
                if (memo.id == newMemo.id) {
                  memo.content = newMemo.content
                  memo.formatContent = formatMemoContent(newMemo.content)
                  memo.resourceList = newMemo.resourceList
                  memo.time = app.calTime(memo.createdTs)
                }
                memo = app.memosRescourse(memo)
              })
              showMemos.map((memo, index) => {
                if (memo.id == newMemo.id) {
                  memo.content = newMemo.content
                  memo.formatContent = formatMemoContent(newMemo.content)
                  memo.resourceList = newMemo.resourceList
                  memo.time = app.calTime(memo.createdTs)
                }
                memo = app.memosRescourse(memo)
              })
              that.setData({
                showMemos: showMemos,
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
          editMemoId: memoId,
          memo: content,
          resourceIdList
        })
      }
    })
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

  search(e) {
    var keyword = e.detail.value
    console.log(keyword)
    var that = this
    var memos = this.data.memos
    var showMemos = []
    if (keyword == '') {
      wx.vibrateShort({
        type: 'light'
      })
      wx.showToast({
        icon: 'none',
        title: this.data.language.search.cantEmpty,
      })
    } else {
      if (this.data.memos.length > 0) {
        for (let i = 0; i < memos.length; i++) {
          const content = memos[i].content;
          var regs = content.search(keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
          if (regs != -1) {
            showMemos.push(memos[i])
          }
        }
        that.setData({
          showMemos: showMemos
        })
      } else {
        this.getMemos(null)
          .then(() => {
            for (let i = 0; i < memos.length; i++) {
              const content = memos[i].content;
              var regs = content.search(keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
              if (regs != -1) {
                showMemos.push(memos[i])
              }
            }
            that.setData({
              showMemos: showMemos
            })
          })
      }

    }
  },

  onShow() {
    let language = app.language[wx.getStorageSync('language') ? wx.getStorageSync('language') : 'chinese']
    this.setData({
      language,
      settings: wx.getStorageSync('settings') ? wx.getStorageSync('settings') : language.setting.settings,
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})