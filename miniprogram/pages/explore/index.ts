var app = getApp();
import { formatMemoContent } from "../../js/marked";

Page({
  data: {
    url: getApp().globalData.url,
    memos: [],
    showMemos: [],
    offset: 0,
    limit: 20,
    showCreator:true
  },

  onLoad() {
    this.setData({
      top_btn: app.globalData.top_btn,
    });
    this.getExploreMemos();
  },

  copy(e:any) {
    console.log(e)
    wx.vibrateShort()
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
  goMemo(e:any){
    console.log(e.target.dataset.memoid)
    wx.navigateTo({
      url: `/pages/memo/index?id=${e.target.dataset.memoid}`,
    })
  },

  getExploreMemos() {
    let that = this;
    wx.showLoading({
      title: "加载中...",
    });
    app.api
      .getExploreMemos(this.data.url, this.data.offset, this.data.limit)
      .then((result) => {
        console.log(result);
        if (!result.data) {
          wx.vibrateLong();
          wx.showToast({
            icon: "error",
            title: that.data.language.common.wrong,
          });
        } else {
          var memos = result.data;
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
          wx.vibrateShort();
        }
      })
      .catch((err) => console.log(err));
  },

  onShow() {
    this.setData({
      language:
        app.language[
          wx.getStorageSync("language")
            ? wx.getStorageSync("language")
            : "chinese"
        ],
    });
  },

  onReachBottom() {
    wx.vibrateShort()
    this.getExploreMemos();
  },

  
  onShareAppMessage() {
    return {
      title: this.data.language.explore.pageTitle,
      path: '/pages/explore/index'
    }
  }
});
