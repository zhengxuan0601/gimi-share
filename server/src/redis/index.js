const chalk = require('chalk')
const redis = require('redis')
const { promisify } = require('util')
const redisLink = 'redis://127.0.0.1:602'
const opts = {
  auth_pass: 'tgbyhnmju'
}
const client = redis.createClient(redisLink, opts)
client.on('connect', function () {
  console.log(
    chalk.green('redis connect success')
  )
})

client.on('error', function (error) {
  console.log(
    chalk.red(error)
  )
})

exports.getAsync = promisify(client.get).bind(client)
exports.setAsync = promisify(client.set).bind(client)
exports.setexAsync = promisify(client.setex).bind(client)
exports.expireAsync = promisify(client.expire).bind(client)
exports.ttlAsync = promisify(client.ttl).bind(client)
exports.delAsync = promisify(client.del).bind(client)
