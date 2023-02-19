export const getMemos = (url, openId) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url + '/api/memo',
      data: {
        'openId': openId
      },
      header: {
        cookie: wx.getStorageSync("cookie")
      },
      success(res) {
        // console.log(res.data)
        // console.log('直接api')
        if (res.header["Set-Cookie"]) {
          wx.setStorageSync('cookie', res.header["Set-Cookie"])
        }
        resolve(res.data)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

export const getMe = (url, openId) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url + '/api/user/me',
      data: {
        'openId': openId
      },
      header: {
        cookie: wx.getStorageSync("cookie")
      },
      success(res) {
        if (res.header["Set-Cookie"]) {
          wx.setStorageSync('cookie', res.header["Set-Cookie"])
        }
        resolve(res.data)
      },
      fail(err) {
        wx.vibrateLong()
        wx.showToast({
          icon: 'none',
          title: '获取失败',
        })
        reject(err)
      }
    })
  })
}

export const sendMemo = (url, openId, content) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url + '/api/memo?openId=' + openId,
      method: "POST",
      data: {
        content: content
      },
      header: {
        cookie: wx.getStorageSync("cookie")
      },
      success(res) {
        // console.log(res)
        if (res.header["Set-Cookie"]) {
          wx.setStorageSync('cookie', res.header["Set-Cookie"])
        }
        resolve(res.data)
      },
      fail(err) {
        console.log(err)
        wx.vibrateLong()
        wx.showToast({
          icon: 'none',
          title: '发送失败',
        })
        reject(err)
      }
    })
  })
}

export const signUp = (url, data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url + '/api/auth/signup',
      method: "POST",
      data: data,
      header: {
        cookie: wx.getStorageSync("cookie")
      },
      success(res) {
        if (res.header["Set-Cookie"]) {
          wx.setStorageSync('cookie', res.header["Set-Cookie"])
        }
        resolve(res.data)
      },
      fail(err) {
        wx.vibrateLong()
        wx.showToast({
          icon: 'none',
          title: 'something wrong',
        })
        reject(err)
      }
    })
  })
}

export const deleteMemo = (url, openId, memoId) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url + '/api/memo/' + memoId + '?openId=' + openId,
      method: "DELETE",
      header: {
        cookie: wx.getStorageSync("cookie")
      },
      success(res) {
        if (res.header["Set-Cookie"]) {
          wx.setStorageSync('cookie', res.header["Set-Cookie"])
        }
        resolve(res.data)
      },
      fail(err) {
        wx.vibrateLong()
        wx.showToast({
          icon: 'none',
          title: '删除失败',
        })
        reject(err)
      }
    })
  })
}

export const editMemo = (url, openId, memoId, data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url + '/api/memo/' + memoId + '?openId=' + openId,
      method: "PATCH",
      data: data,
      header: {
        cookie: wx.getStorageSync("cookie")
      },
      success(res) {
        if (res.header["Set-Cookie"]) {
          wx.setStorageSync('cookie', res.header["Set-Cookie"])
        }
        resolve(res.data)
      },
      fail(err) {
        wx.vibrateLong()
        wx.showToast({
          icon: 'none',
          title: '更新失败',
        })
        reject(err)
      }
    })
  })
}

export const changeUserSetting = (url, openId, data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url + '/api/user/setting?openId=' + openId,
      method: "POST",
      data: data,
      header: {
        cookie: wx.getStorageSync("cookie")
      },
      success(res) {
        if (res.header["Set-Cookie"]) {
          wx.setStorageSync('cookie', res.header["Set-Cookie"])
        }
        resolve(res.data)
      },
      fail(err) {
        wx.vibrateLong()
        wx.showToast({
          icon: 'none',
          title: '更新失败',
        })
        reject(err)
      }
    })
  })
}

export const changeMemoPinned = (url, openId, memoId, data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url + '/api/memo/' + memoId + '/organizer' + '?openId=' + openId,
      method: "POST",
      data: data,
      header: {
        cookie: wx.getStorageSync("cookie")
      },
      success(res) {
        if (res.header["Set-Cookie"]) {
          wx.setStorageSync('cookie', res.header["Set-Cookie"])
        }
        resolve(res.data)
      },
      fail(err) {
        wx.vibrateLong()
        wx.showToast({
          icon: 'none',
          title: '置顶失败',
        })
        reject(err)
      }
    })
  })
}

export const signIn = (url, data) => {
  return new Promise((resolve, reject) => {
    console.log(data)
    wx.request({
      url: url + '/api/auth/signin',
      method: "POST",
      data: data,
      header: {
        cookie: wx.getStorageSync("cookie")
      },
      success(res) {
        if (res.header["Set-Cookie"]) {
          wx.setStorageSync('cookie', res.header["Set-Cookie"])
        }
        resolve(res.data)
      },
      fail(err) {
        wx.vibrateLong()
        wx.showToast({
          icon: 'none',
          title: '登录失败',
        })
        reject(err)
      }
    })
  })
}

export const getTags = (url, openId) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url + '/api/tag?openId=' + openId,
      header: {
        cookie: wx.getStorageSync("cookie")
      },
      success(res) {
        if (res.header["Set-Cookie"]) {
          wx.setStorageSync('cookie', res.header["Set-Cookie"])
        }
        resolve(res.data)
      },
      fail(err) {
        wx.vibrateLong()
        wx.showToast({
          icon: 'none',
          title: '获取失败',
        })
        reject(err)
      }
    })
  })
}

export const getTagsSuggestionList = (url, openId) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url + '/api/tag/suggestion?openId=' + openId,
      header: {
        cookie: wx.getStorageSync("cookie")
      },
      success(res) {
        if (res.header["Set-Cookie"]) {
          wx.setStorageSync('cookie', res.header["Set-Cookie"])
        }
        resolve(res.data)
      },
      fail(err) {
        wx.vibrateLong()
        wx.showToast({
          icon: 'none',
          title: '获取失败',
        })
        reject(err)
      }
    })
  })
}

export const upsertTag = (url, openId, TagName) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url + '/api/tag?openId=' + openId,
      method: "POST",
      header: {
        cookie: wx.getStorageSync("cookie")
      },
      data: {
        name: TagName
      },
      success(res) {
        if (res.header["Set-Cookie"]) {
          wx.setStorageSync('cookie', res.header["Set-Cookie"])
        }
        resolve(res.data)
      },
      fail(err) {
        wx.vibrateLong()
        wx.showToast({
          icon: 'none',
          title: '获取失败',
        })
        reject(err)
      }
    })
  })
}

export const deleteTag = (url, openId, TagName) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url + '/api/tag/delete?openId=' + openId,
      method: "POST",
      header: {
        cookie: wx.getStorageSync("cookie")
      },
      data: {
        name: TagName
      },
      success(res) {
        if (res.header["Set-Cookie"]) {
          wx.setStorageSync('cookie', res.header["Set-Cookie"])
        }
        resolve(res.data)
      },
      fail(err) {
        wx.vibrateLong()
        wx.showToast({
          icon: 'none',
          title: '失败',
        })
        reject(err)
      }
    })
  })
}

export const status = (url) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url + '/api/status',
      success(res) {
        if (res.header["Set-Cookie"]) {
          wx.setStorageSync('cookie', res.header["Set-Cookie"])
        }
        resolve(res)
      },
      fail(err) {
        wx.vibrateLong()
        wx.showToast({
          icon: 'none',
          title: '获取失败',
        })
        reject(err)
      }
    })
  })
}