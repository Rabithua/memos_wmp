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
    }
  }
})
