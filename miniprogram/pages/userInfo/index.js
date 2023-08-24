var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    avatarUrl: '',
    nickName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.getMe()
  },

  getMe() {
    var that = this
    app.api.getMe(wx.getStorageSync('url'))
      .then(result => {
        console.log(result)
        that.setData({
          nickName: result.data.nickname,
          avatarUrl: result.data.avatarUrl,
          id: result.data.id,
          me: result.data
        })
      })
  },
  onChooseAvatar(e) {
    console.log(e)
    this.setData({
      avatarUrl: e.detail.avatarUrl
    })
  },

  changeUsername(e) {
    console.log(e)
  },

  saveUserInfo() {
    let that = this
    let avatarUrl = this.data.avatarUrl
    let avatarBase64 = ''
    if (this.data.nickName) {
      if (that.data.me.avatarUrl == that.data.avatarUrl) {
        let data = {
          "id": that.data.id,
          "avatarUrl": that.data.avatarUrl,
          "nickname": that.data.nickName
        }
        app.api.changeUserInfo(wx.getStorageSync('url'), data)
          .then(r => {
            console.log(r)
            if (r.data.id) {
              wx.reLaunch({
                url: '../home/index',
              })
            }
          })
          .catch(e => {
            console.log(e)
          })
      } else {
        wx.getFileSystemManager().readFile({ //读取本地文件内容
          filePath: avatarUrl, // 文件路径
          encoding: 'base64', // 返回格式
          success: (res) => {
            avatarBase64 = 'data:image/png;base64,' + res.data
            let data = {
              "id": that.data.id,
              "avatarUrl": avatarBase64,
              "nickname": that.data.nickName
            }
            console.log(data)
            app.api.changeUserInfo(wx.getStorageSync('url'), data)
              .then(r => {
                console.log(r)
                if (r.data.id) {
                  wx.reLaunch({
                    url: '../home/index',
                  })
                }
              })
              .catch(e => {
                console.log(e)
              })
          }
        });

      }
    } else {
      wx.vibrateShort({
        type: 'light',
      })
      wx.showToast({
        icon: 'none',
        title: '昵称是必要的',
      })
    }

  }
})