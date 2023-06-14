var app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {

  },
  onShow() {
    let language = app.language[wx.getStorageSync('language') ? wx.getStorageSync('language') : 'chinese']
    this.setData({
      language,
      settings: wx.getStorageSync('settings') ? wx.getStorageSync('settings') : language.setting.settings,
    })
    wx.setNavigationBarTitle({
      title: language.setting.pageTitle,
    })
  },

  methods(e) {
    let index = e.currentTarget.dataset.index;
    let value = e.detail.value
    wx.vibrateShort({
      type: 'light',
    })
    this.setData({
      [`settings[${index}].checked`]: value
    })
    wx.setStorageSync('settings', this.data.settings)
  },
});