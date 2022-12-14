var app = getApp()

// pages/search/index.ts
Page({
    data: {
        url: '',
        openId: '',
        top_btn: null,
        tags: [],
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

    searchTag(e) {
        console.log(e.currentTarget.dataset.keyword)
        var key = {
            detail: {
                value: '#' + e.currentTarget.dataset.keyword + ' '
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
     * ??????????????????--??????????????????
     */
    onShow() {

    },

    /**
     * ??????????????????--??????????????????
     */
    onHide() {

    },

    /**
     * ??????????????????--??????????????????
     */
    onUnload() {

    },

    /**
     * ??????????????????????????????--????????????????????????
     */
    onPullDownRefresh() {

    },

    /**
     * ???????????????????????????????????????
     */
    onReachBottom() {

    },

    /**
     * ???????????????????????????
     */
    onShareAppMessage() {

    }
})