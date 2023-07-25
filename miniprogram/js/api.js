export const getMemos = (url, limit, offset, rowStatus) => {
  return new Promise((resolve, reject) => {
    let data = {
      limit,
      offset,
      openId: wx.getStorageSync('openId')
    }
    if (rowStatus) {
      data = {
        rowStatus,
        ...data
      }
    }
    wx.request({
      url: `${url}/api/memo`,
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
      openId: wx.getStorageSync('openId')
    }
    wx.request({
      url: `${url}/api/resource`,
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
      url: `${url}/api/resource/${id}?openId=${wx.getStorageSync('openId')}`,
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
      url: `${url}/api/memo/${memoId}/resource/${resourceId}?openId=${wx.getStorageSync('openId')}`,
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
      url: `${url}/api/resource/blob?openId=${wx.getStorageSync('openId')}`,
      method: "POST",
      data: {
        file
      },
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

export const getMemo = (url, id) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${url}/api/memo/${id}`,
      data: {
        openId: wx.getStorageSync('openId')
      },
      success(res) {
        console.log(res)
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
      url: `${url}/api/user/me`,
      data: {
        openId: wx.getStorageSync('openId')
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
      url: `${url}/api/memo/stats`,
      data: {
        creatorId,
        openId: wx.getStorageSync('openId')
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
      url: `${url}/api/memo?openId=${wx.getStorageSync('openId')}`,
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
      url: `${url}/api/auth/signup`,
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
      url: `${url}/api/memo/${memoId}?openId=${wx.getStorageSync('openId')}`,
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
      url: `${url}/api/memo/${memoId}?openId=${wx.getStorageSync('openId')}`,
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
      url: `${url}/api/user/setting?openId=${wx.getStorageSync('openId')}`,
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
      url: `${url}/api/memo/${memoId}/organizer?openId=${wx.getStorageSync('openId')}`,
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
      url: `${url}/api/auth/signin`,
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

export const getTags = (url) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${url}/api/tag`,
      data: {
        openId: wx.getStorageSync('openId')
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
      url: `${url}/api/tag/suggestion`,
      data: {
        openId: wx.getStorageSync('openId')
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
      url: `${url}/api/tag?openId=${wx.getStorageSync('openId')}`,
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
      url: `${url}/api/tag/delete?openId=${wx.getStorageSync('openId')}`,
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
      url: `${url}/api/status`,
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
      url: `${url}/api/memo/all?offset=${offset}&limit=${limit}`,
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