// 云函数入口文件
const cloud = require('wx-server-sdk')
var rp = require('request-promise');
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let url = event.url
  var openId = event.openId
  return await rp(url + '/api/memo?openId=' + openId)
    .then(function (res) {
      return res
    })
    .catch(function (err) {
      return err
    })
}