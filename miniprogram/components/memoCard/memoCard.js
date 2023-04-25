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
    deleteMemoFaker(e) {
      this.triggerEvent('deleteMemoFaker', e.target.dataset)
    },
    deleteMemo(e) {
      this.triggerEvent('deleteMemo', e.target.dataset)
    },
    dialogEdit(e) {
      this.triggerEvent('dialogEdit', e.target.dataset)
    },
    changeMemoPinned(e) {
      this.triggerEvent('changeMemoPinned', e.target.dataset)
    },
    changeMemoVisibility(e) {
      this.triggerEvent('changeMemoVisibility', e.target.dataset)
    },
    shareMemo(e) {
      this.triggerEvent('shareMemo', e.target.dataset)
    },
    copy(e) {
      console.log(e)
      wx.vibrateShort()
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
    goMemo(e){
      console.log(e.target.dataset.memoid)
      wx.navigateTo({
        url: `/pages/memo/index?id=${e.target.dataset.memoid}`,
      })
    }
  }
})
