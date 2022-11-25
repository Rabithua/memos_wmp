// pages/home/index.js
import {
    formatMemoContent,
    parseHtmlToRawText
} from '../../js/marked'
var app = getApp()

Page({
    data: {
        halfDialog: 'closeHalfDialog',
        showSidebar: false,
        fullScreen: 0,
        edit: false,
        editfocus: false,
        state: app.language.english.common.loading,
        editMemoId: 0,
        memos: [],
        showMemos: [],
        memo: '',
        onlineColor: '#eeeeee',
        showArchived: false,
        sendLoading: false,
        imgDraw: null,
        showShareImg: false,
        shareImgUrl: ''
    },

    onLoad(options) {
        // console.log(app.api)
        var that = this
        this.setData({
            top_btn: app.globalData.top_btn,
            language: app.language.english
        })
        wx.getStorage({
            key: "openId",
            // encrypt: true,
            success(res) {
                // console.log(res.data)
                app.globalData.openId = res.data
                that.setData({
                    url: app.globalData.url,
                    openId: res.data,
                    onlineColor: '#FCA417'
                })
                var openId = res.data
                wx.getStorage({
                    key: "memos",
                    success(res) {
                        that.setData({
                            memos: res.data,
                            showMemos: res.data.slice(0, 10)
                        })
                        that.getMemos(openId)
                        that.getMe(openId)
                        app.api.getTags(that.data.url, that.data.openId)
                            .then(res => {
                                that.setData({
                                    tags: res.data
                                })
                            })
                            .catch((err) => console.log(err))
                    },
                    fail(err) {
                        console.log(err)
                        that.getMemos(openId)
                        that.getMe(openId)
                        app.api.getTags(that.data.url, that.data.openId)
                            .then(res => {
                                that.setData({
                                    tags: res.data
                                })
                            })
                            .catch((err) => console.log(err))
                    }
                })
            },
            fail(err) {
                console.log(err)
                wx.redirectTo({
                    url: '../welcom/index',
                })
            }
        })
    },

    onReachBottom() {
        var memos = this.data.memos
        var showMemos = this.data.showMemos
        if (showMemos.length == memos.length) {
            wx.vibrateShort()
            wx.showToast({
                icon: 'none',
                title: this.data.language.home.reachBottom,
            })
        } else {
            this.setData({
                showMemos: memos.slice(0, showMemos.length + 5)
            })
        }

    },

    setSidebar(e) {
        // console.log(e.touches[0].clientX)
        this.setData({
            sidebarStart: e.touches[0].clientX
        })
    },

    showSidebar(e) {
        // console.log(e)
        let that = this
        if (e.touches[0].clientX - this.data.sidebarStart > 50) {
            wx.vibrateShort()
            this.setData({
                showSidebar: true
            })
        }
    },

    setHeatMap() {
        let memos = this.data.memos
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
        for (let k = 0; k < memos.length; k++) {
            let day = app.fomaDay(memos[k].createdTs * 1000)
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
        wx.vibrateShort()
        this.setData({
            showSidebar: false
        })
    },

    onPainterOK(e) {
        console.log('生成成功', e)
        this.setData({
            imgDraw: null,
            showShareImg: true,
            shareImgUrl: e.detail.path
        })
        // wx.previewImage({
        //   current: e.detail.path, // 当前显示图片的 http 链接
        //   urls: [e.detail.path] // 需要预览的图片 http 链接列表
        // })
    },

    onPainterErr(e) {
        console.log('生成失败', e)
    },

    inputTag() {
        wx.vibrateShort()
        this.setData({
            memo: this.data.memo + '#tag ',
            editfocus: true
        })
    },

    inputTodo() {
        wx.vibrateShort()
        wx.showToast({
            icon: 'none',
            title: ' - [x] done',
        })
        this.setData({
            memo: this.data.memo + '- [ ] ',
            editfocus: true
        })
    },

    inputCode() {
        wx.vibrateShort()
        console.log(this.data.memo + '\n```\n```')
        this.setData({
            memo: this.data.memo + '\n```\n```',
            editfocus: true
        })
    },

    fullScreen() {
        wx.vibrateShort()
        if (this.data.fullScreen == 0) {
            this.setData({
                fullScreen: 500,
                editfocus: true
            })
        } else {
            this.setData({
                fullScreen: 0,
                editfocus: true
            })
        }
    },

    changeMemoPinned(e) {
        wx.vibrateShort()
        console.log(e.detail.memoid)
        console.log(e.detail.pinned)
        var data = {
            pinned: !e.detail.pinned
        }
        var that = this
        app.api.changeMemoPinned(this.data.url, this.data.openId, e.detail.memoid, data)
            .then(res => {
                console.log(res)
                if (res.data) {
                    wx.vibrateShort()
                    if (!e.detail.pinned) {
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
                        if (memos[i].id == e.detail.memoid) {
                            memos[i].pinned = !e.detail.pinned
                        }
                    }
                    var arrMemos = app.memosArrenge(memos)
                    console.log(arrMemos)
                    that.setData({
                        memos: arrMemos,
                        showMemos: arrMemos.slice(0, that.data.showMemos.length),
                    })
                    app.globalData.memos = arrMemos
                    wx.setStorage({
                        key: 'memos',
                        data: arrMemos
                    })
                }
            })
            .catch((err) => console.log(err))
    },

    changeMemoVisibility(e) {
        console.log(e.detail.memoid)
        let id = e.detail.memoid
        var that = this
        app.api.editMemo(this.data.url, this.data.openId, id, {
                visibility: (e.detail.visibility == 'PRIVATE' ? 'PUBLIC' : 'PRIVATE')
            })
            .then(res => {
                if (res.data) {
                    var memos = that.data.memos
                    for (let i = 0; i < memos.length; i++) {
                        if (memos[i].id == id) {
                            memos[i].visibility = (memos[i].visibility == 'PRIVATE' ? 'PUBLIC' : 'PRIVATE')
                        }
                    }
                    that.setData({
                        memos: memos,
                        showMemos: memos.slice(0, that.data.showMemos.length)
                    })
                    wx.vibrateShort()
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

    changeshowArchived() {
        wx.vibrateShort()
        this.setData({
            showArchived: !this.data.showArchived
        })
    },

    memoInput(e) {
        // console.log(e.detail.value)
        this.setData({
            memo: e.detail.value
        })
    },

    dialogEdit(e) {
        // console.log(e)
        this.setData({
            halfDialog: 'showHalfDialog',
            edit: true,
            editfocus: true,
            editMemoId: e.detail.memoid,
            memo: e.detail.content
        })
    },

    getMemos(openId) {
        var that = this
        app.api.getMemos(this.data.url, openId)
            .then(result => {
                // console.log(result)
                if (!result.data) {
                    wx.redirectTo({
                        url: '../welcom/index',
                    })
                } else {
                    var memos = result.data
                    for (let i = 0; i < memos.length; i++) {
                        const ts = memos[i].createdTs
                        var time = app.calTime(ts)
                        memos[i].time = time
                        //memos原版解析
                        let md = formatMemoContent(memos[i].content)
                        memos[i].formatContent = md
                        const fileList_preview = []
                        const imgList_preview = []
                        for (let l = 0; l < memos[i].resourceList.length; l++) {
                            const rescource = memos[i].resourceList[l];
                            const rescource_name = rescource.filename
                            const rescource_url = that.data.url + '/o/r/' + rescource.id + '/' + rescource_name
                            if (rescource.type.match(/image/)) {
                                imgList_preview.push({
                                    url: rescource_url,
                                    name: rescource_name
                                })
                            } else {
                                fileList_preview.push({
                                    url: rescource_url,
                                    name: rescource_name
                                })
                            }
                        }
                        memos[i].fileList_preview = fileList_preview
                        memos[i].imgList_preview = imgList_preview
                    }
                    var arrMemos = app.memosArrenge(memos)
                    that.setData({
                        memos: arrMemos,
                        state: that.data.language.home.state.online,
                        showMemos: arrMemos.slice(0, 10),
                        onlineColor: '#07C160'
                    })
                    that.setHeatMap()
                    app.globalData.memos = arrMemos
                    wx.setStorage({
                        key: "memos",
                        data: arrMemos
                    })
                    wx.stopPullDownRefresh()
                }
            })
            .catch((err) => console.log(err))
    },

    getMe(openId) {
        var that = this
        app.api.getMe(this.data.url, openId)
            .then(result => {
                let me = result.data
                me.day = parseInt((new Date().getTime() - me.createdTs * 1000) / 86400000)
                for (let i = 0; i < me.userSettingList.length; i++) {
                    if (me.userSettingList[i].key == 'locale') {
                        if (me.userSettingList[i].value == '\"zh\"') {
                            wx.setStorageSync('language', 'chinese')
                            that.setData({
                                language: app.language.chinese
                            })
                        } else {
                            wx.setStorageSync('language', 'english')
                            that.setData({
                                language: app.language.english
                            })
                        }
                    }
                }
                that.setData({
                    me: me
                })
            })
    },

    goWebview() {
        wx.vibrateShort()
        wx.navigateTo({
            url: '../webview/webview'
        })
    },

    dialog() {
        var that = this
        var content = this.data.memo
        if (content !== '') {
            this.setData({
                sendLoading: true
            })
            if (!this.data.edit) {
                this.sendMemo()
            } else {
                var url = this.data.url
                var openId = this.data.openId
                var id = this.data.editMemoId
                var data = {
                    content: content
                }
                that.editMemoContent(url, openId, id, data)
            }
        } else {
            wx.vibrateLong()
            wx.showToast({
                icon: 'none',
                title: that.data.language.home.editErr,
            })
        }
    },

    editMemoContent(url, openId, id, data) {
        var that = this
        app.api.editMemo(url, openId, id, data)
            .then(res => {
                console.log(res)
                if (res.data) {
                    var memos = that.data.memos
                    for (let i = 0; i < memos.length; i++) {
                        if (memos[i].id == that.data.editMemoId) {
                            memos[i].content = that.data.memo
                            memos[i].formatContent = formatMemoContent(that.data.memo)
                        }
                    }
                    that.setData({
                        memos: memos,
                        showMemos: memos.slice(0, that.data.showMemos.length),
                        halfDialog: 'closeHalfDialog',
                        sendLoading: false,
                        memo: '',
                        editMemoId: 0,
                        edit: false
                    })
                    wx.vibrateShort()
                    wx.showToast({
                        icon: 'none',
                        title: that.data.language.home.editChanged,
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

    editMemoRowStatus(url, openId, id, data) {
        var that = this
        app.api.editMemo(url, openId, id, data)
            .then(res => {
                console.log(res)
                if (res.data) {
                    var memos = that.data.memos
                    for (let i = 0; i < memos.length; i++) {
                        if (memos[i].id == id) {
                            memos[i].rowStatus = data.rowStatus
                        }
                    }
                    that.setData({
                        memos: memos,
                        showMemos: memos.slice(0, that.data.showMemos.length)
                    })
                    wx.vibrateShort()
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

    showHeatTip(e) {
        console.log(e)
        wx.vibrateShort()
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

    sendMemo() {
        var content = this.data.memo
        var url = this.data.url
        var openId = this.data.openId
        var memos = this.data.memos
        var that = this
        app.api.sendMemo(url, openId, content)
            .then(res => {
                console.log(res.data)
                if (res.data) {
                    wx.vibrateShort()
                    var newmemo = res.data
                    newmemo.time = app.calTime(newmemo.createdTs)
                    let md = formatMemoContent(newmemo.content)
                    newmemo.formatContent = md
                    memos.unshift(newmemo)
                    var arrMemos = app.memosArrenge(memos)
                    that.setData({
                        memos: arrMemos,
                        showMemos: arrMemos.slice(0, this.data.showMemos.length + 1),
                        sendLoading: false,
                        memo: '',
                        halfDialog: 'closeHalfDialog',
                        fullScreen: 0
                    })
                    app.globalData.memos = arrMemos
                    wx.setStorage({
                        key: 'memos',
                        data: arrMemos
                    })
                } else {
                    wx.vibrateLong()
                    wx.showToast({
                        icon: 'none',
                        title: 'something wrong',
                    })
                    that.setData({
                        sendLoading: false
                    })
                }
            })
            .catch((err) => console.log(err))
    },

    deleteMemoFaker(e) {
        console.log(e.detail.rowstatus)
        var data = {
            rowStatus: e.detail.rowstatus == "NORMAL" ? 'ARCHIVED' : "NORMAL"
        }
        var url = this.data.url
        var openId = this.data.openId
        var id = e.detail.memoid
        this.editMemoRowStatus(url, openId, id, data)
    },

    deleteMemo(e) {
        var that = this
        var memos = this.data.memos
        var id = e.detail.memoid
        console.log(e.detail.memoid)
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
                    app.api.deleteMemo(that.data.url, that.data.openId, id)
                        .then(res => {
                            if (res) {
                                for (let i = 0; i < memos.length; i++) {
                                    if (memos[i].id == id) {
                                        memos.splice(i, 1)
                                    }
                                    var arrMemos = app.memosArrenge(memos)
                                    that.setData({
                                        memos: arrMemos,
                                        showMemos: arrMemos.slice(0, that.data.showMemos.length)
                                    })
                                    app.globalData.memos = arrMemos
                                    wx.setStorage({
                                        key: "memos",
                                        data: arrMemos
                                    })
                                }
                                wx.showToast({
                                    icon: 'none',
                                    title: that.data.language.home.deleted,
                                })
                            } else {
                                wx.showToast({
                                    icon: 'none',
                                    title: 'something wrong',
                                })
                            }
                        })
                        .catch((err) => console.log(err))
                }
            }
        })
    },

    goWelcom() {
        wx.vibrateShort()
        wx.showModal({
            confirmColor: '#07C160',
            title: this.data.language.home.goWelcomModal.title,
            content: this.data.language.home.goWelcomModal.content,
            confirmText: this.data.language.home.goWelcomModal.confirmText,
            cancelText: this.data.language.home.goWelcomModal.cancelText,
            success(res) {
                if (res.confirm) {
                    wx.navigateTo({
                        url: '../welcom/index',
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },

    goSearch(e) {
        wx.vibrateShort()
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

    canvas_start(e) {
        console.log(e.detail.content)
        wx.showToast({
            icon: 'none',
            title: this.data.language.common.loading,
        })
        this.setData({
            imgDraw: {
                "width": "900px",
                "height": "1200px",
                "borderRadius": "30px",
                "background": "#f5f5f5",
                "views": [{
                        "type": "image",
                        "url": "https://img.rabithua.club/others/sharecard.png",
                        "css": {
                            "width": "900px",
                            "height": "1200px",
                            "top": "0px",
                            "left": "0px",
                            "borderColor": "#ffffff",
                            "mode": "scaleToFill"
                        }
                    },
                    {
                        "type": "text",
                        "text": e.detail.content,
                        "css": {
                            "fontSize": "40px",
                            "color": "#07C160",
                            "width": "620px",
                            "height": "400px",
                            "top": "274px",
                            "left": "132px",
                            "fontWeight": "normal",
                            "maxLines": "9",
                            "lineHeight": "50px",
                            "textAlign": "left",
                        }
                    }
                ]
            }
        })
    },

    hideShreImg() {
        this.setData({
            showShareImg: false,
            shareImgUrl: ''
        })
    },

    none() {},

    changeCloseMemo() {
        wx.vibrateShort()
        if (this.data.halfDialog == 'showHalfDialog' && this.data.edit) {
            this.setData({
                halfDialog: 'closeHalfDialog',
                memo: '',
                editMemoId: 0,
                edit: false,
                editfocus: false
            })
        } else if (this.data.halfDialog == 'closeHalfDialog') {
            this.setData({
                halfDialog: 'showHalfDialog',
                editfocus: true
            })
        } else {
            this.setData({
                halfDialog: 'closeHalfDialog'
            })
        }
    },

    onPullDownRefresh() {
        let that = this
        // wx.startPullDownRefresh()
        that.setData({
            state: this.data.language.common.refreshing,
            onlineColor: '#FCA417'
        })
        that.getMemos(that.data.openId)
        // setTimeout(() => {
        //   wx.stopPullDownRefresh()
        // }, 300);
    }
})