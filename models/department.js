var mongoose = require('mongoose')

// 连接数据库
mongoose.connect('mongodb://localhost/test', { useMongoClient: true })

var Schema = mongoose.Schema
var userSchema = new Schema({
  department: {
    type: String,
    required: false
  }
})

module.exports = mongoose.model('Department', userSchema)
