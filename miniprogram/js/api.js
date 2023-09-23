export const changeUserInfo = (url, data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${url}/api/v1/user/${data.id}`,
      method: "PATCH",
      header: {
        'cookie': wx.getStorageSync('cookie')
      },
      data,
      success(res) {
        resolve(res.data)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

export const getMemos = (url, limit, offset, rowStatus) => {
  return new Promise((resolve, reject) => {
    let data = {
      limit,
      offset
    }
    if (rowStatus) {
      data = {
        rowStatus,
        ...data
      }
    }
    wx.request({
      url: `${url}/api/v1/memo`,
      header: {
        'cookie': wx.getStorageSync('cookie')
      },
      data,
      success(res) {
        resolve(res.data)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

export const getResource = (url, limit, offset) => {
  return new Promise((resolve, reject) => {
    let data = {
      limit,
      offset,
    }
    wx.request({
      url: `${url}/api/v1/resource`,
      header: {
        'cookie': wx.getStorageSync('cookie')
      },
      data,
      success(res) {
        resolve(res.data)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

export const deleteResource = (url, id) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${url}/api/v1/resource/${id}`,
      header: {
        'cookie': wx.getStorageSync('cookie')
      },
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

export const deleteMemoResource = (url, memoId, resourceId) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${url}/api/v1/memo/${memoId}/resource/${resourceId}`,
      header: {
        'cookie': wx.getStorageSync('cookie')
      },
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

export const createResource = (url, file) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${url}/api/v1/resource/blob`,
      header: {
        'cookie': wx.getStorageSync('cookie')
      },
      method: "POST",
      data: {
        file
      },
      success(res) {
        resolve(res.data)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

export const getMemo = (url, id) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${url}/api/v1/memo/${id}`,
      header: {
        'cookie': wx.getStorageSync('cookie')
      },
      success(res) {
        resolve(res.data)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

export const getMe = (url) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${url}/api/v1/user/me`,
      header: {
        'cookie': wx.getStorageSync('cookie')
      },
      success(res) {
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

export const getUserInfo = (url, userId) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${url}/api/v1/user/${userId}`,
      header: {
        'cookie': wx.getStorageSync('cookie')
      },
      success(res) {
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

export const getStats = (url, creatorId) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${url}/api/v1/memo/stats`,
      data: {
        creatorId
      },
      header: {
        'cookie': wx.getStorageSync('cookie')
      },
      success(res) {
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

export const sendMemo = (url, content, resourceIdList) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${url}/api/v1/memo`,
      header: {
        'cookie': wx.getStorageSync('cookie')
      },
      method: "POST",
      data: {
        content,
        resourceIdList
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

export const signUp = (url, data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${url}/api/v1/auth/signup`,
      method: "POST",
      data: data,
      success(res) {
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

export const deleteMemo = (url, memoId) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${url}/api/v1/memo/${memoId}`,
      header: {
        'cookie': wx.getStorageSync('cookie')
      },
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

export const editMemo = (url, memoId, data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${url}/api/v1/memo/${memoId}`,
      header: {
        'cookie': wx.getStorageSync('cookie')
      },
      method: "PATCH",
      data,
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

export const changeUserSetting = (url, data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${url}/api/v1/user/setting`,
      header: {
        'cookie': wx.getStorageSync('cookie')
      },
      method: "POST",
      data: {
        ...data
      },
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

export const changeMemoPinned = (url, memoId, data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${url}/api/v1/memo/${memoId}/organizer`,
      header: {
        'cookie': wx.getStorageSync('cookie')
      },
      method: "POST",
      data: {
        ...data
      },
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
    wx.request({
      url: `${url}/api/v1/auth/signin`,
      method: "POST",
      data: data,
      success(res) {
        console.log(res)
        wx.setStorageSync('cookie', res.header["Set-Cookie"])
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

export const getTags = (url) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${url}/api/v1/tag`,
      header: {
        'cookie': wx.getStorageSync('cookie')
      },
      success(res) {
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

export const getTagsSuggestionList = (url) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${url}/api/v1/tag/suggestion`,
      header: {
        'cookie': wx.getStorageSync('cookie')
      },
      success(res) {
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

export const upsertTag = (url, TagName) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${url}/api/v1/tag`,
      header: {
        'cookie': wx.getStorageSync('cookie')
      },
      method: "POST",
      data: {
        name: TagName
      },
      success(res) {
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

export const deleteTag = (url, TagName) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${url}/api/v1/tag/delete`,
      method: "POST",
      header: {
        'cookie': wx.getStorageSync('cookie')
      },
      data: {
        name: TagName
      },
      success(res) {
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
      url: `${url}/api/v1/status`,
      success(res) {
        resolve(res)
      },
      fail(err) {
        // wx.vibrateLong()
        // wx.showToast({
        //   icon: 'none',
        //   title: '获取失败',
        // })
        reject(err)
      }
    })
  })
}

export const getExploreMemos = (url, offset, limit) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${url}/api/v1/memo/all?offset=${offset}&limit=${limit}`,
      success(res) {
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
export const getUserMemos = (url, offset, limit, creatorId) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${url}/api/v1/memo?creatorId=${creatorId}&offset=${offset}&limit=${limit}&rowStatus=NORMAL`,
      success(res) {
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