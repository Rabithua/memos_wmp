var app = getApp();
import { formatMemoContent } from "../../js/marked";

Page({
  data: {
    url: getApp().globalData.url,
    memos: [],
    showMemos: [],
    offset: 0,
    limit: 20,
  },

  onLoad() {
    this.setData({
      top_btn: app.globalData.top_btn,
    });
    this.getExploreMemos();
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
    console.log("chudi");
    this.getExploreMemos();
  },

  onShareAppMessage(options) {},
});
