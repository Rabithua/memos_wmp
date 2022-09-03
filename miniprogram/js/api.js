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
        wx.showToast({
          title: '获取memos失败',
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
        wx.showToast({
          title: '发送memos失败',
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
      fail(err) {s
        reject(err)
      }
    })
  })
}

export const editMemo = (url, openId, memoId,data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url + '/api/memo/' + memoId + '?openId=' + openId,
      method: "PATCH", 
      data: data,
      success(res) {
        resolve(res.data)
      },
      fail(err) {s
        reject(err)
      }
    })
  })
}