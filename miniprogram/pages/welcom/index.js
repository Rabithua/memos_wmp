// pages/welcom/index.js
import lottie from 'lottie-miniprogram'
var app = getApp()
import {
  newMemoContent
} from '../../js/howToUse'

Page({
  data: {
    dogDanceNum: 0,
    webInfo: {},
    dogTimer: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    this.setData({
      top_btn: app.globalData.top_btn,
      url: app.globalData.url,
      username: '',
      password: '',
      btnDisable: false
    })

    //请求csrf
    this.reqCookie()
  },

  reqCookie() {
    app.api.status(app.globalData.url).then((res) => {
      console.log(res)
      // wx.setStorageSync('cookie', res.cookies)
      this.setData({
        webInfo: res.data.data
      })
    })
  },

  dog() {
    let dogDanceNum = this.data.dogDanceNum + 1
    wx.vibrateShort({
      type: 'light',
    })
    this.setData({
      dogDanceNum: dogDanceNum
    })
    if (dogDanceNum === 12) {
      wx.showToast({
        icon: 'none',
        title: '🕺🐕💃',
      })
      let dogTimer= setInterval(() => {
        wx.vibrateShort({
          type: 'heavy'
        })
      }, 500);
      this.setData({
        dogTimer: dogTimer
      })
    }

  },

  hidenDogDance() {
    this.setData({
      dogDanceNum: 0
    })
    clearInterval(this.data.dogTimer)
  },

  changeLanguage() {
    wx.vibrateShort()
    if (this.data.language.language == 'zh') {
      wx.setStorageSync('language', 'english')
      this.setData({
        language: app.language.english
      })
    } else {
      wx.setStorageSync('language', 'chinese')
      this.setData({
        language: app.language.chinese
      })
    }

  },

  copy() {
    wx.setClipboardData({
      data: app.globalData.url_back,
    })
  },

  signUp() {
    var that = this
    let data = {
      "username": this.data.username,
      "password": this.data.password,
      "role": "USER"
    }
    if (this.check() && !this.data.btnDisable) {
      that.setData({
        btnDisable: true
      })
      console.log(app.globalData.cloud_rp)
      wx.showLoading({
        title: that.data.language.common.loading,
      })
      app.api.signUp(app.globalData.url, data)
        .then(res => {
          console.log(res)
          if (res.data) {
            //创建成功
            wx.vibrateShort()
            wx.showLoading({
              title: that.data.language.welcom.signUpSuc,
            })
            var openId = res.data.openId
            wx.setStorage({
              key: "openId",
              data: openId,
              // encrypt: true,
              success(res) {
                console.log(res)
                app.api.getMemos(that.data.url, openId)
                  .then((res) => {
                    console.log(res)
                    that.sendMemo(openId)
                  })
                  .catch((err) => {
                    console.log(err)
                  })
              },
              fail(err) {
                wx.showToast({
                  title: that.data.language.common.wrong,
                })
              }
            })
          } else if (res.message) {
            wx.vibrateLong()
            wx.showToast({
              icon: 'none',
              title: that.data.language.common.usernameNo,
            })
            that.setData({
              btnDisable: false
            })
          } else {
            wx.vibrateLong()
            wx.showToast({
              icon: 'none',
              title: that.data.language.common.wrong,
            })
            that.setData({
              btnDisable: false
            })
          }
        })
        .catch((err) => {
          console.log(err)
          that.setData({
            btnDisable: false
          })
        })
    }

  },

  check() {
    let that = this
    var reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (!this.data.username) {
      wx.vibrateLong()
      wx.showToast({
        icon: 'none',
        title: that.data.language.welcom.usernameErr,
      })
      this.setData({
        btnDisable: false
      })
      return false
    } else if (this.data.password.length < 6) {
      wx.vibrateLong()
      wx.showToast({
        icon: 'none',
        title: that.data.language.welcom.passwordCheckErr,
      })
      this.setData({
        btnDisable: false
      })
      return false
    } else {
      return true
    }
  },

  signIn() {
    var that = this
    if (this.check() && !this.data.btnDisable) {
      wx.showLoading({
        title: '通信中...',
        mask: true
      })
      that.setData({
        btnDisable: true
      })
      app.api.signIn(app.globalData.url, {
          "username": that.data.username,
          "password": that.data.password,
        })
        .then(res => {
          if (res.data) {
            console.log(res.data.openId)
            wx.vibrateShort()
            wx.showLoading({
              title: that.data.language.welcom.signInSuc,
            })
            wx.setStorage({
              key: "openId",
              data: res.data.openId,
              // encrypt: true,
              success(res) {
                wx.setStorage({
                  key: "url",
                  data: that.data.url,
                  success(res) {
                    wx.redirectTo({
                      url: '../home/index',
                    })
                  }
                })
              },
              fail(err) {
                wx.showToast({
                  title: that.data.language.common.wrong,
                })
                that.setData({
                  btnDisable: false
                })
                wx.hideLoading()
              }
            })
          } else {
            console.log(res)
            let regresult1 = res.error.match(/User not found with username/)
            let regresult2 = res.error.match(/Incorrect login credentials/)
            console.log('regresult:', regresult1, regresult2)
            // if (regresult1) {
            //   wx.vibrateLong()
            //   wx.hideLoading()
            //   wx.showModal({
            //     confirmText: that.data.language.welcom.signUpTip.confirmText,
            //     cancelText: that.data.language.welcom.signUpTip.cancelText,
            //     title: that.data.language.welcom.signUpTip.title,
            //     content: that.data.language.welcom.signUpTip.content,
            //     success(res) {
            //       if (res.confirm) {
            //         console.log('用户点击确定')
            //         that.setData({
            //           btnDisable: false
            //         })
            //         wx.showLoading({
            //           title: '通信中...',
            //         })
            //         that.signUp()
            //       } else if (res.cancel) {
            //         console.log('用户点击取消')
            //         that.setData({
            //           btnDisable: false
            //         })
            //       }
            //     }
            //   })
            // } else 
            if (regresult2) {
              wx.vibrateLong()
              wx.hideLoading()
              wx.showToast({
                icon: 'none',
                title: that.data.language.welcom.loginCreErr,
              })
              that.setData({
                btnDisable: false
              })
            } else {
              wx.vibrateLong()
              wx.hideLoading()
              wx.showToast({
                icon: 'none',
                title: that.data.language.common.wrong,
              })
              that.setData({
                btnDisable: false
              })
            }
          }
        })
        .catch((err) => console.log(err))

    }
  },

  sendMemo(openId) {
    var content = newMemoContent
    var url = this.data.url
    var that = this
    app.api.sendMemo(url, openId, content)
      .then(res => {
        console.log(res.data)
        if (res.data) {
          // wx.vibrateShort()
          wx.setStorageSync('language', 'english')
          wx.redirectTo({
            url: '../home/index',
          })
        } else {
          wx.vibrateLong()
          wx.setStorageSync('language', 'english')
          wx.showToast({
            icon: 'none',
            title: 'something wrong',
          })
          wx.redirectTo({
            url: '../home/index',
          })
        }
      })
      .catch((err) => console.log(err))
  },

  goWebview() {
    wx.vibrateShort()
    wx.navigateTo({
      url: '../explore/index'
    })
  },

  nothing() {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    wx.createSelectorQuery().select('#canvas').node(res => {
      const canvas = res.node
      const dpr = wx.getSystemInfoSync().pixelRatio
      canvas.width = 300 * dpr
      canvas.height = 300 * dpr
      const context = canvas.getContext('2d')
      context.scale(dpr, dpr)
      lottie.setup(canvas)
      lottie.loadAnimation({
        loop: true,
        autoplay: true,
        animationData: require('../../js/dog'),
        rendererSettings: {
          context,
        },
      }).play()
    }).exec()
  },

  onShow() {
    this.setData({
      language: app.language[wx.getStorageSync('language') ? wx.getStorageSync('language') : 'chinese']
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: this.data.language.welcom.shareMsg.title,
      path: '/pages/welcom/index'
    }
  }
})