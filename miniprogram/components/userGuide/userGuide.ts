// components/memoCard/memoCard.ts
Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  /**
   * 组件的属性列表
   */
  properties: {
    pinned: Boolean,
    rowStatus: String,
    memos: Array
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    close(e: { target: { dataset: any } }) {
      this.triggerEvent('close', e.target.dataset)
    },
    copy(e: { target: { dataset: { url: any } } }) {
      console.log(e)
      wx.vibrateShort({
        type: "light"
      })
      wx.setClipboardData({
        data: e.target.dataset.url
      })
    },
    preview(e: { target: { dataset: { url: any, src: any } } }) {
      console.log(e)
      const url: string[] = []
      for (let i = 0; i < e.target.dataset.url.length; i++) {
        const src: string = e.target.dataset.url[i].url;
        url.push(src)
      }
      wx.previewImage({
        current: e.target.dataset.src, // 当前显示图片的 http 链接
        urls: url // 需要预览的图片 http 链接列表
      })
    }
  }
})
