var app = getApp()

// pages/search/index.ts
Page({
  data: {
    url: '',
    openId: '',
    top_btn: null,
    tags: [],
    tagsSuggestionList: [],
    showMemos: [],
    memos: []
  },

  onLoad(o) {
    var that = this
    this.setData({
      top_btn: app.globalData.top_btn,
      url: app.globalData.url,
      openId: app.globalData.openId,
      language: app.language.english
    })
    // console.log(this)
    app.api.getTags(this.data.url, this.data.openId)
      .then(res => {
        that.setData({
          tags: res.data
        })
        that.getSuggestionTags()
      })
      .catch((err) => console.log(err))


    if (o.time) {
      console.log(o)
      let showMemos = []
      let memos = []
      if (app.globalData.memos === undefined) {
        wx.getStorage({
          key: 'memos',
          success(res) {
            that.setData({
              memos: res.data
            })
            app.globalData.memos = res.data
            memos = res.data
            for (let i = 0; i < memos.length; i++) {
              const day = app.fomaDay(memos[i].createdTs);
              if (day = o.time) {
                showMemos.push(memos[i])
              }
            }
          }
        })
      } else {
        memos = app.globalData.memos
        for (let i = 0; i < memos.length; i++) {
          let day = app.fomaDay(memos[i].createdTs * 1000)
          if (day == o.time) {
            showMemos.push(memos[i])
          }
        }
      }
      this.setData({
        showMemos: showMemos
      })
    }
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
  },

  getSuggestionTags() {
    let that = this
    app.api.getTagsSuggestionList(this.data.url, this.data.openId)
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
    wx.vibrateShort()
    wx.showLoading({
      title: '创建中...',
    })
    let that = this
    let tagName = e.currentTarget.dataset.keyword
    let tagsSuggestionListTemp = that.data.tagsSuggestionList
    let tagsTemp = that.data.tags
    console.log(tagsSuggestionListTemp, tagsTemp, tagName)

    app.api.upsertTag(this.data.url, this.data.openId, tagName)
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
    wx.showModal({
      title: this.data.language.search.tagDeleteModal.title,
      content: this.data.language.search.tagDeleteModal.content,
      confirmText: this.data.language.search.tagDeleteModal.confirmText,
      cancelText: this.data.language.search.tagDeleteModal.cancelText,
      complete: (res) => {
        if (res.confirm) {
          app.api.deleteTag(this.data.url, this.data.openId, TagName)
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
    console.log(e.currentTarget.dataset.keyword)
    var key = {
      detail: {
        value: '#' + e.currentTarget.dataset.keyword
      }
    }

    this.search(key)
  },

  search(e) {
    var keyword = e.detail.value
    console.log(keyword)
    var that = this
    var memos = app.globalData.memos
    console.log(memos)
    var showMemos = []
    if (keyword == '') {
      wx.vibrateShort()
      wx.showToast({
        icon: 'none',
        title: this.data.language.search.cantEmpty,
      })
    } else {
      if (app.globalData.memos === undefined) {
        wx.getStorage({
          key: 'memos',
          success(res) {
            that.setData({
              memos: res.data
            })
            app.globalData.memos = res.data
            memos = res.data
            console.log(memos)
            for (let i = 0; i < memos.length; i++) {
              const content = memos[i].content;
              var regs = content.search(keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
              if (regs != -1) {
                showMemos.push(memos[i])
              }
            }
          }
        })
      } else {
        for (let i = 0; i < memos.length; i++) {
          const content = memos[i].content;
          var regs = content.search(keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
          if (regs != -1) {
            showMemos.push(memos[i])
          }
        }
      }
      that.setData({
        showMemos: showMemos
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

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