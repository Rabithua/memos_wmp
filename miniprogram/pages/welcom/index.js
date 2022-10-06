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

  copy() {
    wx.setClipboardData({
      data: app.globalData.url_back,
    })
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
      console.log('直接登录')
      app.api.signIn(that.data.url, {
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
                    that.sendMemo(openId)
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
              wx.showToast({
                title: '账号不存在',
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

  nothing() {},

  onShareAppMessage() {
    return {
      title: '麦默——闪念记录',
      path: '/pages/welcom/index'
    }
  }
})