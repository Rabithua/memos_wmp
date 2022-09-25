export const getMemos = (url, openId) => {
  return new Promise((resolve, reject) => {
<<<<<<< Updated upstream
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
=======
    getApp().globalData.cloud_rp.init().then(() => {
      getApp().globalData.cloud_rp.callFunction({
        name: 'apiPub',
        data: {
          url: url,
          openId: openId,
          method: 'getMemo'
        },
        success(res) {
          console.log(res)
          if (res.result) {
            resolve(JSON.parse(res.result))
          } else {
            reject(res)
          }
        },
        fail(err) {
          console.log(err)
          reject(err)
        }
      })
>>>>>>> Stashed changes
    })
  })
}

export const sendMemo = (url, openId, content) => {
  return new Promise((resolve, reject) => {
<<<<<<< Updated upstream
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
=======
    getApp().globalData.cloud_rp.init().then(() => {
      getApp().globalData.cloud_rp.callFunction({
        name: 'apiPub',
        data: {
          url: url,
          openId: openId,
          method: 'sendMemo',
          data: {
            body: {
              content: content
            }
          }
        },
        success(res) {
          console.log(res)
          if (res.result) {
            resolve(res.result)
          } else {
            reject(res)
          }
        },
        fail(err) {
          console.log(err)
          reject(err)
        }
      })
>>>>>>> Stashed changes
    })
  })
}

export const deleteMemo = (url, openId, memoId) => {
  return new Promise((resolve, reject) => {
<<<<<<< Updated upstream
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
=======
    getApp().globalData.cloud_rp.init().then(() => {
      getApp().globalData.cloud_rp.callFunction({
        name: 'apiPub',
        data: {
          url: url,
          openId: openId,
          method: 'deleteMemo',
          data: {
            memoId: memoId
          }
        },
        success(res) {
          console.log(res.result)
          if (res.result) {
            resolve(res.result)
          } else {
            reject(res)
          }
        },
        fail(err) {
          console.log(err)
          reject(err)
        }
      })
>>>>>>> Stashed changes
    })
  })
}

export const editMemo = (url, openId, memoId, data) => {
  return new Promise((resolve, reject) => {
<<<<<<< Updated upstream
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
=======
    getApp().globalData.cloud_rp.init().then(() => {
      getApp().globalData.cloud_rp.callFunction({
        name: 'apiPub',
        data: {
          url: url,
          openId: openId,
          method: 'editMemo',
          data: {
            body: data,
            memoId: memoId
          }
        },
        success(res) {
          console.log(res.result)
          if (res.result) {
            resolve(res.result)
          } else {
            reject(res)
          }
        },
        fail(err) {
          console.log(err)
          reject(err)
        }
      })
>>>>>>> Stashed changes
    })
  })
}

export const changeMemoPinned = (url, openId, memoId, data) => {
  return new Promise((resolve, reject) => {
<<<<<<< Updated upstream
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
=======
    getApp().globalData.cloud_rp.init().then(() => {
      getApp().globalData.cloud_rp.callFunction({
        name: 'apiPub',
        data: {
          url: url,
          openId: openId,
          method: 'changeMemoPinned',
          data: {
            body: data,
            memoId: memoId
          }
        },
        success(res) {
          console.log(res.result)
          if (res.result) {
            resolve(res.result)
          } else {
            reject(res)
          }
        },
        fail(err) {
          console.log(err)
          reject(err)
        }
      })
>>>>>>> Stashed changes
    })
  })
}

export const signIn = (url, data) => {
  return new Promise((resolve, reject) => {
<<<<<<< Updated upstream
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
=======
    getApp().globalData.cloud_rp.init().then(() => {
      getApp().globalData.cloud_rp.callFunction({
        name: 'apiPub',
        data: {
          url: url,
          method: 'signIn',
          data: {
            body: data
          }
        },
        success(res) {
          console.log(res.result)
          if (res.result) {
            resolve(res.result)
          } else {
            reject(res)
          }
        },
        fail(err) {
          console.log(err)
          reject(err)
        }
      })
>>>>>>> Stashed changes
    })
  })
}

export const getTags = (url, openId) => {
  return new Promise((resolve, reject) => {
<<<<<<< Updated upstream
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
=======
    getApp().globalData.cloud_rp.init().then(() => {
      getApp().globalData.cloud_rp.callFunction({
        name: 'apiPub',
        data: {
          url: url,
          openId: openId,
          method: 'getTags'
        },
        success(res) {
          console.log(res)
          if (res.result) {
            resolve(JSON.parse(res.result))
          } else {
            reject(res)
          }
        },
        fail(err) {
          console.log(err)
          reject(err)
        }
      })
>>>>>>> Stashed changes
    })
  })
}