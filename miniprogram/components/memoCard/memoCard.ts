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
    }
  }
})
