// app.js
App({
  api: require('/js/api'),
  language: require('/js/language'),

  globalData: {
    // 【一般需要修改为 false】是否开启微信自动登录，需要手动配置后端接口以及开启小程序认证权限才能生效，否则会报错。
    ifWechatLogin: true,
    url: 'https://memos.wowow.club',
    // 搭配ifWechatLogin使用
    backendUrl: 'https://maimoapi.wowow.club/mpunionid',
    top_btn: null,
    top_btn: wx.getMenuButtonBoundingClientRect()
  },
  onLaunch: function (options) {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        traceUser: true,
      });
    }

    //小程序更新提醒
    if (options.scene == 1154) {

    } else {
      if (wx.canIUse('getUpdateManager')) {
        const updateManager = wx.getUpdateManager()
        updateManager.onCheckForUpdate(function (res) {
          if (res.hasUpdate) {
            updateManager.onUpdateReady(function () {
              updateManager.applyUpdate()
              wx.clearStorageSync()
            })
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
        })
      }
    }

    //加载字体
    wx.loadFontFace({
      global: true,
      family: 'Smiley Sans Oblique',
      source: 'https://img.rabithua.club/%E9%BA%A6%E9%BB%98/SmileySans-Oblique.ttf',
      scopes: ['webview', 'native'],
    });

  },

  getUnionId() {
    let that = this
    return new Promise((resolve, reject) => {
      wx.login({
        success(res) {
          if (res.code) {
            //发起网络请求
            wx.request({
              url: that.globalData.backendUrl,
              data: {
                code: res.code
              },
              success(r) {
                let unionid = r.data
                resolve(unionid)
              },
              fail(r) {
                reject(r)
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
            reject(res.errMsg)
          }
        }
      })
    })

  },

  //请求csrf
  reqCookie() {
    let that = this
    wx.showLoading({
      title: '',
    });
    return new Promise((resolve, reject) => {
      that.api.status(that.globalData.url).then((res) => {
        const cookie = res.header["Set-Cookie"];
        if (!cookie) {
          reject(new Error('No cookie was returned')); // 没有设置 cookie
        } else {
          wx.setStorageSync('cookie', cookie);
          wx.hideLoading();
          resolve(cookie); // 返回设置的 cookie
        }
      }).catch((err) => {
        wx.hideLoading();
        reject(err); // 返回错误信息
      });
    });
  },

  //检查csrf
  isCookieExpired(cookieStr) {
    const cookies = cookieStr.split('; ');
    const cookieData = {};
    cookies.forEach(cookie => {
      const [key, value] = cookie.split('=');
      cookieData[key] = value;
    });
    const expiresStr = cookieData['Expires'];
    if (!expiresStr) {
      // 没有过期时间，cookie 没有过期
      return false;
    }
    const expires = new Date(expiresStr);
    const now = new Date();
    // 比较过期时间和当前时间
    return expires.getTime() < now.getTime();
  },

  calTime(timestamp) {
    var now = new Date().getTime()
    // console.log(now)
    var result = now - timestamp * 1000
    let language = this.language.english
    if (wx.getStorageSync('language') == 'chinese') {
      language = this.language.chinese
    }
    if (result / (1000 * 60) > 1440 * 7) {
      var date = new Date(timestamp * 1000)
      var Y = date.getFullYear() + '/'
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/'
      var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
      var h = date.getHours() + ':'
      var m = (date.getMinutes() > 10 ? date.getMinutes() : '0' + date.getMinutes()) + ':'
      var s = (date.getSeconds() > 10 ? date.getSeconds() : '0' + date.getSeconds())
      return (Y + M + D + h + m + s)
    } else if (result / (1000 * 60) > 1440) {
      var d = parseInt(result / (1000 * 60 * 1440))
      return (d + language.common.memoCard.d)
    } else if (result / (1000 * 60) > 60) {
      var h = parseInt(result / (1000 * 60 * 60))
      return (h + language.common.memoCard.h)
    } else if (result / (1000 * 60) > 1) {
      var m = parseInt(result / (1000 * 60))
      return (m + language.common.memoCard.m)
    } else {
      return (language.common.memoCard.now)
    }
  },

  fomaDay(timestamp) {
    var date = new Date(timestamp)
    var Y = date.getFullYear() + '/'
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/'
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())
    return (Y + M + D)
  },

  formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    return size;
  },

  deepCopy(obj) {
    let newObj = Array.isArray(obj) ? [] : {}; // 判断是数组还是对象，选择初始化方式
    for (let key in obj) {
      if (typeof obj[key] === "object" && obj[key] !== null) { // 如果属性值是对象，递归调用deepCopy函数
        newObj[key] = this.deepCopy(obj[key]);
      } else {
        newObj[key] = obj[key]; // 否则直接复制
      }
    }
    return newObj; // 返回新的拷贝对象
  },

  memosRescourse(memo) {
    let fileList_preview = []
    let imgList_preview = []
    let video_preview = []
    for (let l = 0; l < memo.resourceList.length; l++) {
      const rescource = memo.resourceList[l];
      const rescource_id = rescource.publicId
      let rescource_url = this.globalData.url + '/o/r/' + rescource.id + '/' + rescource.publicId
      if (rescource.externalLink) {
        rescource_url = rescource.externalLink
      }

      if (rescource.type.match(/image/)) {
        imgList_preview.push({
          url: rescource_url,
          id: rescource_id
        })
      } else if (rescource.type.match(/video/)) {
        video_preview.push({
          url: rescource_url,
          id: rescource_id
        })
      } else {
        fileList_preview.push({
          url: rescource_url,
          id: rescource_id
        })
      }
    }
    memo.fileList_preview = fileList_preview
    memo.imgList_preview = imgList_preview
    memo.video_preview = video_preview
    return memo
  }

});