var app = getApp();
import { formatMemoContent } from "../../js/marked";

Page({
  data: {
    url: wx.getStorageSync('url'),
    memos: [],
    showMemos: [],
    offset: 0,
    limit: 10,
    showCreator:true,
    id: null
  },

  onLoad(o) {
    console.log(o)
    this.setData({
      id: o.id,
      top_btn: app.globalData.top_btn,
    });
    this.getExploreMemos();
    this.getUserInfo()
  },

  getUserInfo(){
    app.api.getUserInfo(this.data.url, this.data.id)
    .then(res => {
      if (res) {
        console.log(res)
        this.setData({
          author: res
        })
      }
    })
    .catch((err) => console.log(err))
  },

  copy(e:any) {
    console.log(e)
    wx.vibrateShort({
        type: 'light'
      })
    wx.setClipboardData({
      data: e.target.dataset.url
    })
  },

  preview(e:any) {
    console.log(e)
    const url = []
    for (let i = 0; i < e.target.dataset.url.length; i++) {
      const src:never = e.target.dataset.url[i].url as never;
      url.push(src)
    }
    wx.previewImage({
      current: e.target.dataset.src, // 当前显示图片的 http 链接
      urls: url // 需要预览的图片 http 链接列表
    })
  },

  getExploreMemos() {
    let that = this;
    wx.showLoading({
      title: "加载中...",
    });
    app.api
      .getUserMemos(this.data.url, this.data.offset, this.data.limit, this.data.id)
      .then((result) => {
        console.log(result);
        if (!result) {
          wx.vibrateLong();
          wx.showToast({
            icon: "error",
            title: that.data.language.common.wrong,
          });
        } else {
          var memos = result;
          for (let i = 0; i < memos.length; i++) {
            const ts = memos[i].createdTs;
            var time = app.calTime(ts);
            memos[i].time = time;
            //memos原版解析
            let md = formatMemoContent(memos[i].content);
            memos[i].formatContent = md;
            memos[i] = app.memosRescourse(memos[i]);
          }
          console.log(memos);
          wx.hideLoading()
          that.setData({
            showMemos: that.data.showMemos.concat(memos),
            offset: that.data.showMemos.concat(memos).length + 1,
          });
          wx.vibrateShort({
        type: 'light'
      });
        }
      })
      .catch((err) => console.log(err));
  },

  goMemo(e) {
    // console.log(e.currentTarget.dataset.memoid)
    wx.navigateTo({
      url: `/pages/memo/index?id=${e.currentTarget.dataset.memoid}`,
    })
  },

  onShow() {
    let language = app.language[wx.getStorageSync('language') ? wx.getStorageSync('language') : 'chinese']
    this.setData({
      language,
      settings: wx.getStorageSync('settings') ? wx.getStorageSync('settings') : language.setting.settings,
    })
  },

  onReachBottom() {
    wx.vibrateShort({
        type: 'light'
      })
    this.getExploreMemos();
  },

  
  onShareAppMessage() {
    return {
      title: this.data.language.explore.pageTitle,
      path: '/pages/explore/index'
    }
  },

  onPullDownRefresh(){
    this.getExploreMemos();
    this.getUserInfo();
    wx.stopPullDownRefresh()
  }
});
