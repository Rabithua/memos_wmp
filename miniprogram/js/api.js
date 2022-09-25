export const getMemos = (url, openId) => {
  return new Promise((resolve, reject) => {
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
    })
  })
}

export const sendMemo = (url, openId, content) => {
  return new Promise((resolve, reject) => {
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
    })
  })
}

export const deleteMemo = (url, openId, memoId) => {
  return new Promise((resolve, reject) => {
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
    })
  })
}

export const editMemo = (url, openId, memoId, data) => {
  return new Promise((resolve, reject) => {
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
    })
  })
}

export const changeMemoPinned = (url, openId, memoId, data) => {
  return new Promise((resolve, reject) => {
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
    })
  })
}

export const signIn = (url, data) => {
  return new Promise((resolve, reject) => {
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
    })
  })
}

export const getTags = (url, openId) => {
  return new Promise((resolve, reject) => {
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
    })
  })
}