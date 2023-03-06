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
    memos: Array,
    showCreator: Boolean
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
    deleteMemoFaker(e: { target: { dataset: any } }) {
      this.triggerEvent('deleteMemoFaker', e.target.dataset)
    },
    deleteMemo(e: { target: { dataset: any } }) {
      this.triggerEvent('deleteMemo', e.target.dataset)
    },
    dialogEdit(e: { target: { dataset: any } }) {
      this.triggerEvent('dialogEdit', e.target.dataset)
    },
    changeMemoPinned(e: { target: { dataset: any } }) {
      this.triggerEvent('changeMemoPinned', e.target.dataset)
    },
    changeMemoVisibility(e: { target: { dataset: any } }) {
      this.triggerEvent('changeMemoVisibility', e.target.dataset)
    },
    shareMemo(e: { target: { dataset: any } }) {
      this.triggerEvent('shareMemo', e.target.dataset)
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
