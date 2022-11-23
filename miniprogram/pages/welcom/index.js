// pages/welcom/index.js
var app = getApp()

Page({

  data: {
    mode: 'pri',
    tips: '输入账号密码，账号不存在会自动创建。请妥善保管好自己的邮箱和密码！'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      top_btn: app.globalData.top_btn,
      url: app.globalData.url_back,
      email: '',
      password: '',
      btnDisable: false
    })
  },

  changeIcon() {
    wx.vibrateShort()
    if (this.data.mode == 'pub') {
      this.setData({
        url: 'https://memos.wowow.club',
        tips: '输入账号密码，账号不存在会自动创建。请妥善保管好自己的邮箱和密码！',
        mode: 'pri'
      })
    } else {
      this.setData({
        url: '',
        tips: '多站点登录模式，如不懂此项请切换回去，此模式不支持创建用户，只能登录站点已有用户，且访问速度较慢！',
        mode: 'pub'
      })
    }

  },

  copy() {
    wx.setClipboardData({
      data: app.globalData.url_back,
    })
  },

  creatUser() {
    var that = this
    console.log(app.globalData.cloud_rp)
    wx.showLoading({
      title: '加载中…',
    })
    app.globalData.cloud_rp.init()
      .then(() => {
        app.globalData.cloud_rp.callFunction({
          name: 'creatuser',
          data: {
            method: 'POST',
            needHost: true,
            body: {
              "email": this.data.email,
              "password": this.data.password,
              "role": "USER"
            },
            url: app.globalData.url_back + '/api/user',
          },
          success: function (res) {
            //500 邮箱已占用，401 用户权限不足，undefined 创建成功
            console.log(res.result.statusCode)
            var code = res.result.statusCode
            if (code == undefined) {
              //创建成功
              wx.vibrateShort()
              wx.showLoading({
                title: '已注册…',
              })
              var openId = res.result.data.openId
              wx.setStorage({
                key: "openId",
                data: openId,
                // encrypt: true,
                success(res) {
                  console.log(res)
                  wx.setStorage({
                    key: "url",
                    data: that.data.url,
                    success(res) {
                      that.sendMemo(openId)
                    }
                  })
                },
                fail(err) {
                  wx.showToast({
                    title: 'something wrong',
                  })
                }
              })
            } else {
              wx.vibrateLong()
              wx.showToast({
                icon: 'none',
                title: 'something wrong',
              })
              that.setData({
                btnDisable: false
              })
            }
          },
          fail: function (error) {
            console.log(error)
            wx.vibrateLong()
            wx.showToast({
              icon: 'none',
              title: 'something wrong',
            })
            that.setData({
              btnDisable: false
            })
          }
        })
      })
      .catch((err) => console.log(err))

  },

  check() {
    var reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (!reg.test(this.data.email)) {
      wx.vibrateLong()
      wx.showToast({
        icon: 'none',
        title: '邮箱格式错误',
      })
      this.setData({
        btnDisable: false
      })
      return false
    } else if (this.data.password.length < 6) {
      wx.vibrateLong()
      wx.showToast({
        icon: 'none',
        title: '密码长度需大于六位',
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
    that.setData({
      btnDisable: true
    })
    if (this.check()) {
      if (this.data.url == app.globalData.url_back) {
        console.log('直接登录')
        app.apidirect.signIn(that.data.url, {
            "email": that.data.email,
            "password": that.data.password,
          })
          .then(res => {
            if (res.data) {
              console.log(res.data.openId)
              let openId = res.data.openId
              wx.vibrateShort()
              wx.showLoading({
                title: '登录成功',
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
                      app.api = require('../../js/apidirect')
                      wx.redirectTo({
                        url: '../home/index',
                      })
                    }
                  })
                },
                fail(err) {
                  wx.showToast({
                    title: 'something wrong',
                  })
                  that.setData({
                    btnDisable: false
                  })
                }
              })
            } else {
              console.log(res)
              let regresult1 = res.error.match(/User not found with email/)
              let regresult2 = res.error.match(/Incorrect password/)
              console.log('regresult:', regresult1, regresult2)
              if (regresult1) {
                wx.vibrateLong()
                wx.showModal({
                  title: '提示',
                  content: '账号不存在，直接注册？',
                  success(res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                      that.creatUser()
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
                  title: '密码错误',
                })
                that.setData({
                  btnDisable: false
                })
              }
            }
          })
          .catch((err) => console.log(err))
      } else {
        wx.showLoading({
          title: '登陆中…',
        })
        app.apicloud.signIn(that.data.url, {
            email: that.data.email,
            password: that.data.password,
          })
          .then(res => {
            console.log(res)
            if (typeof res.data === 'undefined') {
              if (typeof res.error == 'undefined') {
                wx.vibrateLong()
                wx.showToast({
                  icon: 'none',
                  title: '网址有误',
                })
                that.setData({
                  btnDisable: false
                })
              } else if (typeof res.error.message !== 'undefined' && res.error.message == "Incorrect password") {
                console.log(res)
                wx.vibrateLong()
                wx.showToast({
                  icon: 'none',
                  title: '密码错误',
                })
                that.setData({
                  btnDisable: false
                })
              } else {
                console.log(res)
                wx.vibrateLong()
                wx.showToast({
                  icon: 'none',
                  title: '用户不存在或网址有误',
                })
                that.setData({
                  btnDisable: false
                })
              }
            } else {
              console.log(res.data.openId)
              let openId = res.data.openId
              wx.vibrateShort()
              wx.setStorage({
                key: "openId",
                data: res.data.openId,
                // encrypt: true,
                success(res) {
                  console.log(res)
                  wx.setStorage({
                    key: "url",
                    data: that.data.url,
                    success(res) {
                      app.api = require('../../js/api')
                      that.sendMemo(openId)
                    }
                  })
                },
                fail(err) {
                  wx.showToast({
                    title: 'something wrong',
                  })
                }
              })
            }
          })
          .catch((err) => console.log(err))
      }
    }
  },

  sendMemo(openId) {
    var content = `#Welcom 
欢迎注册麦默🎉现在你需要了解一下麦默的使用方法~

- 【三种模式】\`正常/归档/删除\`，卡片右上角第二个是删除按钮，单击归档[No/Yes]📦，长按删除🗑。

- 【置顶卡片📌】卡片右上角第一个是置顶按钮，单击置顶[No/Yes]，另外还有一个隐藏功能，长按可以分享当前卡片，不过目前仅支持纯文字，语法无法支持。

- 【编辑✒】右上角第三个按钮是编辑，单击可以进行编辑。

- 【创建✨】点击上方小条的 \`+\` 可以创建新的内容。

- 【快捷按钮💡】编辑器三个快捷按钮分别是 话题、TODO、代码块。

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
    app.apicloud.sendMemo(url, openId, content)
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
      title: '麦默——闪念记录',
      path: '/pages/welcom/index'
    }
  }
})