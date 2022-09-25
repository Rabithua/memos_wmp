// 云函数入口文件
const cloud = require('wx-server-sdk')
var rp = require('request-promise');
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let url = event.url
  var openId = event.openId
  let method = event.method
  let data = event.data

 switch (method) {
    case 'getMemo': {
      return await rp(url + '/api/memo?openId=' + openId)
        .then(function (res) {
          return res
        })
        .catch(function (err) {
          return err
        })
    }

    case 'sendMemo': {
      return await rp({
          url: url + '/api/memo?openId=' + openId,
          method: 'POST',
          body: data.body,
          json: true
        })
        .then(function (res) {
          return res
        })
        .catch(function (err) {
          return err
        })
    }

    case 'deleteMemo': {
      return await rp({
          url: url + '/api/memo/' + data.memoId + '?openId=' + openId,
          method: 'DELETE'
        })
        .then(function (res) {
          return res
        })
        .catch(function (err) {
          return err
        })
    }

    case 'editMemo': {
      return await rp({
          url: url + '/api/memo/' + data.memoId + '?openId=' + openId,
          method: 'PATCH',
          body: data.body,
          json: true
        })
        .then(function (res) {
          return res
        })
        .catch(function (err) {
          return err
        })
    }

    case 'changeMemoPinned': {
      return await rp({
          url: url + '/api/memo/' + data.memoId + '/organizer?openId=' + openId,
          method: 'POST',
          body: data.body,
          json: true
        })
        .then(function (res) {
          return res
        })
        .catch(function (err) {
          return err
        })
    }

    case 'signIn': {
      return await rp({
          url: url + '/api/auth/signin',
          method: 'POST',
          body: data.body,
          json: true
        })
        .then(function (res) {
          return res
        })
        .catch(function (err) {
          return err
        })
    }

    case 'getTags': {
      return await rp(url + '/api/tag?openId=' + openId)
        .then(function (res) {
          return res
        })
        .catch(function (err) {
          return err
        })
    }

    default:{
      return 'method不存在'
    }
  }

}