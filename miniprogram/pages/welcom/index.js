// pages/welcom/index.js
var app = getApp()

Page({
  data: {},

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
      btnDisable: false,
      language: app.language.english
    })

    //请求csrf
    this.reqCookie()

    wx.getStorage({
      key: "language",
      success(res) {
        if (res.data == 'chinese') {
          that.setData({
            language: app.language.chinese
          })
        }
      },
      fail(err) {
        console.log(err)
      }
    })

  },

  reqCookie() {
    wx.showLoading({
      title: '',
    })
    app.api.status(app.globalData.url).then((res) => {
      console.log(res.header["Set-Cookie"])
      wx.setStorageSync('cookie', res.header["Set-Cookie"])
      wx.hideLoading()
    })
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
          if (!res.data.error) {
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
        .catch((err) => console.log(err))
    }

  },

  check() {
    let that = this
    var reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (!reg.test(this.data.username)) {
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
              }
            })
          } else {
            console.log(res)
            let regresult1 = res.error.match(/User not found with username/)
            let regresult2 = res.error.match(/Incorrect password/)
            console.log('regresult:', regresult1, regresult2)
            if (regresult1) {
              wx.vibrateLong()
              wx.showModal({
                confirmText: that.data.language.welcom.signUpTip.confirmText,
                cancelText: that.data.language.welcom.signUpTip.cancelText,
                title: that.data.language.welcom.signUpTip.title,
                content: that.data.language.welcom.signUpTip.content,
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    that.signUp()
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                    that.setData({
                      btnDisable: false
                    })
                  }
                }
              })
            } else if (regresult2) {
              wx.vibrateLong()
              wx.showToast({
                icon: 'none',
                title: that.data.language.welcom.passwordErr,
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
    var content = ` #Welcom 
欢迎注册麦默🎉现在你需要了解一下麦默以及它的使用方法~
麦默是基于**笔记类**开源web项目[memos](https://github.com/usememos/memos)定制的微信小程序客户端，并且[麦默](https://github.com/Rabithua/memos_wmp)也是开源的。因此你也可以通过网页使用memo，网址是**https://memos.wowow.club**，以下是使用说明：

 - 【三种模式】\`正常/归档/删除\`，笔记卡片右上角第二个是删除按钮，单击归档[No/Yes]📦，长按删除🗑。

 - 【置顶卡片📌】卡片右上角第一个是置顶按钮，单击置顶[No/Yes]，另外还有一个隐藏功能，长按可以分享当前卡片，不过目前仅支持纯文字，语法无法支持。

 - 【编辑✒】右上角第三个按钮是编辑，单击可以对笔记卡片进行编辑。

 - 【创建✨】主页向左滑动可以创建新的内容。

 - 【快捷按钮💡】编辑页面三个快捷按钮分别是 标签、TODO、代码块。

 - 【话题🏷】话题后方有一个空格，这个是话题语法结束的标志，不可或缺。

 - 【TODO📋】 中括号内空格渲染出来是待办，空格替换为英文字母小写 \`x\` 渲染出来是已完成。\`另外 TODO 内容编写完毕后最后一条后面也要添加回车\`，因为回车是TODO语法结束的标志。

 - 【代码块🎃】第三个是代码块按钮，语法前后都需要回车来包裹。

#语法示例 

- [ ] 待办事项
- [x] 已完成

这句话包含了一个\`行内代码\`。

 - 这是一个list
 - 还有一件事
 - 还有一件事
 - 还有一件事

**我被加粗了**，*我是斜体*。

\`\`\`
.todo-text {
  display:initial;
  vertical-align: middle;
}
\`\`\`
`
    var url = this.data.url
    var that = this
    app.api.sendMemo(url, openId, content)
      .then(res => {
        console.log(res.data)
        if (res.data) {
          // wx.vibrateShort()
          wx.redirectTo({
            url: '../home/index',
          })
        } else {
          wx.vibrateLong()
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
      url: '../webview/webview'
    })
  },

  nothing() {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

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