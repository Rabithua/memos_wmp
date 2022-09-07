const cloud = require('wx-server-sdk')
var rp = require('request-promise');
cloud.init()

exports.main = async (event, context) => {
  var options = {
    method: event.method,
    uri: event.url,
    qs: {
      openId: (event.needHost? process.env.hostId : event.openId)
    },
    body: event.body,
    json: true // Automatically stringifies the body to JSON
  }

  return await rp(options)
    .then(function (parsedBody) {
      // POST succeeded...
      return (parsedBody)
    })
    .catch(function (err) {
      // POST failed...
      return (err)
    })
}