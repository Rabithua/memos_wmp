var app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {

  },
  
  onShow() {
    let language = app.language[wx.getStorageSync('language') ? wx.getStorageSync('language') : 'chinese']
    let settings = wx.getStorageSync('settings') ? wx.getStorageSync('settings') : language.setting.settings
    settings.map((setting, index) => {
      setting.title = language.setting.settings[index].title
    })
    this.setData({
      language,
      settings
    })
    wx.setNavigationBarTitle({
      title: language.setting.pageTitle,
    })
  },


  clearStorage(){
    wx.clearStorageSync()
    wx.redirectTo({
      url: '../welcom/index',
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
    if (index == 2) {
      wx.setStorageSync('showTips', value)
    }
  },
});