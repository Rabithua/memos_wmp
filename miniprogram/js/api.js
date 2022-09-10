export const getMemos = (url, openId) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url + '/api/memo',
      data: {
        'openId': openId
      },
      success(res) {
        // console.log(res.data)
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
      url: url + '?openId=' + openId,
      method: "POST",
      data: {
        content: content
      },
      success(res) {
        resolve(res.data)
      },
      fail(err) {
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

export const deleteMemo = (url, openId, memoId) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url + '/api/memo/' + memoId + '?openId=' + openId,
      method: "DELETE",
      success(res) {
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
      success(res) {
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
      success(res) {
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
      success(res) {
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
      success(res) {
        console.log(res.data)
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